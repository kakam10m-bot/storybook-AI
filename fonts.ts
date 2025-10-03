import type { FontKey } from './types';

interface FontData {
    name: { ar: string; en: string };
    family: string;
    className: string;
}

export const fontsData: Record<FontKey, FontData> = {
    cairo: { name: { ar: 'كايرو', en: 'Cairo' }, family: 'Cairo, sans-serif', className: 'font-cairo' },
    merriweather: { name: { ar: 'ميريويذر', en: 'Merriweather' }, family: 'Merriweather, serif', className: 'font-merriweather' },
    lato: { name: { ar: 'لاتو', en: 'Lato' }, family: 'Lato, sans-serif', className: 'font-lato' },
    montserrat: { name: { ar: 'مونتسيرات', en: 'Montserrat' }, family: 'Montserrat, sans-serif', className: 'font-montserrat' },
};

// Helper for legacy components
export const fonts = Object.entries(fontsData).reduce((acc, [key, value]) => {
    acc[key as FontKey] = { ...value, name: value.name.ar };
    return acc;
}, {} as Record<FontKey, { name: string; family: string; className: string; }>);