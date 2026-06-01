import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { taskService } from '../../services/taskService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { HomeStackParamList, Task } from '../../types';
import { colors, spacing, fontSize, fontWeight, radius } from '../../constants/theme';

type Route = RouteProp<HomeStackParamList, 'TaskForm'>;

type Priority = Task['priority'];

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Baja', color: '#555555' },
  { value: 'medium', label: 'Media', color: colors.warning },
  { value: 'high', label: 'Alta', color: colors.danger },
];

export const TaskFormScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const { listId, task: editingTask } = params;

  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [description, setDescription] = useState(editingTask?.description ?? '');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!editingTask;

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('El nombre de la tarea es requerido.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        title: title.trim(),
        description,
        priority,
        dueDate: dueDate || undefined,
      };
      if (isEditing) {
        await taskService.update(listId, editingTask.id, payload);
      } else {
        await taskService.create(listId, payload);
      }
      navigation.goBack();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Error al guardar la tarea.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Editar tarea' : 'Nueva tarea'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Input
            label="Nombre *"
            placeholder="¿Qué hay que hacer?"
            value={title}
            onChangeText={setTitle}
            leftIcon="checkbox-outline"
            autoFocus
          />

          <Input
            label="Descripción (opcional)"
            placeholder="Agrega más detalles..."
            value={description}
            onChangeText={setDescription}
            leftIcon="text-outline"
            multiline
            numberOfLines={3}
          />

          {/* Priority */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Prioridad</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  onPress={() => setPriority(p.value)}
                  style={[
                    styles.priorityBtn,
                    { borderColor: p.color },
                    priority === p.value && { backgroundColor: p.color },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityLabel,
                      { color: priority === p.value ? colors.textInverse : p.color },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Due date */}
          <Input
            label="Fecha límite (opcional)"
            placeholder="YYYY-MM-DD"
            value={dueDate}
            onChangeText={setDueDate}
            leftIcon="calendar-outline"
            keyboardType="numeric"
          />

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button
            label={isEditing ? 'Guardar cambios' : 'Crear tarea'}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  scroll: { padding: spacing.lg, gap: spacing.lg },
  section: { gap: spacing.sm },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  priorityRow: { flexDirection: 'row', gap: spacing.sm },
  priorityBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  priorityLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FF444420',
    borderRadius: radius.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FF444440',
  },
  errorText: { flex: 1, fontSize: fontSize.sm, color: colors.danger },
});