import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '../theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'label';
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = COLORS.text,
  align = 'left',
  style,
  children,
  ...rest
}) => {
  const textStyle = [
    styles.text,
    variants[variant],
    { color, textAlign: align },
    style,
  ];

  return (
    <Text style={textStyle} {...rest}>
      {children}
    </Text>
  );
};

const variants = StyleSheet.create({
  h1: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 40,
  },
  h2: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 32,
  },
  h3: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 28,
  },
  body: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 20,
  },
  caption: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 18,
  },
});

const styles = StyleSheet.create({
  text: {
    color: COLORS.text,
  },
});
