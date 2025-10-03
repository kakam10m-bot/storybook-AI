import type { Theme, ThemeKey } from './types';
import {
  DefaultIcon,
  PlayfulIcon,
  AdventureIcon,
  DreamyIcon,
  MysteryIcon,
  NatureIcon,
  OceanIcon,
  ElegantIcon,
  ScifiIcon,
  HorrorIcon,
  FairyTaleIcon,
  WesternIcon,
  CosmicIcon,
} from './components/icons/ThemeIcons';

interface ThemeData extends Omit<Theme, 'name'> {
    name: { ar: string; en: string };
}

export const themesData: Record<ThemeKey, ThemeData> = {
  default: {
    name: { ar: 'افتراضي', en: 'Default' },
    colors: {
      bg: '#fdfbf6', // Warm, off-white like a book page
      text: '#4a2c2a', // Dark, warm, reddish-brown ink
      heading: '#2a221f', // Very dark, almost black brown
      accent: '#b08d57', // Muted, antique gold
    },
    Icon: DefaultIcon,
  },
  playful: {
    name: { ar: 'مرح', en: 'Playful' },
    colors: {
      bg: '#fffbeb',
      text: '#78350f',
      heading: '#b45309',
      accent: '#f59e0b',
    },
    Icon: PlayfulIcon,
  },
  adventure: {
    name: { ar: 'مغامرة', en: 'Adventure' },
    colors: {
      bg: '#f0fdf4',
      text: '#14532d',
      heading: '#166534',
      accent: '#22c55e',
    },
    Icon: AdventureIcon,
  },
  dreamy: {
    name: { ar: 'حالم', en: 'Dreamy' },
    colors: {
      bg: '#f5f3ff',
      text: '#5b21b6',
      heading: '#4c1d95',
      accent: '#8b5cf6',
    },
    Icon: DreamyIcon,
  },
  mystery: {
    name: { ar: 'غامض', en: 'Mystery' },
    colors: {
      bg: '#1f2937',
      text: '#d1d5db',
      heading: '#f9fafb',
      accent: '#a78bfa',
    },
    Icon: MysteryIcon,
  },
  nature: {
    name: { ar: 'طبيعة', en: 'Nature' },
    colors: {
      bg: '#f4f9f1', // Very light, warm green (new leaves)
      text: '#3c4d32', // Deep mossy green
      heading: '#587156', // Earthy green
      accent: '#8a9a5b', // Olive/sap green
    },
    Icon: NatureIcon,
  },
  ocean: {
    name: { ar: 'محيط', en: 'Ocean' },
    colors: {
      bg: '#f0f9ff',
      text: '#0c4a6e',
      heading: '#0369a1',
      accent: '#38bdf8',
    },
    Icon: OceanIcon,
  },
  elegant: {
    name: { ar: 'أنيق', en: 'Elegant' },
    colors: {
      bg: '#f7f7f7', // Clean, very light grey
      text: '#4a4a4a', // Sophisticated dark grey
      heading: '#1e1e1e', // Almost black
      accent: '#9a8c98', // Muted, dusky purple/grey
    },
    Icon: ElegantIcon,
  },
  scifi: {
    name: { ar: 'خيال علمي', en: 'Sci-Fi' },
    colors: {
      bg: '#111827',
      text: '#9ca3af',
      heading: '#e5e7eb',
      accent: '#6366f1',
    },
    Icon: ScifiIcon,
  },
  horror: {
    name: { ar: 'رعب', en: 'Horror' },
    colors: {
      bg: '#171717',
      text: '#a3a3a3',
      heading: '#f5f5f5',
      accent: '#b91c1c',
    },
    Icon: HorrorIcon,
  },
  fairyTale: {
    name: { ar: 'حكاية خرافية', en: 'Fairy Tale' },
    colors: {
      bg: '#fdf6e4', // Warm, creamy parchment
      text: '#5d4037', // Rich storybook brown
      heading: '#8e24aa', // Deep, magical purple
      accent: '#d81b60', // Vibrant, deep pink/rose
    },
    Icon: FairyTaleIcon,
  },
  western: {
    name: { ar: 'غربي', en: 'Western' },
    colors: {
      bg: '#fff7ed',
      text: '#7c2d12',
      heading: '#9a3412',
      accent: '#ea580c',
    },
    Icon: WesternIcon,
  },
  cosmic: {
    name: { ar: 'فضاء', en: 'Cosmic' },
    colors: {
      bg: '#0c0a09',
      text: '#d4d4d8',
      heading: '#a78bfa',
      accent: '#22d3ee',
    },
    Icon: CosmicIcon,
  },
};

// This is a helper for legacy components that might still expect the old format.
// New components should use themesData and the language state.
export const themes: Record<ThemeKey, Theme> = Object.entries(themesData).reduce((acc, [key, value]) => {
    acc[key as ThemeKey] = { ...value, name: value.name.ar };
    return acc;
}, {} as Record<ThemeKey, Theme>);
