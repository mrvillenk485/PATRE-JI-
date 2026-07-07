import React from 'react';

interface MockupProps {
  color: string;
  shadowIntensity: number;
  className?: string;
}

export const MugMockup: React.FC<MockupProps> = ({ color, shadowIntensity, className = "w-full h-full" }) => {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soft Drop Shadow under the mug */}
      <ellipse cx="200" cy="350" rx="90" ry="12" fill="black" fillOpacity={0.12 * shadowIntensity} filter="blur(8px)" />
      
      {/* Mug Handle (drawn behind if mug is white, or with highlights/shadows) */}
      <path
        d="M 280 150 C 340 150, 340 290, 280 290"
        stroke={color}
        strokeWidth="32"
        strokeLinecap="round"
        fill="none"
      />
      {/* Handle Highlight / Inner Shadow */}
      <path
        d="M 280 150 C 340 150, 340 290, 280 290"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeOpacity={0.25 * shadowIntensity}
        fill="none"
      />
      <path
        d="M 285 160 C 330 160, 330 280, 285 280"
        stroke="black"
        strokeWidth="4"
        strokeLinecap="round"
        strokeOpacity={0.15 * shadowIntensity}
        fill="none"
      />

      {/* Mug Body Base Fill */}
      <path
        d="M 120 120 L 280 120 C 280 120, 282 310, 275 320 C 265 335, 135 335, 125 320 C 118 310, 120 120, 120 120 Z"
        fill={color}
      />

      {/* Mug Inner/Rim Shadow (shows depth inside the cup) */}
      <ellipse cx="200" cy="120" rx="80" ry="16" fill="black" fillOpacity={0.06} />
      <ellipse cx="200" cy="120" rx="80" ry="16" stroke="black" strokeWidth="1" strokeOpacity={0.15} fill="none" />
      <ellipse cx="200" cy="117" rx="77" ry="14" fill="#3a3a3a" fillOpacity={0.1} />

      {/* Photorealistic Highlights on Mug Body (Spherical 3D feel) */}
      {/* Left Edge Shadow */}
      <path
        d="M 120 120 C 120 120, 140 160, 140 280 C 140 310, 128 322, 125 320"
        stroke="black"
        strokeWidth="16"
        strokeLinecap="round"
        strokeOpacity={0.12 * shadowIntensity}
        fill="none"
        style={{ mixBlendMode: 'multiply' }}
      />
      
      {/* Right Edge Shadow */}
      <path
        d="M 280 120 C 280 120, 260 160, 260 280 C 260 310, 272 322, 275 320"
        stroke="black"
        strokeWidth="16"
        strokeLinecap="round"
        strokeOpacity={0.08 * shadowIntensity}
        fill="none"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Left Glossy Highlight */}
      <path
        d="M 155 130 L 155 310"
        stroke="white"
        strokeWidth="18"
        strokeLinecap="round"
        strokeOpacity={0.3 * shadowIntensity}
        fill="none"
      />
      {/* Left Sharp Accent Highlight */}
      <path
        d="M 168 140 L 168 290"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeOpacity={0.4 * shadowIntensity}
        fill="none"
      />

      {/* Bottom Curve Shadow */}
      <path
        d="M 130 315 C 160 332, 240 332, 270 315"
        stroke="black"
        strokeWidth="12"
        strokeLinecap="round"
        strokeOpacity={0.2 * shadowIntensity}
        fill="none"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Top Rim Highlights */}
      <ellipse cx="200" cy="120" rx="80" ry="16" stroke="white" strokeWidth="2" strokeOpacity={0.4 * shadowIntensity} fill="none" />
    </svg>
  );
};

