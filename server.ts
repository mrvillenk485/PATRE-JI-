import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set high limits for image payloads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please add it to Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Check if Gemini API Key is available
app.get("/api/config", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    hasApiKey: hasKey,
    appUrl: process.env.APP_URL || `http://localhost:${PORT}`,
  });
});

// Endpoint for AI Image Generation
app.post("/api/mockup/generate-bg", async (req, res) => {
  try {
    const { prompt, model, size, aspectRatio } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required for generation" });
    }

    const ai = getGeminiClient();
    
    // Choose model based on request (with sensible fallbacks)
    let selectedModel = model || "gemini-3.1-flash-lite-image";
    // If the model is from metadata (gemini-3-pro-image-preview) convert to gemini-3-pro-image if needed
    if (selectedModel === "gemini-3-pro-image-preview") {
      selectedModel = "gemini-3-pro-image";
    } else if (selectedModel === "gemini-3.1-flash-image-preview") {
      selectedModel = "gemini-3.1-flash-image";
    }

    const config: any = {
      imageConfig: {
        aspectRatio: aspectRatio || "1:1",
      }
    };

    // imageSize is supported for gemini-3-pro-image and gemini-3.1-flash-image
    if (selectedModel === "gemini-3-pro-image" || selectedModel === "gemini-3.1-flash-image") {
      config.imageConfig.imageSize = size || "1K";
    }

    console.log(`Generating image using model: ${selectedModel}, prompt: "${prompt}", size: ${size}, aspect: ${aspectRatio}`);

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config
    });

    let base64Data = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Data = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Data) {
      return res.status(500).json({ 
        error: "No image data was returned by the model. Check if the model is available or if your prompt was filtered." 
      });
    }

    res.json({
      imageUrl: `data:image/png;base64,${base64Data}`,
      prompt,
      model: selectedModel,
      size: size || "1K",
      aspectRatio: aspectRatio || "1:1"
    });

  } catch (error: any) {
    console.error("Image generation error:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred while generating the mockup scene background." 
    });
  }
});

// Endpoint for AI Image Editing (Modifying a base image with a prompt)
app.post("/api/mockup/edit-bg", async (req, res) => {
  try {
    const { prompt, baseImageBase64, model, size, aspectRatio } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required for editing" });
    }
    if (!baseImageBase64) {
      return res.status(400).json({ error: "Base image is required for editing" });
    }

    const ai = getGeminiClient();
    
    let selectedModel = model || "gemini-3.1-flash-lite-image";
    if (selectedModel === "gemini-3-pro-image-preview") {
      selectedModel = "gemini-3-pro-image";
    } else if (selectedModel === "gemini-3.1-flash-image-preview") {
      selectedModel = "gemini-3.1-flash-image";
    }

    // Clean base64 string
    const match = baseImageBase64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    let mimeType = "image/png";
    let pureBase64 = baseImageBase64;
    
    if (match) {
      mimeType = match[1];
      pureBase64 = match[2];
    }

    const config: any = {
      imageConfig: {
        aspectRatio: aspectRatio || "1:1",
      }
    };

    if (selectedModel === "gemini-3-pro-image" || selectedModel === "gemini-3.1-flash-image") {
      config.imageConfig.imageSize = size || "1K";
    }

    console.log(`Editing image using model: ${selectedModel}, prompt: "${prompt}"`);

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: {
        parts: [
          {
            inlineData: {
              data: pureBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config
    });

    let base64Data = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Data = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Data) {
      return res.status(500).json({ 
        error: "No image data was returned by the model during the editing process." 
      });
    }

    res.json({
      imageUrl: `data:image/png;base64,${base64Data}`,
      prompt,
      model: selectedModel,
      size: size || "1K",
      aspectRatio: aspectRatio || "1:1"
    });

  } catch (error: any) {
    console.error("Image editing error:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred while editing the mockup scene background." 
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
