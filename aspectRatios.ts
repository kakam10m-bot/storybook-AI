import React from 'react';
import type { AspectRatioKey } from './types';
import {
  SquareIcon,
  PortraitIcon,
  LandscapeIcon,
  WideIcon,
  TallIcon,
} from './components/icons/AspectRatioIcons';

interface AspectRatioDefinition {
  name: { ar: string, en: string };
  value: '1:1' | '3:4' | '4:3' | '16:9' | '9:16';
  Icon: React.FC<{ className?: string }>;
}

export const aspectRatiosData: Record<AspectRatioKey, AspectRatioDefinition> = {
  square: {
    name: { ar: 'مربع', en: 'Square' },
    value: '1:1',
    Icon: SquareIcon,
  },
  portrait: {
    name: { ar: 'طولي', en: 'Portrait' },
    value: '3:4',
    Icon: PortraitIcon,
  },
  landscape: {
    name: { ar: 'عرضي', en: 'Landscape' },
    value: '4:3',
    Icon: LandscapeIcon,
  },
  wide: {
    name: { ar: 'عريض', en: 'Wide' },
    value: '16:9',
    Icon: WideIcon,
  },
  tall: {
    name: { ar: 'طويل', en: 'Tall' },
    value: '9:16',
    Icon: TallIcon,
  },
};

// Helper for legacy components
export const aspectRatios = Object.entries(aspectRatiosData).reduce((acc, [key, value]) => {
    acc[key as AspectRatioKey] = { ...value, name: value.name.ar };
    return acc;
}, {} as any);