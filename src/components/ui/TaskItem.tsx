import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../../types';
import { colors, glass, spacing, fontSize, fontWeight, radius } from '../../constants/theme';

interface Props {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const priorityColor: Record<Task['priority'], string> = {
  low: '#6B7280',
  medium: colors.warning,
  high: colors.danger,
};

const priorityLabel: Record<Task['priority'], string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export const TaskItem: React.FC<Props> = ({ task, onToggle, onEdit, onDelete }) => (
  <View style={[styles.container, task.completed && styles.completed]}>
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={styles.checkbox}>
      {task.completed ? (
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
      ) : (
        <Ionicons name="ellipse-outline" size={24} color={colors.textMuted} />
      )}
    </TouchableOpacity>

    <View style={styles.content}>
      <Text style={[styles.title, task.completed && styles.titleDone]} numberOfLines={1}>
        {task.title}
      </Text>
      <View style={styles.meta}>
        <View style={[styles.priorityBadge, { borderColor: priorityColor[task.priority] }]}>
          <Text style={[styles.priorityText, { color: priorityColor[task.priority] }]}>
            {priorityLabel[task.priority]}
          </Text>
        </View>
        {task.dueDate && (
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={11} color={colors.textMuted} />
            <Text style={styles.dateText}>
              {new Date(task.dueDate).toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'short',
              })}
            </Text>
          </View>
        )}
      </View>
    </View>

    <View style={styles.actions}>
      <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="pencil-outline" size={15} color={colors.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="trash-outline" size={15} color={colors.danger} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    ...glass,
  },
  completed: { opacity: 0.45 },
  checkbox: { padding: 2 },
  content: { flex: 1, gap: 4 },
  title: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  priorityBadge: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  priorityText: { fontSize: fontSize.xs, fontWeight: fontWeight.medium },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dateText: { fontSize: fontSize.xs, color: colors.textMuted },
  actions: { gap: spacing.sm },
});