export const TshirtMockup: React.FC<MockupProps> = ({ color, shadowIntensity, className = "w-full h-full" }) => {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soft shadow under shirt */}
      <path
        d="M 90 375 C 150 382, 250 382, 310 375"
        stroke="black"
        strokeWidth="16"
        strokeLinecap="round"
        strokeOpacity={0.08 * shadowIntensity}
        fill="none"
        filter="blur(6px)"
      />

      {/* T-Shirt Base Body */}
      <path
        d="M 145 80 
           C 130 80, 110 88, 90 102
           L 50 142
           C 42 150, 48 162, 58 160
           L 95 150
           L 102 205
           C 102 210, 100 350, 100 360
           C 100 370, 110 372, 140 372
           L 260 372
           C 290 372, 300 370, 300 360
           C 300 350, 298 210, 298 205
           L 305 150
           L 342 160
           C 352 162, 358 150, 350 142
           L 310 102
           C 290 88, 270 80, 255 80
           C 240 94, 160 94, 145 80 Z"
        fill={color}
      />

      {/* Sleeve Seams */}
      <path d="M 104 150 C 110 120, 120 105, 124 95" stroke="black" strokeWidth="1.5" strokeOpacity={0.15} fill="none" />
      <path d="M 296 150 C 290 120, 280 105, 276 95" stroke="black" strokeWidth="1.5" strokeOpacity={0.15} fill="none" />

      {/* Collar Detail */}
      <path
        d="M 145 80 C 160 96, 240 96, 255 80"
        stroke="black"
        strokeWidth="8"
        strokeOpacity={0.12 * shadowIntensity}
        fill="none"
      />
      <path
        d="M 145 80 C 160 96, 240 96, 255 80"
        stroke="white"
        strokeWidth="2"
        strokeOpacity={0.25 * shadowIntensity}
        fill="none"
      />
      {/* Inner collar shadow */}
      <path
        d="M 145 80 C 165 72, 235 72, 255 80 C 240 90, 160 90, 145 80 Z"
        fill="black"
        fillOpacity={0.15}
      />

      {/* Fabric Folds, Wrinkles & Highlights (creates realistic depth on fabric) */}
      {/* Left armpit fold */}
      <path
        d="M 102 210 C 120 220, 140 215, 155 230"
        stroke="black"
        strokeWidth="6"
        strokeLinecap="round"
        strokeOpacity={0.08 * shadowIntensity}
        fill="none"
        filter="blur(1px)"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M 102 210 C 120 220, 140 215, 155 230"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity={0.12 * shadowIntensity}
        fill="none"
      />

      {/* Right armpit fold */}
      <path
        d="M 298 210 C 280 220, 260 215, 245 230"
        stroke="black"
        strokeWidth="6"
        strokeLinecap="round"
        strokeOpacity={0.08 * shadowIntensity}
        fill="none"
        filter="blur(1px)"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M 298 210 C 280 220, 260 215, 245 230"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity={0.12 * shadowIntensity}
        fill="none"
      />

      {/* Vertical center fabric soft ripple */}
      <path
        d="M 180 120 C 185 200, 175 280, 185 360"
        stroke="white"
        strokeWidth="24"
        strokeLinecap="round"
        strokeOpacity={0.08 * shadowIntensity}
        fill="none"
        filter="blur(4px)"
      />
      <path
        d="M 220 120 C 215 200, 225 280, 215 360"
        stroke="black"
        strokeWidth="20"
        strokeLinecap="round"
        strokeOpacity={0.06 * shadowIntensity}
        fill="none"
        filter="blur(4px)"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Bottom Hem stitch line */}
      <path d="M 100 358 L 300 358" stroke="black" strokeWidth="1" strokeDasharray="3 3" strokeOpacity={0.2} />
      <path d="M 100 361 L 300 361" stroke="black" strokeWidth="1" strokeDasharray="3 3" strokeOpacity={0.2} />
    </svg>
  );
};

