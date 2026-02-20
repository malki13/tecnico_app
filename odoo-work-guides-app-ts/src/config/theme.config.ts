/**
 * Theme Configuration
 * Configuración del tema de la aplicación
 */

export const COLORS = {
  // Primary colors
  primary: '#007AFF',
  primaryLight: '#99c9ff',
  primaryDark: '#0051a8',
  
  // Secondary colors
  secondary: '#34c759',
  secondaryLight: '#a8e6b8',
  secondaryDark: '#248a3d',
  
  // Neutral colors
  background: '#f5f5f5',
  surface: '#ffffff',
  border: '#e0e0e0',
  
  // Text colors
  textPrimary: '#1a1a1a',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textDisabled: '#cccccc',
  
  // Status colors
  success: '#34c759',
  warning: '#ff9500',
  error: '#ff3b30',
  info: '#007AFF',
  
  // State colors
  open: '#e8f5e9',
  closed: '#ffebee',
  progress: '#fff3cd',
  done: '#d1ecf1',
  cancel: '#f8d7da',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Transparent
  transparent: 'transparent',
} as const;

export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Border radius
  radiusXs: 4,
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusFull: 9999,
  
  // Icon sizes
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  iconXl: 48,
  
  // Font sizes
  fontXs: 11,
  fontSm: 12,
  fontMd: 14,
  fontBase: 16,
  fontLg: 18,
  fontXl: 20,
  font2xl: 24,
  font3xl: 32,
  
  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
  
  // Border widths
  borderThin: 1,
  borderMedium: 2,
  borderThick: 4,
  
  // Button heights
  buttonSm: 32,
  buttonMd: 44,
  buttonLg: 56,
  
  // Input heights
  inputSm: 36,
  inputMd: 48,
  inputLg: 56,
} as const;

export const TYPOGRAPHY = {
  // Font families (ajustar según las fuentes disponibles)
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
  
  // Font weights
  weightLight: '300' as const,
  weightRegular: '400' as const,
  weightMedium: '500' as const,
  weightSemibold: '600' as const,
  weightBold: '700' as const,
} as const;

export const SHADOWS = {
  // Shadow presets
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const SPACING = {
  // Container padding
  containerPadding: SIZES.md,
  
  // Card padding
  cardPadding: SIZES.md,
  
  // Section spacing
  sectionSpacing: SIZES.lg,
  
  // List item spacing
  listItemSpacing: SIZES.md,
} as const;

export const THEME = {
  colors: COLORS,
  sizes: SIZES,
  typography: TYPOGRAPHY,
  shadows: SHADOWS,
  spacing: SPACING,
} as const;

export type Theme = typeof THEME;
export type Colors = typeof COLORS;
export type Sizes = typeof SIZES;
