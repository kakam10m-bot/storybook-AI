import React from 'react';
import type { Difficulty } from './types';
import {
  EasyIcon,
  MediumIcon,
  HardIcon,
} from './components/icons/DifficultyIcons';

interface DifficultyDefinition {
  name: { ar: string, en: string };
  promptSuffix: string;
  Icon: React.FC<{ className?: string }>;
}

export const difficultiesData: Record<Difficulty, DifficultyDefinition> = {
  easy: {
    name: { ar: 'سهل', en: 'Easy' },
    promptSuffix:
      'Simple composition, clear subjects, bright and friendly colors, for kids.',
    Icon: EasyIcon,
  },
  medium: {
    name: { ar: 'متوسط', en: 'Medium' },
    promptSuffix: '',
    Icon: MediumIcon,
  },
  hard: {
    name: { ar: 'صعب', en: 'Hard' },
    promptSuffix:
      'Complex composition, intricate details in the background, dramatic and atmospheric lighting.',
    Icon: HardIcon,
  },
};

// Helper for legacy components
export const difficulties = Object.entries(difficultiesData).reduce((acc, [key, value]) => {
    acc[key as Difficulty] = { ...value, name: value.name.ar };
    return acc;
}, {} as any);