/**
 * Badge Component
 * Badge/etiqueta reutilizable para mostrar estados
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SIZES, TYPOGRAPHY } from '../../../config/theme.config';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const badgeStyles: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    style,
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`text_${size}`],
    textStyle,
  ];

  return (
    <View style={badgeStyles}>
      <Text style={textStyles}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
  },
  
  // Variants
  success: {
    backgroundColor: COLORS.success + '20', // 20% opacity
  },
  warning: {
    backgroundColor: COLORS.warning + '20',
  },
  error: {
    backgroundColor: COLORS.error + '20',
  },
  info: {
    backgroundColor: COLORS.info + '20',
  },
  default: {
    backgroundColor: COLORS.border,
  },
  
  // Sizes
  size_sm: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: 2,
  },
  size_md: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
  },
  size_lg: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
  },
  
  // Text
  text: {
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.textPrimary,
  },
  text_sm: {
    fontSize: SIZES.fontXs,
  },
  text_md: {
    fontSize: SIZES.fontSm,
  },
  text_lg: {
    fontSize: SIZES.fontMd,
  },
});

// Helper function to get badge variant from status
export const getBadgeVariantFromStatus = (
  status: string
): BadgeVariant => {
  const statusMap: Record<string, BadgeVariant> = {
    open: 'success',
    closed: 'error',
    progress: 'warning',
    done: 'info',
    cancel: 'error',
    draft: 'default',
  };
  
  return statusMap[status.toLowerCase()] || 'default';
};
