import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../../constants/theme';

interface Props {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<Props> = ({
  message,
  fullScreen = false,
}) => (
  <View style={[styles.container, fullScreen && styles.fullScreen]}>
    <ActivityIndicator size="large" color={colors.primary} />
    {message && <Text style={styles.message}>{message}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  message: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});