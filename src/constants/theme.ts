export const colors = {
  // Backgrounds
  bg: '#0C0A14',
  bgCard: 'rgba(139,92,246,0.07)',
  bgInput: 'rgba(255,255,255,0.06)',
  bgModal: 'rgba(12,10,20,0.97)',

  // Brand — Purple
  primary: '#A855F7',
  primaryDark: '#7C3AED',

  // Text
  textPrimary: '#F0EEFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textInverse: '#FFFFFF',

  // States
  danger: '#FF4444',
  warning: '#FFAA00',
  success: '#00CC66',

  // Borders — glass
  border: 'rgba(255,255,255,0.10)',
  borderFocus: '#A855F7',
};

// Glass style preset — úsalo en cualquier componente tipo card
export const glass = {
  shadowColor: '#A855F7',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.18,
  shadowRadius: 16,
  elevation: 6,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 36,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
