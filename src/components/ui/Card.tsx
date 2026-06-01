import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, glass, radius, spacing } from '../../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}

export const Card: React.FC<Props> = ({ children, style, padded = true }) => (
  <View style={[styles.card, padded && styles.padded, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...glass,
  },
  padded: { padding: spacing.md },
});
