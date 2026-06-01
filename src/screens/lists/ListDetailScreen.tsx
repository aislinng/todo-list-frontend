import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../../hooks/useTasks';
import { TaskItem } from '../../components/ui/TaskItem';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { HomeStackParamList, Task } from '../../types';
import { colors, spacing, fontSize, fontWeight } from '../../constants/theme';

type Route = RouteProp<HomeStackParamList, 'ListDetail'>;
type Nav = NativeStackNavigationProp<HomeStackParamList>;

export const ListDetailScreen = () => {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { listId, listTitle } = params;
  const { tasks, loading, error, fetchTasks, toggleTask, deleteTask } = useTasks(listId);

  useEffect(() => {
    fetchTasks();
  }, []);

  const completed = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? completed / tasks.length : 0;

  const handleDelete = (task: Task) => {
    Alert.alert(
      'Eliminar tarea',
      `¿Eliminar "${task.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteTask(task.id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{listTitle}</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('TaskForm', { listId })}
        >
          <Ionicons name="add" size={24} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>{completed} de {tasks.length} completadas</Text>
          <Text style={styles.progressPct}>{Math.round(progress * 100)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchTasks}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Tasks */}
      {loading && tasks.length === 0 ? (
        <LoadingSpinner message="Cargando tareas..." />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchTasks}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="checkbox-outline"
              title="Sin tareas aún"
              subtitle="Toca + para agregar tu primera tarea"
            />
          }
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={() => toggleTask(item.id, !item.completed)}
              onEdit={() => navigation.navigate('TaskForm', { listId, task: item })}
              onDelete={() => handleDelete(item)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  title: {
    flex: 1,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
  progressPct: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.semibold },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: '#FF444420',
    borderRadius: 8,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FF444440',
  },
  errorText: { flex: 1, fontSize: fontSize.sm, color: colors.danger },
  retryText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.semibold },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
});