export const HoodieMockup: React.FC<MockupProps> = ({ color, shadowIntensity, className = "w-full h-full" }) => {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soft shadow */}
      <path
        d="M 80 375 C 150 384, 250 384, 320 375"
        stroke="black"
        strokeWidth="18"
        strokeLinecap="round"
        strokeOpacity={0.1 * shadowIntensity}
        fill="none"
        filter="blur(6px)"
      />

      {/* Hoodie Base Outline */}
      <path
        d="M 150 110 
           C 135 110, 105 118, 85 130
           L 40 175
           C 32 185, 38 195, 48 193
           L 80 185
           L 85 330
           C 85 355, 100 365, 130 365
           L 270 365
           C 300 365, 315 355, 315 330
           L 320 185
           L 352 193
           C 362 195, 368 185, 360 175
           L 315 130
           C 295 118, 265 110, 250 110
           C 245 100, 230 40, 200 40
           C 170 40, 155 100, 150 110 Z"
        fill={color}
      />

      {/* Hood Interior Overlay */}
      <path
        d="M 150 110 C 160 70, 240 70, 250 110 C 230 135, 170 135, 150 110 Z"
        fill="black"
        fillOpacity={0.25}
      />
      {/* Hood Drawstrings */}
      <path d="M 185 125 C 185 150, 175 180, 178 205" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" strokeOpacity={0.8} />
      <circle cx="178" cy="207" r="4" fill="#cbd5e1" />
      <path d="M 215 125 C 215 150, 225 175, 222 200" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" strokeOpacity={0.8} />
      <circle cx="222" cy="202" r="4" fill="#cbd5e1" />

      {/* Front Kangaroo Pocket */}
      <path
        d="M 130 280 L 270 280 C 285 280, 290 295, 280 305 L 260 335 C 255 342, 245 345, 235 345 L 165 345 C 155 345, 145 342, 140 335 L 120 305 C 110 295, 115 280, 130 280 Z"
        stroke="black"
        strokeWidth="2"
        strokeOpacity={0.12 * shadowIntensity}
        fill={color}
        filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.15))"
      />

      {/* Ribbed Bottom Hem and Cuffs */}
      <path d="M 90 352 L 310 352" stroke="black" strokeWidth="1" strokeOpacity={0.15} />
      <path d="M 90 357 L 310 357" stroke="black" strokeWidth="1" strokeOpacity={0.15} />

      {/* Heavy Fabric Folds (3D depth) */}
      <path
        d="M 85 200 C 110 210, 140 200, 155 220"
        stroke="black"
        strokeWidth="8"
        strokeLinecap="round"
        strokeOpacity={0.1 * shadowIntensity}
        fill="none"
        filter="blur(2px)"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M 315 200 C 290 210, 260 200, 245 220"
        stroke="black"
        strokeWidth="8"
        strokeLinecap="round"
        strokeOpacity={0.1 * shadowIntensity}
        fill="none"
        filter="blur(2px)"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M 150 110 C 170 140, 230 140, 250 110"
        stroke="black"
        strokeWidth="6"
        strokeOpacity={0.15 * shadowIntensity}
        fill="none"
      />
    </svg>
  );
};

export const ToteMockup: React.FC<MockupProps> = ({ color, shadowIntensity, className = "w-full h-full" }) => {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soft shadow */}
      <ellipse cx="200" cy="360" rx="95" ry="12" fill="black" fillOpacity={0.12 * shadowIntensity} filter="blur(6px)" />

      {/* Shoulder Straps */}
      {/* Left Strap */}
      <path
        d="M 155 210 C 150 140, 160 50, 195 50 C 220 50, 215 130, 210 210"
        stroke="#d1caac"
        strokeWidth="14"
        strokeLinecap="round"
        strokeOpacity={0.9}
        fill="none"
        filter="drop-shadow(-1px 3px 2px rgba(0,0,0,0.15))"
      />
      {/* Right Strap */}
      <path
        d="M 190 210 C 185 140, 195 50, 230 50 C 255 50, 250 130, 245 210"
        stroke="#d1caac"
        strokeWidth="14"
        strokeLinecap="round"
        strokeOpacity={0.9}
        fill="none"
        filter="drop-shadow(1px 3px 2px rgba(0,0,0,0.15))"
      />

      {/* Bag Main Body */}
      <path
        d="M 110 200 L 290 200 C 295 200, 305 205, 302 215 L 285 340 C 282 352, 275 355, 265 355 L 135 355 C 125 355, 118 352, 115 340 L 98 215 C 95 205, 105 200, 110 200 Z"
        fill={color}
      />

      {/* Top Rim Stitching */}
      <path
        d="M 102 212 L 298 212"
        stroke="black"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        strokeOpacity={0.2}
      />
      <path
        d="M 100 218 L 300 218"
        stroke="black"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        strokeOpacity={0.2}
      />

      {/* Organic Canvas Texture / Folds overlay */}
      <path
        d="M 135 205 C 138 250, 145 300, 150 350"
        stroke="black"
        strokeWidth="10"
        strokeOpacity={0.06 * shadowIntensity}
        fill="none"
        filter="blur(3px)"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M 265 205 C 262 250, 255 300, 250 350"
        stroke="black"
        strokeWidth="10"
        strokeOpacity={0.06 * shadowIntensity}
        fill="none"
        filter="blur(3px)"
        style={{ mixBlendMode: 'multiply' }}
      />
      
      {/* Soft organic highlights */}
      <path
        d="M 200 205 C 202 250, 198 300, 200 350"
        stroke="white"
        strokeWidth="16"
        strokeOpacity={0.1 * shadowIntensity}
        fill="none"
        filter="blur(4px)"
      />
    </svg>
  );
};

