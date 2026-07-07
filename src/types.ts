export type ProductType = 'mug' | 'tshirt' | 'hoodie' | 'tote' | 'cap' | 'notebook' | 'phonecase' | 'custom';

export interface ProductMockup {
  id: ProductType;
  name: string;
  category: string;
  baseSvgPath?: string; // Standard pre-made templates
  textureOverlay?: string; // CSS or image URL for fabric/ceramic feel
  defaultColor: string;
  colors: { name: string; hex: string }[];
  logoDefaultScale: number;
  logoDefaultX: number;
  logoDefaultY: number;
}

export interface MockupConfig {
  productType: ProductType;
  productColor: string;
  logoUrl: string | null;
  logoScale: number; // multiplier, e.g., 1.0
  logoX: number; // percentage from left, e.g., 50
  logoY: number; // percentage from top, e.g., 50
  logoRotation: number; // degrees
  logoOpacity: number; // 0 to 1
  logoBlendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';
  logoColorFilter: 'none' | 'white' | 'black' | 'grayscale';
  shadowIntensity: number; // to control realistic shadows
}

export interface GeneratedScene {
  id: string;
  imageUrl: string;
  prompt: string;
  model: string;
  size: string;
  aspectRatio: string;
  createdAt: number;
}

export interface GeneratorParams {
  prompt: string;
  model: 'gemini-3-pro-image' | 'gemini-3.1-flash-image' | 'gemini-3.1-flash-lite-image' | 'gemini-3.1-flash-image-preview';
  size: '1K' | '2K' | '4K' | '512px';
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
}

export interface EditParams {
  baseImageId: string;
  prompt: string;
  model: string;
}
