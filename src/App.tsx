import React, { useState, useEffect, useRef } from 'react';
import { MockupConfig, GeneratedScene, ProductType } from './types';
import { SAMPLE_LOGOS, MOCKUP_COLORS, PRODUCT_TEMPLATES } from './constants';
import { MockupCanvas } from './components/MockupCanvas';
import { AISceneGenerator } from './components/AISceneGenerator';
import {
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Palette,
  Sliders,
  Sparkles,
  Info,
  Layers,
  Check,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  // Global config state
  const [config, setConfig] = useState<MockupConfig>({
    productType: 'mug',
    productColor: '#f5f5f4',
    logoUrl: SAMPLE_LOGOS[0].url,
    logoScale: 0.65,
    logoX: 42,
    logoY: 52,
    logoRotation: 0,
    logoOpacity: 0.95,
    logoBlendMode: 'multiply',
    logoColorFilter: 'none',
    shadowIntensity: 1.0,
  });

  const [activeTab, setActiveTab] = useState<'products' | 'ai-studio'>('products');
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState<GeneratedScene | null>(null);
  const [history, setHistory] = useState<GeneratedScene[]>([]);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);

  // Check config on load
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        setHasApiKey(data.hasApiKey);
      } catch (err) {
        console.error('Failed to load config:', err);
      }
    };
    checkConfig();

    // Load history & preferences from localStorage
    const savedHistory = localStorage.getItem('mockup_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        if (parsed.length > 0) {
          setCurrentScene(parsed[0]);
          setCustomBgUrl(parsed[0].imageUrl);
        }
      } catch (e) {
        console.error('Error parsing saved history:', e);
      }
    }

    const savedLogo = localStorage.getItem('mockup_logo');
    if (savedLogo) {
      setConfig((prev) => ({ ...prev, logoUrl: savedLogo }));
    }
  }, []);

  // Sync history to localStorage
  const handleSceneGenerated = (scene: GeneratedScene) => {
    const updatedHistory = [scene, ...history];
    setHistory(updatedHistory);
    setCurrentScene(scene);
    setCustomBgUrl(scene.imageUrl);
    // Automatically switch product type to custom when generating background scenes
    setConfig((prev) => ({
      ...prev,
      productType: 'custom',
      logoScale: 0.8,
      logoX: 50,
      logoY: 50,
    }));
    localStorage.setItem('mockup_history', JSON.stringify(updatedHistory));
  };

  const handleSelectScene = (scene: GeneratedScene) => {
    setCurrentScene(scene);
    setCustomBgUrl(scene.imageUrl);
    setConfig((prev) => ({
      ...prev,
      productType: 'custom',
    }));
  };

  const handleClearHistory = () => {
    setHistory([]);
    setCurrentScene(null);
    setCustomBgUrl(null);
    localStorage.removeItem('mockup_history');
  };

  // Change product template values when templates are selected
  const handleProductChange = (type: ProductType) => {
    const template = PRODUCT_TEMPLATES.find((t) => t.id === type);
    if (!template) return;

    setConfig((prev) => ({
      ...prev,
      productType: type,
      productColor: template.defaultColor,
      logoScale: template.logoDefaultScale,
      logoX: template.logoDefaultX,
      logoY: template.logoDefaultY,
      logoRotation: 0,
      logoBlendMode: type === 'mug' || type === 'notebook' || type === 'tshirt' ? 'multiply' : 'normal',
    }));
  };

  // Logo file upload handler
  const processLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setConfig((prev) => ({ ...prev, logoUrl: dataUrl }));
      localStorage.setItem('mockup_logo', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processLogoFile(files[0]);
    }
  };

  // Drag and drop logo handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processLogoFile(files[0]);
    }
  };

  // Clean current logo
  const handleRemoveLogo = () => {
    setConfig((prev) => ({ ...prev, logoUrl: null }));
    localStorage.removeItem('mockup_logo');
  };

  // Canvas compilation for downloading
  const handleExportMockup = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportError(null);

    try {
      const canvas = document.createElement('canvas');
      const size = 1000; // high res export
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not instantiate 2D Canvas context');

      // 1. Draw Background
      if (config.productType === 'custom' && customBgUrl) {
        // Draw AI Custom generated scene
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          bgImg.onload = resolve;
          bgImg.onerror = reject;
          bgImg.src = customBgUrl;
        });
        ctx.drawImage(bgImg, 0, 0, size, size);
      } else {
        // Draw solid background for pre-made templates
        ctx.fillStyle = '#f5f5f4'; // Studio off-white
        ctx.fillRect(0, 0, size, size);

        // Render the pre-made SVG mockup onto the canvas
        const svgElement = document.querySelector('#mockup-canvas-stage svg') as SVGElement;
        if (svgElement) {
          const svgString = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const blobURL = window.URL.createObjectURL(svgBlob);

          const svgImg = new Image();
          await new Promise((resolve, reject) => {
            svgImg.onload = resolve;
            svgImg.onerror = reject;
            svgImg.src = blobURL;
          });
          
          // Draw SVG scaled to fit
          ctx.drawImage(svgImg, 80, 80, size - 160, size - 160);
          window.URL.revokeObjectURL(blobURL);
        }
      }

      // 2. Draw Logo overlay (if present)
      if (config.logoUrl) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          logoImg.onload = resolve;
          logoImg.onerror = reject;
          logoImg.src = config.logoUrl!;
        });

        // Calculate positioning bounding-box depending on product type
        let boundLeft = 0;
        let boundTop = 0;
        let boundWidth = size;
        let boundHeight = size;

        const { productType } = config;
        if (productType === 'mug') {
          boundLeft = size * 0.18;
          boundTop = size * 0.30;
          boundWidth = size * 0.45;
          boundHeight = size * 0.42;
        } else if (productType === 'tshirt') {
          boundLeft = size * 0.26;
          boundTop = size * 0.25;
          boundWidth = size * 0.48;
          boundHeight = size * 0.45;
        } else if (productType === 'hoodie') {
          boundLeft = size * 0.28;
          boundTop = size * 0.26;
          boundWidth = size * 0.44;
          boundHeight = size * 0.38;
        } else if (productType === 'tote') {
          boundLeft = size * 0.28;
          boundTop = size * 0.52;
          boundWidth = size * 0.44;
          boundHeight = size * 0.32;
        } else if (productType === 'cap') {
          boundLeft = size * 0.35;
          boundTop = size * 0.34;
          boundWidth = size * 0.30;
          boundHeight = size * 0.18;
        } else if (productType === 'notebook') {
          boundLeft = size * 0.28;
          boundTop = size * 0.18;
          boundWidth = size * 0.44;
          boundHeight = size * 0.64;
        } else if (productType === 'phonecase') {
          boundLeft = size * 0.32;
          boundTop = size * 0.16;
          boundWidth = size * 0.36;
          boundHeight = size * 0.70;
        }

        // Target coordinates inside boundaries
        const targetX = boundLeft + (boundWidth * config.logoX) / 100;
        const targetY = boundTop + (boundHeight * config.logoY) / 100;

        // Draw with rotation and scaling
        ctx.save();
        ctx.translate(targetX, targetY);
        ctx.rotate((config.logoRotation * Math.PI) / 180);

        // Determine natural bounds to maintain aspect ratio
        const logoAspect = logoImg.width / logoImg.height;
        let drawWidth = boundWidth * config.logoScale;
        let drawHeight = drawWidth / logoAspect;

        // If height is too tall, scale down based on height boundary
        if (drawHeight > boundHeight * config.logoScale) {
          drawHeight = boundHeight * config.logoScale;
          drawWidth = drawHeight * logoAspect;
        }

        // Apply Opacity
        ctx.globalAlpha = config.logoOpacity;

        // Apply Blend Mode
        if (config.logoBlendMode !== 'normal') {
          ctx.globalCompositeOperation = config.logoBlendMode;
        }

        // Apply Color Filters (via secondary canvas rendering if needed, or simple drawing filters)
        if (config.logoColorFilter !== 'none') {
          const filterCanvas = document.createElement('canvas');
          filterCanvas.width = logoImg.width;
          filterCanvas.height = logoImg.height;
          const fCtx = filterCanvas.getContext('2d');
          if (fCtx) {
            fCtx.drawImage(logoImg, 0, 0);
            const imgData = fCtx.getImageData(0, 0, filterCanvas.width, filterCanvas.height);
            const data = imgData.data;

            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const a = data[i + 3];

              if (a > 5) { // alpha gate
                if (config.logoColorFilter === 'white') {
                  data[i] = 255;
                  data[i + 1] = 255;
                  data[i + 2] = 255;
                } else if (config.logoColorFilter === 'black') {
                  data[i] = 0;
                  data[i + 1] = 0;
                  data[i + 2] = 0;
                } else if (config.logoColorFilter === 'grayscale') {
                  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                  data[i] = gray;
                  data[i + 1] = gray;
                  data[i + 2] = gray;
                }
              }
            }
            fCtx.putImageData(imgData, 0, 0);
            ctx.drawImage(filterCanvas, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
          } else {
            ctx.drawImage(logoImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
          }
        } else {
          ctx.drawImage(logoImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        }

        ctx.restore();
      }

      // 3. Trigger Download
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `StudioMockup_${config.productType}_export.png`;
      link.href = dataURL;
      link.click();
    } catch (err: any) {
      console.error(err);
      setExportError(err.message || 'An error occurred during canvas compilation.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800 flex flex-col font-sans antialiased">
      {/* Top Banner / Premium Secrets warning if API key missing */}
      {!hasApiKey && (
        <div className="bg-amber-50 border-b border-amber-200 py-2.5 px-4 text-center text-xs text-amber-800 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Missing Gemini API Key.</strong> Some premium AI background scene generators will be restricted until you add it under **Settings &gt; Secrets**.
          </span>
        </div>
      )}

      {/* Main Navigation Header */}
      <header className="bg-white border-b border-stone-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-stone-900 text-white rounded-xl p-2 flex items-center justify-center shadow-md">
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-stone-900 leading-none">AI Product Mockup Studio</h1>
            <span className="text-[10px] font-mono text-stone-400 mt-1 block">STUDIO EDITION v1.2</span>
          </div>
        </div>

        {/* Action Header Panel */}
        <div className="flex items-center gap-3">
          {config.logoUrl && (
            <button
              onClick={handleExportMockup}
              disabled={isExporting}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Compiling...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res PNG</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Studio Body Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Mockup Interactive Stage Canvas (Columns 1-7) */}
        <section className="lg:col-span-7 bg-white border border-stone-200/80 rounded-3xl p-6 shadow-md flex flex-col justify-between min-h-[500px]">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Interactive Canvas Stage</h2>
              <p className="text-[11px] text-stone-500">Reposition, rotate, and scale your brand logo directly on the surface.</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 text-[10px] font-mono rounded-full bg-stone-100 text-stone-600 capitalize">
                Mockup: {config.productType}
              </span>
              {config.logoUrl && (
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, logoRotation: 0, logoX: 50, logoY: 50 })}
                  className="p-1 hover:bg-stone-100 rounded-md text-stone-400 hover:text-stone-700 transition-colors"
                  title="Reset Position"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {exportError && (
            <div className="mb-4 p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-100">
              {exportError}
            </div>
          )}

          <div className="flex-1 flex items-center justify-center py-4">
            <MockupCanvas
              config={config}
              onChange={(updates) => setConfig((prev) => ({ ...prev, ...updates }))}
              customBgUrl={customBgUrl}
              stageRef={stageRef}
            />
          </div>

          {/* Quick instructions bar */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-stone-400" />
              Tip: Rotate or change blending parameters in the sidebar to increase photo realism.
            </span>
            <span className="font-mono text-[10px]">1000px X 1000px Canvas</span>
          </div>
        </section>

        {/* Right Side: Mockup Configs and AI controls (Columns 8-12) */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          {/* Section Selector Tab Header */}
          <div className="bg-white border border-stone-200/80 p-1.5 rounded-2xl shadow-sm flex">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-3 rounded-xl transition-all ${
                activeTab === 'products'
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Mockup Controls</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-studio')}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-3 rounded-xl transition-all relative ${
                activeTab === 'ai-studio'
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Scene Gen</span>
              {history.length > 0 && (
                <span className="absolute top-1 right-2 bg-emerald-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {history.length}
                </span>
              )}
            </button>
          </div>

          {/* Dynamic Sideboard container */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-md flex-1">
            {activeTab === 'products' ? (
              <div className="flex flex-col gap-6">
                {/* 1. Logo Upload Panel */}
                <div>
                  <h3 className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">1. Upload Brand Logo</h3>
                  
                  {/* Drag-n-drop file gate */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all ${
                      dragOver
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="file"
                      id="logo-upload-input"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    
                    <Upload className="w-6 h-6 text-stone-400 mb-2" />
                    <p className="text-xs font-semibold text-stone-700">Drag & Drop Logo Image</p>
                    <p className="text-[10px] text-stone-400 mt-1">PNG, JPG, SVG with transparent alpha channel is preferred.</p>
                    
                    <label
                      htmlFor="logo-upload-input"
                      className="mt-3 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold px-3.5 py-1.5 border border-stone-300 rounded-lg shadow-sm cursor-pointer transition-colors block"
                    >
                      Browse Files
                    </label>
                  </div>

                  {/* Sample Presets to quickly test */}
                  <div className="mt-3 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-stone-500 tracking-wide uppercase">Or Use Brand Presets</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SAMPLE_LOGOS.map((logo, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setConfig((prev) => ({ ...prev, logoUrl: logo.url }))}
                          className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                            config.logoUrl === logo.url
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-600'
                          }`}
                        >
                          {logo.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {config.logoUrl && (
                    <div className="mt-3 flex items-center justify-between bg-stone-50 border border-stone-200 p-2 rounded-xl">
                      <div className="flex items-center gap-2">
                        <img
                          src={config.logoUrl}
                          alt="mini thumbnail"
                          className="w-8 h-8 rounded border border-stone-200 bg-stone-200 object-contain"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] font-mono text-stone-500 truncate max-w-[150px]">Custom Active Logo</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="text-stone-400 hover:text-red-500 p-1.5 rounded transition-colors"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Select Product Type */}
                <div>
                  <h3 className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">2. Select Product</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {PRODUCT_TEMPLATES.map((tmpl) => {
                      const isSelected = config.productType === tmpl.id;
                      return (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => handleProductChange(tmpl.id as ProductType)}
                          className={`flex flex-col items-start text-left p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-stone-900 bg-stone-50/50'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <span className="text-[10px] text-stone-400 font-medium">{tmpl.category}</span>
                          <span className="text-xs font-bold text-stone-800 mt-0.5 line-clamp-1">{tmpl.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Product Color Variants (Disabled for Custom Background Scene) */}
                {config.productType !== 'custom' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold text-stone-500 tracking-wider uppercase">3. Product Color</h3>
                      <span className="text-[11px] font-mono text-stone-600">{config.productColor}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {MOCKUP_COLORS.map((col) => {
                        const isSelected = config.productColor === col.hex;
                        return (
                          <button
                            key={col.hex}
                            type="button"
                            onClick={() => setConfig({ ...config, productColor: col.hex })}
                            className={`w-6 h-6 rounded-full border border-stone-300 relative flex items-center justify-center transition-transform hover:scale-110`}
                            style={{ backgroundColor: col.hex }}
                            title={col.name}
                          >
                            {isSelected && (
                              <Check className={`w-3.5 h-3.5 ${col.hex === '#1c1917' || col.hex === '#14532d' || col.hex === '#7f1d1d' || col.hex === '#1e3a8a' ? 'text-white' : 'text-stone-900'}`} />
                            )}
                          </button>
                        );
                      })}
                      {/* Custom color picker */}
                      <div className="w-6 h-6 rounded-full border border-stone-300 relative overflow-hidden">
                        <input
                          type="color"
                          value={config.productColor}
                          onChange={(e) => setConfig({ ...config, productColor: e.target.value })}
                          className="absolute -inset-1 w-8 h-8 cursor-pointer border-0 p-0 bg-transparent"
                          title="Custom Palette"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Fine-Tuning Controls Slider panel */}
                {config.logoUrl && (
                  <div className="border-t border-stone-100 pt-4 flex flex-col gap-4">
                    <h3 className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-1">4. Logo Placement & Styling</h3>

                    {/* Quick Alignment Preset Grid */}
                    <div className="flex flex-col gap-2 bg-stone-50 border border-stone-200/80 p-3 rounded-2xl">
                      <span className="text-[10px] font-bold text-stone-500 tracking-wide uppercase">Quick Snap Alignment</span>
                      <div className="flex items-center gap-4">
                        <div className="grid grid-cols-3 gap-1.5 w-24 h-24 bg-white p-1.5 border border-stone-200 rounded-xl shadow-inner shrink-0">
                          {[
                            { name: 'Top-Left', x: 20, y: 20, label: '↖' },
                            { name: 'Top-Center', x: 50, y: 20, label: '↑' },
                            { name: 'Top-Right', x: 80, y: 20, label: '↗' },
                            { name: 'Middle-Left', x: 20, y: 50, label: '←' },
                            { name: 'Center', x: 50, y: 50, label: '•' },
                            { name: 'Middle-Right', x: 80, y: 50, label: '→' },
                            { name: 'Bottom-Left', x: 20, y: 80, label: '↙' },
                            { name: 'Bottom-Center', x: 50, y: 80, label: '↓' },
                            { name: 'Bottom-Right', x: 80, y: 80, label: '↘' },
                          ].map((pos, idx) => {
                            const isCurrent = Math.abs(config.logoX - pos.x) < 5 && Math.abs(config.logoY - pos.y) < 5;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setConfig({ ...config, logoX: pos.x, logoY: pos.y })}
                                className={`flex items-center justify-center text-xs font-bold rounded transition-all duration-150 aspect-square cursor-pointer ${
                                  isCurrent
                                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500'
                                    : 'bg-stone-50 hover:bg-stone-200 text-stone-500 border border-stone-200'
                                }`}
                                title={`Snap to ${pos.name}`}
                              >
                                {pos.label}
                              </button>
                            );
                          })}
                        </div>
                        <div className="text-[11px] text-stone-500 leading-normal">
                          Click any grid cell to instantly snap your logo to that zone. Drag the logo on the canvas to fine-tune freely.
                        </div>
                      </div>
                    </div>

                    {/* Scale */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600 font-medium">Logo Scale</span>
                        <span className="font-mono font-bold text-stone-700">{Math.round(config.logoScale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="2.0"
                        step="0.05"
                        value={config.logoScale}
                        onChange={(e) => setConfig({ ...config, logoScale: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                      />
                    </div>

                    {/* Rotation */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600 font-medium">Rotation Angle</span>
                        <span className="font-mono font-bold text-stone-700">{config.logoRotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={config.logoRotation}
                        onChange={(e) => setConfig({ ...config, logoRotation: parseInt(e.target.value) })}
                        className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                      />
                    </div>

                    {/* Opacity */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600 font-medium">Print Opacity</span>
                        <span className="font-mono font-bold text-stone-700">{Math.round(config.logoOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={config.logoOpacity}
                        onChange={(e) => setConfig({ ...config, logoOpacity: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                      />
                    </div>

                    {/* Grid options for Blendmode and Filters */}
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      {/* Blend Mode */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-stone-500 tracking-wide uppercase">Blend Mode</span>
                        <select
                          value={config.logoBlendMode}
                          onChange={(e: any) => setConfig({ ...config, logoBlendMode: e.target.value })}
                          className="text-xs bg-stone-50 border border-stone-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="normal">Normal (Solid)</option>
                          <option value="multiply">Multiply (Ink Blend)</option>
                          <option value="screen">Screen (Lighten)</option>
                          <option value="overlay">Overlay (Textures)</option>
                          <option value="darken">Darken</option>
                          <option value="lighten">Lighten</option>
                        </select>
                      </div>

                      {/* Color Filter */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-stone-500 tracking-wide uppercase">Color Overlays</span>
                        <select
                          value={config.logoColorFilter}
                          onChange={(e: any) => setConfig({ ...config, logoColorFilter: e.target.value })}
                          className="text-xs bg-stone-50 border border-stone-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="none">Original Colors</option>
                          <option value="white">Monochrome White</option>
                          <option value="black">Monochrome Black</option>
                          <option value="grayscale">Grayscale</option>
                        </select>
                      </div>
                    </div>

                    {/* Shadow / Highlight Strength slider for standard designs */}
                    {config.productType !== 'custom' && (
                      <div className="flex flex-col gap-1.5 border-t border-stone-100 pt-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-600 font-medium">Photorealistic Lighting Strength</span>
                          <span className="font-mono font-bold text-stone-700">{Math.round(config.shadowIntensity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.0"
                          max="1.5"
                          step="0.1"
                          value={config.shadowIntensity}
                          onChange={(e) => setConfig({ ...config, shadowIntensity: parseFloat(e.target.value) })}
                          className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <AISceneGenerator
                onSceneGenerated={handleSceneGenerated}
                currentScene={currentScene}
                history={history}
                onSelectScene={handleSelectScene}
                onClearHistory={handleClearHistory}
              />
            )}
          </div>
        </section>
      </main>

      {/* Decorative footer elements */}
      <footer className="bg-white border-t border-stone-200/80 py-4 px-6 text-center text-xs text-stone-400 mt-6 font-mono">
        <p>© 2026 AI Product Mockup Studio. Powering real-time visual branding.</p>
      </footer>
    </div>
  );
}
