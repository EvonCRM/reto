// lib/fonts.ts
import {
  Abril_Fatface,
  Cormorant_Garamond,
  Great_Vibes,
  Inter,
  Lora,
  Playfair_Display,
  Poppins
} from 'next/font/google';

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins'
});
export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-playfair'
});
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-cormorant'
});
export const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-greatvibes'
});
export const abril = Abril_Fatface({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-abril'
});
export const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-lora'
});

export type FontTheme =
  | 'default'
  | 'tech'
  | 'event'
  | 'editorial'
  | 'perfume'
  | 'wedding'
  | 'elegant';

export function fontClassFor(theme?: FontTheme): string {
  switch (theme) {
    case 'tech':
      return inter.className;
    case 'event':
      return poppins.className;
    case 'editorial':
      return playfair.className;
    case 'perfume':
      return cormorant.className;
    case 'wedding':
      return greatVibes.className + ' ' + lora.className; // títulos cursiva + cuerpo serif
    case 'elegant':
      return lora.className;
    default:
      return inter.className;
  }
}
