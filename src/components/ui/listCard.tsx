import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskList } from '../../types';
import { colors, glass, spacing, fontSize, fontWeight, radius } from '../../constants/theme';

interface Props {
  list: TaskList;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ListCard: React.FC<Props> = ({ list, onPress, onEdit, onDelete }) => {
  const accent = list.color ?? colors.primary;
  const progress =
    list.taskCount && list.taskCount > 0
      ? (list.completedCount ?? 0) / list.taskCount
      : 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
      {/* Accent bar */}
      <View style={[styles.accentBar, { backgroundColor: accent }]} />

      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.title} numberOfLines={1}>{list.title}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="pencil-outline" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>

        {list.description ? (
          <Text style={styles.description} numberOfLines={1}>{list.description}</Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: accent }]} />
          </View>
          <Text style={styles.count}>
            {list.completedCount ?? 0}/{list.taskCount ?? 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: spacing.sm,
    ...glass,
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  count: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    minWidth: 32,
    textAlign: 'right',
  },
});