export const CapMockup: React.FC<MockupProps> = ({ color, shadowIntensity, className = "w-full h-full" }) => {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow under the cap */}
      <ellipse cx="200" cy="340" rx="110" ry="16" fill="black" fillOpacity={0.15 * shadowIntensity} filter="blur(8px)" />

      {/* Cap Dome (6-panels structure) */}
      <path
        d="M 90 260 
           C 90 140, 140 100, 200 100
           C 260 100, 310 140, 310 260
           C 310 270, 290 275, 200 275
           C 110 275, 90 270, 90 260 Z"
        fill={color}
      />

      {/* Top Button */}
      <ellipse cx="200" cy="98" rx="14" ry="7" fill={color} stroke="black" strokeWidth="1" strokeOpacity={0.15} />
      <ellipse cx="200" cy="96" rx="12" ry="5" fill="white" fillOpacity={0.25 * shadowIntensity} />

      {/* Panel Seam Lines */}
      {/* Vertical center seam */}
      <path d="M 200 105 C 200 150, 200 220, 200 275" stroke="black" strokeWidth="1.5" strokeOpacity={0.2} />
      {/* Left panel seam */}
      <path d="M 200 105 C 160 140, 130 190, 120 265" stroke="black" strokeWidth="1.2" strokeOpacity={0.15} />
      {/* Right panel seam */}
      <path d="M 200 105 C 240 140, 270 190, 280 265" stroke="black" strokeWidth="1.2" strokeOpacity={0.15} />

      {/* Visor / Brim (creates outstanding 3D cap feel!) */}
      <path
        d="M 85 255
           C 95 285, 140 325, 200 325
           C 260 325, 305 285, 315 255
           C 290 270, 250 282, 200 282
           C 150 282, 110 270, 85 255 Z"
        fill={color}
        filter="drop-shadow(0px 4px 3px rgba(0,0,0,0.25))"
      />

      {/* Visor Stitching Lines */}
      <path
        d="M 100 265 C 115 285, 150 310, 200 310 C 250 310, 285 285, 300 265"
        stroke="black"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        strokeOpacity={0.25}
        fill="none"
      />
      <path
        d="M 112 272 C 125 290, 155 316, 200 316 C 245 316, 275 290, 288 272"
        stroke="black"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        strokeOpacity={0.25}
        fill="none"
      />

      {/* Shadows on dome */}
      {/* Visor cast shadow on bottom of front dome */}
      <path
        d="M 90 260 C 130 250, 270 250, 310 260 C 310 270, 290 275, 200 275 C 110 275, 90 270, 90 260 Z"
        fill="black"
        fillOpacity={0.18 * shadowIntensity}
        style={{ mixBlendMode: 'multiply' }}
      />
      
      {/* Dome left highlight */}
      <path
        d="M 120 150 C 140 130, 175 125, 185 140"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        strokeOpacity={0.15 * shadowIntensity}
        fill="none"
      />
    </svg>
  );
};

