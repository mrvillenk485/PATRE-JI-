import React, { useRef, useState, useEffect } from 'react';
import { MockupConfig, ProductType } from '../types';
import {
  MugMockup,
  TshirtMockup,
  HoodieMockup,
  ToteMockup,
  CapMockup,
  NotebookMockup,
  PhonecaseMockup,
} from './SVGMockups';
import { Move, ZoomIn, RotateCw } from 'lucide-react';

interface MockupCanvasProps {
  config: MockupConfig;
  onChange: (updates: Partial<MockupConfig>) => void;
  customBgUrl: string | null;
  stageRef: React.RefObject<HTMLDivElement | null>;
}

export const MockupCanvas: React.FC<MockupCanvasProps> = ({
  config,
  onChange,
  customBgUrl,
  stageRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialLogoPos, setInitialLogoPos] = useState({ x: 0, y: 0 });

  // Handle standard mouse dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!config.logoUrl) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialLogoPos({ x: config.logoX, y: config.logoY });
  };

  // Handle mobile touch dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!config.logoUrl) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setInitialLogoPos({ x: config.logoX, y: config.logoY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const pctDeltaX = (deltaX / containerWidth) * 100;
      const pctDeltaY = (deltaY / containerHeight) * 100;

      // Constrain position between 0% and 100%
      const newX = Math.max(0, Math.min(100, initialLogoPos.x + pctDeltaX));
      const newY = Math.max(0, Math.min(100, initialLogoPos.y + pctDeltaY));

      onChange({ logoX: newX, logoY: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      if (e.touches.length === 0) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const pctDeltaX = (deltaX / containerWidth) * 100;
      const pctDeltaY = (deltaY / containerHeight) * 100;

      const newX = Math.max(0, Math.min(100, initialLogoPos.x + pctDeltaX));
      const newY = Math.max(0, Math.min(100, initialLogoPos.y + pctDeltaY));

      onChange({ logoX: newX, logoY: newY });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, dragStart, initialLogoPos, onChange]);

  // Determine logo bounding boxes depending on product type to keep logos fitting naturally
  const getProductLogoContainerStyle = (): React.CSSProperties => {
    const { productType } = config;

    switch (productType) {
      case 'mug':
        return {
          position: 'absolute',
          left: '18%',
          top: '30%',
          width: '45%',
          height: '42%',
          pointerEvents: 'none',
        };
      case 'tshirt':
        return {
          position: 'absolute',
          left: '26%',
          top: '25%',
          width: '48%',
          height: '45%',
          pointerEvents: 'none',
        };
      case 'hoodie':
        return {
          position: 'absolute',
          left: '28%',
          top: '26%',
          width: '44%',
          height: '38%',
          pointerEvents: 'none',
        };
      case 'tote':
        return {
          position: 'absolute',
          left: '28%',
          top: '52%',
          width: '44%',
          height: '32%',
          pointerEvents: 'none',
        };
      case 'cap':
        return {
          position: 'absolute',
          left: '35%',
          top: '34%',
          width: '30%',
          height: '18%',
          pointerEvents: 'none',
        };
      case 'notebook':
        return {
          position: 'absolute',
          left: '28%',
          top: '18%',
          width: '44%',
          height: '64%',
          pointerEvents: 'none',
        };
      case 'phonecase':
        return {
          position: 'absolute',
          left: '32%',
          top: '16%',
          width: '36%',
          height: '70%',
          pointerEvents: 'none',
        };
      case 'custom':
      default:
        return {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        };
    }
  };

  const getLogoFilterStyle = (): string => {
    switch (config.logoColorFilter) {
      case 'white':
        return 'brightness(0) invert(1)';
      case 'black':
        return 'brightness(0)';
      case 'grayscale':
        return 'grayscale(100%)';
      case 'none':
      default:
        return 'none';
    }
  };

  const renderProductMockup = () => {
    const props = { color: config.productColor, shadowIntensity: config.shadowIntensity };
    switch (config.productType) {
      case 'mug':
        return <MugMockup {...props} />;
      case 'tshirt':
        return <TshirtMockup {...props} />;
      case 'hoodie':
        return <HoodieMockup {...props} />;
      case 'tote':
        return <ToteMockup {...props} />;
      case 'cap':
        return <CapMockup {...props} />;
      case 'notebook':
        return <NotebookMockup {...props} />;
      case 'phonecase':
        return <PhonecaseMockup {...props} />;
      case 'custom':
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Interactive Mockup Container */}
      <div
        id="mockup-canvas-stage"
        ref={stageRef}
        className="relative w-full max-w-[500px] aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-xl border border-stone-200 transition-all duration-300 flex items-center justify-center select-none"
        style={{
          background: config.productType === 'custom' && customBgUrl ? `url(${customBgUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* If standard product, render its background color & silhouette */}
        {config.productType !== 'custom' && (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            {renderProductMockup()}
          </div>
        )}

        {/* If no custom background was generated/selected yet for custom product type */}
        {config.productType === 'custom' && !customBgUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-stone-400 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl m-4">
            <svg
              className="w-12 h-12 mb-3 text-stone-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="font-medium text-stone-600 mb-1">No AI Scene Generated Yet</p>
            <p className="text-xs max-w-xs">
              Go to the **AI Scene Gen** tab in the sidebar, type a prompt to generate a gorgeous custom background mockup, and place your logo on it!
            </p>
          </div>
        )}

        {/* Logo Layer Placement Area */}
        {config.logoUrl && (config.productType !== 'custom' || customBgUrl) && (
          <div ref={containerRef} style={getProductLogoContainerStyle()}>
            {/* The actual draggable and rotatable logo */}
            <div
              ref={logoRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className={`absolute cursor-move select-none group flex items-center justify-center ${
                isDragging ? 'ring-2 ring-emerald-500 ring-offset-2' : 'hover:ring-1 hover:ring-stone-400 hover:ring-offset-1'
              } transition-shadow duration-150`}
              style={{
                left: `${config.logoX}%`,
                top: `${config.logoY}%`,
                transform: `translate(-50%, -50%) rotate(${config.logoRotation}deg) scale(${config.logoScale})`,
                transformOrigin: 'center center',
                pointerEvents: 'auto',
              }}
            >
              {/* Drag handles/indicator overlay on hover */}
              <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 pointer-events-none">
                <div className="bg-stone-900/70 text-white rounded-full p-1.5 shadow-lg">
                  <Move className="w-4 h-4" />
                </div>
              </div>

              {/* Uploaded Logo Image */}
              <img
                src={config.logoUrl}
                alt="Product Logo Placement"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain pointer-events-none transition-all duration-150"
                style={{
                  opacity: config.logoOpacity,
                  mixBlendMode: config.logoBlendMode,
                  filter: getLogoFilterStyle(),
                }}
              />
            </div>
          </div>
        )}

        {/* Decorative Grid overlays when dragging */}
        {isDragging && (
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-25 border border-emerald-500/50">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-emerald-500/30 border-dashed" />
            ))}
          </div>
        )}

        {/* Draggable Tip Badge */}
        {config.logoUrl && (config.productType !== 'custom' || customBgUrl) && (
          <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-stone-200 pointer-events-none flex items-center gap-1.5 transition-opacity duration-300">
            <Move className="w-3 h-3 text-emerald-400" />
            <span>Click & Drag to reposition logo</span>
          </div>
        )}
      </div>

      {/* Visual Alignment / Transform Feedback Indicators */}
      {config.logoUrl && (
        <div className="flex gap-4 mt-4 text-[11px] font-mono text-stone-500 bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl shadow-sm">
          <span className="flex items-center gap-1">
            <Move className="w-3.5 h-3.5 text-stone-400" />
            Pos: <strong className="text-stone-700">{Math.round(config.logoX)}%, {Math.round(config.logoY)}%</strong>
          </span>
          <span className="flex items-center gap-1">
            <ZoomIn className="w-3.5 h-3.5 text-stone-400" />
            Scale: <strong className="text-stone-700">{Math.round(config.logoScale * 100)}%</strong>
          </span>
          <span className="flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5 text-stone-400" />
            Rot: <strong className="text-stone-700">{config.logoRotation}°</strong>
          </span>
        </div>
      )}
    </div>
  );
};
