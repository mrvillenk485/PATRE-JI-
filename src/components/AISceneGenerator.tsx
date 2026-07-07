import React, { useState } from 'react';
import { GeneratorParams, GeneratedScene } from '../types';
import { Sparkles, RefreshCw, Layers, History, Image as ImageIcon, Check, ChevronRight, Wand2 } from 'lucide-react';

interface AISceneGeneratorProps {
  onSceneGenerated: (scene: GeneratedScene) => void;
  currentScene: GeneratedScene | null;
  history: GeneratedScene[];
  onSelectScene: (scene: GeneratedScene) => void;
  onClearHistory: () => void;
}

const PRESET_SUGGESTIONS = [
  {
    label: "Cozy Wooden Table Mug",
    prompt: "Minimalist ceramic mug resting on a clean dark walnut wooden table, morning window light, delicate shadows of an olive branch, photorealistic, cinematic"
  },
  {
    label: "Flat-Lay Retail T-Shirt",
    prompt: "Blank premium heavy cotton t-shirt folded neatly on a textured concrete surface, surrounded by minimalist aesthetic store items, overhead view, high-contrast studio lighting"
  },
  {
    label: "Street Style Hoodie Model",
    prompt: "Close up shot of a stylish model wearing a blank minimalist oversized hoodie, walking in a gritty industrial urban street at golden hour, shallow depth of field, professional photoshoot"
  },
  {
    label: "Office Desk Notebook",
    prompt: "Minimalist hardcover journal notebook placed diagonally on a sleek marble desk next to a luxury metallic ink pen, soft shadows, cozy warm coffee shop ambient lighting, top view"
  },
  {
    label: "Glossy Phone Case Exhibit",
    prompt: "Modern smartphone case with sleek edges standing upright on an architectural brutalist sandstone pedestal, sand dunes in background, sunset warm lighting, luxury product design render"
  }
];