export const NotebookMockup: React.FC<MockupProps> = ({ color, shadowIntensity, className = "w-full h-full" }) => {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Large soft drop shadow */}
      <rect x="95" y="65" width="215" height="280" rx="16" fill="black" fillOpacity={0.15 * shadowIntensity} filter="blur(10px)" />

      {/* Pages Edge (gives binder depth on the right) */}
      <rect x="105" y="60" width="200" height="280" rx="12" fill="#faf6e8" stroke="#d5ceb8" strokeWidth="2" />
      <line x1="301" y1="70" x2="301" y2="330" stroke="#d5ceb8" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Book Front Cover (slightly offset left to expose pages) */}
      <rect x="90" y="56" width="205" height="288" rx="14" fill={color} />

      {/* Elegant Spine / Binder strip on the left */}
      <rect x="90" y="56" width="25" height="288" rx="0" fill="black" fillOpacity={0.15} style={{ mixBlendMode: 'multiply' }} />
      <line x1="115" y1="56" x2="115" y2="344" stroke="black" strokeWidth="1" strokeOpacity={0.15} />

      {/* Book Cover Texture Overlay (leather/grain lines) */}
      <line x1="100" y1="56" x2="100" y2="344" stroke="white" strokeWidth="2" strokeOpacity={0.25 * shadowIntensity} />
      <line x1="95" y1="56" x2="95" y2="344" stroke="black" strokeWidth="2" strokeOpacity={0.2 * shadowIntensity} style={{ mixBlendMode: 'multiply' }} />

      {/* Bookmark Ribbon */}
      <path
        d="M 230 338 L 230 375 L 240 365 L 250 375 L 250 338 Z"
        fill="#dc2626"
        filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.25))"
      />

      {/* Glossy highlight running vertically */}
      <rect x="135" y="56" width="24" height="288" fill="white" fillOpacity={0.06 * shadowIntensity} filter="blur(4px)" />
    </svg>
  );
};

export const PhonecaseMockup: React.FC<MockupProps> = ({ color, shadowIntensity, className = "w-full h-full" }) => {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soft phone shadow */}
      <rect x="125" y="55" width="150" height="300" rx="36" fill="black" fillOpacity={0.18 * shadowIntensity} filter="blur(8px)" />

      {/* Phone Case Base */}
      <rect x="120" y="50" width="160" height="300" rx="32" fill={color} stroke="black" strokeWidth="1" strokeOpacity={0.1} />

      {/* Inner Rim Bevel highlight */}
      <rect x="123" y="53" width="154" height="294" rx="29" stroke="white" strokeWidth="2" strokeOpacity={0.22 * shadowIntensity} fill="none" />

      {/* Camera Bump (Modern square camera module) */}
      <rect x="138" y="68" width="54" height="54" rx="14" fill="black" fillOpacity={0.12} />
      <rect x="138" y="68" width="54" height="54" rx="14" stroke="black" strokeWidth="1.5" strokeOpacity={0.15} fill="none" />
      
      {/* 3 Camera Lenses inside bump */}
      <circle cx="152" cy="82" r="8" fill="#1e293b" />
      <circle cx="152" cy="82" r="5" fill="#0f172a" />
      <circle cx="152" cy="81" r="2" fill="white" fillOpacity={0.4} />

      <circle cx="178" cy="82" r="8" fill="#1e293b" />
      <circle cx="178" cy="82" r="5" fill="#0f172a" />
      <circle cx="178" cy="81" r="2" fill="white" fillOpacity={0.4} />

      <circle cx="165" cy="104" r="8" fill="#1e293b" />
      <circle cx="165" cy="104" r="5" fill="#0f172a" />
      <circle cx="165" cy="103" r="2" fill="white" fillOpacity={0.4} />

      {/* Case 3D Gloss / Matte Shading (creates incredibly premium realistic case finish!) */}
      {/* Left Gloss Line */}
      <path
        d="M 135 65 L 135 335"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeOpacity={0.15 * shadowIntensity}
        fill="none"
      />
      {/* Diagonal gloss strip across screen representing reflection */}
      <path
        d="M 125 180 L 275 310"
        stroke="white"
        strokeWidth="24"
        strokeOpacity={0.06 * shadowIntensity}
        fill="none"
        filter="blur(6px)"
      />

      {/* Bottom charger port indicator */}
      <rect x="185" y="344" width="30" height="4" rx="2" fill="black" fillOpacity={0.2} />
    </svg>
  );
};
