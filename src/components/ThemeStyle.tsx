import React from 'react';
import type { StoreSettings } from '../types';

interface ThemeStyleProps {
  settings: StoreSettings | null;
}

export const THEME_PRESETS = [
  {
    id: 'olive',
    name: 'Olive Chic & Lin (Original)',
    emoji: '🌿',
    primary: '#5A5A40',
    primaryHover: '#44442F',
    secondary: '#2D2926',
    accent: '#C5A880',
    bg: '#FAF9F6',
    description: 'Style épuré, élégant et intemporel'
  },
  {
    id: 'ocean',
    name: 'Bleu Océan & Marine (Tech Djibouti)',
    emoji: '🌊',
    primary: '#1E40AF',
    primaryHover: '#1E3A8A',
    secondary: '#0F172A',
    accent: '#38BDF8',
    bg: '#F8FAFC',
    description: 'Idéal pour le high-tech, smartphones et gadgets'
  },
  {
    id: 'emerald',
    name: 'Émeraude & Vert Forêt (Nature & Luxe)',
    emoji: '🌲',
    primary: '#065F46',
    primaryHover: '#064E3B',
    secondary: '#111827',
    accent: '#10B981',
    bg: '#F0FDF4',
    description: 'Élégant, apaisant et haut de gamme'
  },
  {
    id: 'amber',
    name: 'Ambre & Or Royal (Boutique Prestige)',
    emoji: '👑',
    primary: '#B45309',
    primaryHover: '#92400E',
    secondary: '#291804',
    accent: '#F59E0B',
    bg: '#FFFBEB',
    description: 'Parfait pour montres, bijoux et accessoires de luxe'
  },
  {
    id: 'ruby',
    name: 'Bordeaux & Rubis (Mode & Tendance)',
    emoji: '🍷',
    primary: '#881337',
    primaryHover: '#700F2D',
    secondary: '#1C1917',
    accent: '#F43F5E',
    bg: '#FFF1F2',
    description: 'Glamour, chaleureux et séduisant'
  },
  {
    id: 'anthracite',
    name: 'Anthracite & Noir Moderne (Minimaliste)',
    emoji: '🖤',
    primary: '#18181B',
    primaryHover: '#09090B',
    secondary: '#000000',
    accent: '#71717A',
    bg: '#FAFAFA',
    description: 'Contemporain, sobre et ultra-moderne'
  },
  {
    id: 'indigo',
    name: 'Indigo & Violet High-Tech',
    emoji: '💜',
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    secondary: '#0F172A',
    accent: '#818CF8',
    bg: '#F5F3FF',
    description: 'Audacieux, électronique et futuriste'
  },
  {
    id: 'terracotta',
    name: 'Orange Terracotta & Épice',
    emoji: '🟧',
    primary: '#C2410C',
    primaryHover: '#9A3412',
    secondary: '#1C1917',
    accent: '#FB923C',
    bg: '#FFF7ED',
    description: 'Énergique, stimulant et chaleureux'
  }
];

export const ThemeStyle: React.FC<ThemeStyleProps> = ({ settings }) => {
  const primary = settings?.primaryColor || '#5A5A40';
  const primaryHover = settings?.primaryHoverColor || '#44442F';
  const secondary = settings?.secondaryColor || '#2D2926';
  const accent = settings?.accentColor || '#C5A880';
  const bg = settings?.backgroundColor || '#FAF9F6';

  return (
    <style id="djiaccess-dynamic-theme">{`
      :root {
        color-scheme: light !important;
        --color-primary: ${primary};
        --color-primary-hover: ${primaryHover};
        --color-secondary: ${secondary};
        --color-accent: ${accent};
        --color-background: ${bg};
      }

      /* Dynamically override main branding background classes */
      .bg-\\[\\#5A5A40\\] {
        background-color: ${primary} !important;
      }
      .hover\\:bg-\\[\\#4A4A30\\]:hover {
        background-color: ${primaryHover} !important;
      }
      .bg-\\[\\#4A4A30\\] {
        background-color: ${primaryHover} !important;
      }

      /* Dynamically override main branding text colors */
      .text-\\[\\#5A5A40\\] {
        color: ${primary} !important;
      }
      .fill-\\[\\#5A5A40\\] {
        fill: ${primary} !important;
      }

      /* Dynamically override borders & rings */
      .border-\\[\\#5A5A40\\] {
        border-color: ${primary} !important;
      }
      .ring-\\[\\#5A5A40\\] {
        --tw-ring-color: ${primary} !important;
      }

      /* Secondary text color override */
      .text-\\[\\#2D2926\\] {
        color: ${secondary} !important;
      }

      /* Global Site Background */
      .bg-\\[\\#FAF9F6\\] {
        background-color: ${bg} !important;
      }
    `}</style>
  );
};