export const AISceneGenerator: React.FC<AISceneGeneratorProps> = ({
  onSceneGenerated,
  currentScene,
  history,
  onSelectScene,
  onClearHistory
}) => {
  const [params, setParams] = useState<GeneratorParams>({
    prompt: "",
    model: "gemini-3.1-flash-image",
    size: "1K",
    aspectRatio: "1:1"
  });

  const [editPrompt, setEditPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState("");

  const steps = [
    "Analyzing mockup boundaries...",
    "Drafting surface light gradients...",
    "Weaving high-res realistic textures...",
    "Polishing photorealistic ambient details...",
    "Completing background rendering..."
  ];

  const runLoadingAnimation = () => {
    let index = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      index = (index + 1) % steps.length;
      setLoadingStep(steps[index]);
    }, 2800);
    return interval;
  };

  const handleGenerate = async () => {
    if (!params.prompt.trim()) {
      setError("Please write or select a visual scene prompt first.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    const animInterval = runLoadingAnimation();

    try {
      const response = await fetch("/api/mockup/generate-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate mockup scene.");
      }

      const newScene: GeneratedScene = {
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: data.imageUrl,
        prompt: data.prompt,
        model: data.model,
        size: data.size,
        aspectRatio: data.aspectRatio,
        createdAt: Date.now()
      };

      onSceneGenerated(newScene);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      clearInterval(animInterval);
      setIsGenerating(false);
    }
  };

  const handleEditScene = async () => {
    if (!editPrompt.trim()) {
      setError("Please write an edit instruction first.");
      return;
    }
    if (!currentScene) {
      setError("You must have an active generated scene to edit it.");
      return;
    }

    setIsEditing(true);
    setError(null);
    const animInterval = runLoadingAnimation();

    try {
      const response = await fetch("/api/mockup/edit-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: editPrompt,
          baseImageBase64: currentScene.imageUrl,
          model: params.model,
          size: params.size,
          aspectRatio: params.aspectRatio
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to modify image.");
      }

      const editedScene: GeneratedScene = {
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: data.imageUrl,
        prompt: `Edited: ${editPrompt} (Base: ${currentScene.prompt})`,
        model: data.model,
        size: data.size,
        aspectRatio: data.aspectRatio,
        createdAt: Date.now()
      };

      onSceneGenerated(editedScene);
      setEditPrompt("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during the editing process.");
    } finally {
      clearInterval(animInterval);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Header Info */}
      <div>
        <h3 className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          AI Mockup Scene Studio
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Generate gorgeous custom photorealistic scenes using Gemini to place your logo onto.
        </p>
      </div>

      {/* Error Message banner */}
      {error && (
        <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
          <p className="font-semibold mb-0.5">Studio Issue</p>
          <p>{error}</p>
        </div>
      )}

      {/* Suggestion Prompts Accordion */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
        <span className="text-[11px] font-semibold text-stone-600 tracking-wider uppercase block mb-2">
          Preset Ideas (Click to populate)
        </span>
        <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
          {PRESET_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setParams({ ...params, prompt: s.prompt })}
              className="text-left text-xs bg-white hover:bg-stone-100 hover:border-stone-400 border border-stone-200 text-stone-700 px-2.5 py-1.5 rounded-lg transition-colors truncate block"
              title={s.prompt}
            >
              <strong>{s.label}</strong>
            </button>
          ))}
        </div>
      </div>

      {/* Generator Prompt Box */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-700">Visual Scene Prompt</label>
          <textarea
            value={params.prompt}
            onChange={(e) => setParams({ ...params, prompt: e.target.value })}
            placeholder="Describe the background scene details..."
            rows={3}
            className="w-full text-xs bg-white border border-stone-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Configurations - Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Model Selection */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-stone-500 tracking-wider uppercase">Model</label>
            <select
              value={params.model}
              onChange={(e: any) => setParams({ ...params, model: e.target.value })}
              className="w-full text-xs bg-white border border-stone-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="gemini-3.1-flash-image">Gemini Flash Image</option>
              <option value="gemini-3-pro-image">Gemini Pro Image (Paid)</option>
              <option value="gemini-3.1-flash-lite-image">Gemini Lite Image</option>
            </select>
          </div>

          {/* Size Affordance (Required: 1K, 2K, 4K) */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-stone-500 tracking-wider uppercase">Image Resolution</label>
            <select
              value={params.size}
              onChange={(e: any) => setParams({ ...params, size: e.target.value })}
              disabled={params.model === "gemini-3.1-flash-lite-image"}
              className="w-full text-xs bg-white border border-stone-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            >
              <option value="512px">512px</option>
              <option value="1K">1K HD (Default)</option>
              <option value="2K">2K Super-HD</option>
              <option value="4K">4K Ultra-HD</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-stone-500 tracking-wider uppercase">Aspect Ratio</label>
            <select
              value={params.aspectRatio}
              onChange={(e: any) => setParams({ ...params, aspectRatio: e.target.value })}
              className="w-full text-xs bg-white border border-stone-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="1:1">Square 1:1</option>
              <option value="4:3">Standard 4:3</option>
              <option value="16:9">Widescreen 16:9</option>
              <option value="3:4">Portrait 3:4</option>
              <option value="9:16">Vertical 9:16</option>
            </select>
          </div>
        </div>

        {/* Generate Action Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || isEditing}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 py-2.5 px-4 rounded-xl shadow-md transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Generating Scene...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Generate Background Scene</span>
            </>
          )}
        </button>
      </div>

      {/* AI Edit Feature - satisfies 'create or edit images' with text prompt */}
      {currentScene && (
        <div className="mt-2 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex flex-col gap-2.5">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 tracking-wider uppercase flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5" />
              AI Magic Wand (Modify Scene)
            </span>
            <p className="text-[10px] text-stone-500">
              Type instructions to edit the current background image directly (e.g. "change the tabletop to dark mahoganywood", "add a small potted succulent").
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="E.g. Change table to stone..."
              disabled={isGenerating || isEditing}
              className="flex-1 text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handleEditScene}
              disabled={isGenerating || isEditing || !editPrompt.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
            >
              {isEditing ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <span>Edit</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Loading Steps visualizer */}
      {(isGenerating || isEditing) && (
        <div className="p-3 bg-stone-900 text-stone-100 rounded-xl flex flex-col items-center justify-center gap-2 text-center animate-pulse">
          <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
          <span className="text-xs font-semibold">{loadingStep}</span>
          <p className="text-[10px] text-stone-400">
            Note: Image synthesis takes a few moments to render pristine resolutions and highlights.
          </p>
        </div>
      )}

      {/* History Grid */}
      {history.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-stone-600 tracking-wider uppercase flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-stone-400" />
              Scene History ({history.length})
            </span>
            <button
              type="button"
              onClick={onClearHistory}
              className="text-[10px] text-stone-400 hover:text-red-500 cursor-pointer"
            >
              Clear
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 max-h-[140px] overflow-y-auto pr-1">
            {history.map((h) => {
              const isActive = currentScene?.id === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => onSelectScene(h)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    isActive ? "border-emerald-500 scale-95" : "border-stone-200 hover:border-stone-400"
                  }`}
                  title={h.prompt}
                >
                  <img
                    src={h.imageUrl}
                    alt="History mockup"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                      <div className="bg-emerald-500 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
