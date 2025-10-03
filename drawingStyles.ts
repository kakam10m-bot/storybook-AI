import React from 'react';
import type { DrawingStyle } from './types';
import {
  StorybookIcon,
  RealisticIcon,
  AnimeIcon,
  CartoonIcon,
  FantasyIcon,
  NoirIcon,
  VintageIcon,
  MinimalistIcon,
  CinematicIcon,
  DigitalArtIcon,
} from './components/icons/DrawingStyleIcons';

export interface StyleDefinition {
  name: { ar: string; en: string };
  promptParts: {
    prefix: string;
    suffix: string;
  };
  Icon: React.FC<{ className?: string }>;
}

export const drawingStylesData: Record<DrawingStyle, StyleDefinition> = {
  storybook: {
    name: { ar: 'كتاب أطفال', en: 'Storybook' },
    promptParts: {
      prefix: "A beautiful and vibrant storybook illustration for a children's book. The scene is: ",
      suffix: ". Style: whimsical, colorful, fantasy art, watercolor style. Masterpiece, best quality, highly detailed.",
    },
    Icon: StorybookIcon,
  },
  realistic: {
    name: { ar: 'واقعي', en: 'Realistic' },
    promptParts: {
      prefix: "Masterpiece professional photography, photorealistic, highly detailed image of: ",
      suffix: ". Style: cinematic lighting, hyperrealistic, insanely detailed, sharp focus, 8k, epic composition, best quality.",
    },
    Icon: RealisticIcon,
  },
  anime: {
    name: { ar: 'أنمي', en: 'Anime' },
    promptParts: {
      prefix: "A vibrant masterpiece anime style illustration of: ",
      suffix: ". Style: best quality, highly detailed, 4k, pixiv, Japanese anime, Makoto Shinkai and Studio Ghibli inspired, colorful, beautiful lighting.",
    },
    Icon: AnimeIcon,
  },
  cartoon: {
    name: { ar: 'كرتوني', en: 'Cartoon' },
    promptParts: {
      prefix: "A playful modern cartoon style illustration of: ",
      suffix: ". Style: bold lines, bright colors, fun and energetic, 3D render style inspired by Pixar. Masterpiece, best quality, highly detailed, 4k.",
    },
    Icon: CartoonIcon,
  },
  fantasy: {
    name: { ar: 'فنتازيا', en: 'Fantasy' },
    promptParts: {
      prefix: "Epic fantasy concept art of: ",
      suffix: ". Style: digital painting, dramatic lighting, style of Dungeons and Dragons, high fantasy. Masterpiece, best quality, highly detailed, insanely detailed.",
    },
    Icon: FantasyIcon,
  },
  noir: {
    name: { ar: 'كوميك نوار', en: 'Noir Comic' },
    promptParts: {
      prefix: "A noir comic book style illustration of: ",
      suffix: ". Style: high contrast black and white, dramatic shadows, ink drawing, inspired by Frank Miller's Sin City. Masterpiece, best quality, highly detailed.",
    },
    Icon: NoirIcon,
  },
  vintage: {
    name: { ar: 'عتيق', en: 'Vintage' },
    promptParts: {
      prefix: "A vintage, retro-style illustration of: ",
      suffix: ". Style: sepia tones, 1920s storybook aesthetic, faded colors, classic look. Masterpiece, best quality, highly detailed.",
    },
    Icon: VintageIcon,
  },
  minimalist: {
    name: { ar: 'بسيط', en: 'Minimalist' },
    promptParts: {
      prefix: "A minimalist line art drawing of: ",
      suffix: ". Style: clean lines, simple, elegant, monochromatic, on a clean white background. Masterpiece, best quality, sharp focus.",
    },
    Icon: MinimalistIcon,
  },
  cinematic: {
    name: { ar: 'سينمائي', en: 'Cinematic' },
    promptParts: {
      prefix: "Cinematic film still of: ",
      suffix: ". Captured on 70mm film, dramatic lighting, high detail, photorealistic, sharp focus, epic scope. Masterpiece, best quality, 8k.",
    },
    Icon: CinematicIcon,
  },
  digitalArt: {
    name: { ar: 'فن رقمي', en: 'Digital Art' },
    promptParts: {
      prefix: 'Beautiful trending digital art painting of: ',
      suffix: '. Style: trending on artstation, sharp focus, studio photo, intricate details, highly detailed, by artgerm and greg rutkowski.',
    },
    Icon: DigitalArtIcon,
  },
};

export const drawingStyles = getTranslatedData(drawingStylesData, 'ar');

function getTranslatedData(data: Record<string, StyleDefinition>, lang: 'ar' | 'en') {
    const translated: any = {};
    for (const key in data) {
        translated[key] = {
            ...data[key],
            name: data[key].name[lang]
        }
    }
    return translated;
}