import React from 'react';

export interface Scene {
  id: string;
  description: string;
  imageUrls: string[];
  feedback?: {
    rating: 'up' | 'down' | null;
    comment: string;
  };
}

export interface Theme {
  name: string;
  colors: {
    bg: string;
    text: string;
    heading: string;
    accent: string;
  };
  Icon: React.FC<{ className?: string }>;
}

export interface Character {
  id: string;
  name: string;
  description: string;
}

export interface StoryData {
  id: string;
  lastModified: number;
  scenes: Scene[];
  storyTitle: string;
  characterDescription: string;
  characters: Character[];
  coverImageUrl: string | null;
  isAdultStory: boolean;
  theme: ThemeKey;
  drawingStyle: DrawingStyle;
  customTextColor: string;
  font: FontKey;
  difficulty: Difficulty;
  aspectRatio: AspectRatioKey;
  writeTextOnImages: boolean;
  pdfLayout: PdfLayoutKey;
  selectedVoiceURI: string | null;
  lang: 'ar' | 'en';
}

export interface User {
  username: string;
  password: string; // In a real app, this would be a hash. For this environment, we store it directly.
}

export type ThemeKey =
  | 'default'
  | 'playful'
  | 'adventure'
  | 'dreamy'
  | 'mystery'
  | 'nature'
  | 'ocean'
  | 'elegant'
  | 'scifi'
  | 'horror'
  | 'fairyTale'
  | 'western'
  | 'cosmic';

export type DrawingStyle =
  | 'storybook'
  | 'realistic'
  | 'anime'
  | 'cartoon'
  | 'fantasy'
  | 'noir'
  | 'vintage'
  | 'minimalist'
  | 'cinematic'
  | 'digitalArt';

export type FontKey = 'cairo' | 'merriweather' | 'lato' | 'montserrat';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type AspectRatioKey = 'square' | 'portrait' | 'landscape' | 'wide' | 'tall';

export type PdfLayoutKey = 'classic' | 'fullBleed' | 'sideBySide';