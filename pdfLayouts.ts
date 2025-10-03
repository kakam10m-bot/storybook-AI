import React from 'react';
import type { PdfLayoutKey } from './types';
import {
  ClassicLayoutIcon,
  FullBleedLayoutIcon,
  SideBySideLayoutIcon,
} from './components/icons/PdfLayoutIcons';

interface PdfLayoutDefinition {
  name: { ar: string, en: string };
  Icon: React.FC<{ className?: string }>;
}

export const pdfLayoutsData: Record<PdfLayoutKey, PdfLayoutDefinition> = {
  classic: {
    name: { ar: 'كلاسيكي', en: 'Classic' },
    Icon: ClassicLayoutIcon,
  },
  fullBleed: {
    name: { ar: 'صورة كاملة', en: 'Full Bleed' },
    Icon: FullBleedLayoutIcon,
  },
  sideBySide: {
    name: { ar: 'جنبًا إلى جنب', en: 'Side by Side' },
    Icon: SideBySideLayoutIcon,
  },
};

// Helper for legacy components
export const pdfLayouts = Object.entries(pdfLayoutsData).reduce((acc, [key, value]) => {
    acc[key as PdfLayoutKey] = { ...value, name: value.name.ar };
    return acc;
}, {} as any);