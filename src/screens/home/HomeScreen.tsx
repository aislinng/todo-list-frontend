import React, { useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useLists } from '../../hooks/useLists';
import { useAuth } from '../../context/AuthContext';
import { ListCard } from '../../components/ui/listCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { HomeStackParamList, TaskList } from '../../types';
import { colors, spacing, fontSize, fontWeight } from '../../constants/theme';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { lists, loading, error, fetchLists, deleteList } = useLists();

  useEffect(() => {
    fetchLists();
  }, []);

  const handleDelete = (list: TaskList) => {
    Alert.alert(
      'Eliminar lista',
      `¿Eliminar "${list.title}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteList(list.id),
        },
      ]
    );
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.userName}>
            {user?.displayName?.split(' ')[0] ?? 'Usuario'} 👋
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ListForm', {})}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Text style={styles.statNumber}>{lists.length}</Text>
          <Text style={styles.statLabel}>Listas</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={styles.statNumber}>
            {lists.reduce((acc, l) => acc + (l.completedCount ?? 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Completadas</Text>
        </View>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchLists}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* List */}
      {loading && lists.length === 0 ? (
        <LoadingSpinner message="Cargando listas..." />
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchLists}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>Mis listas</Text>
          }
          ListEmptyComponent={
            <EmptyState
              icon="list-outline"
              title="Sin listas aún"
              subtitle="Toca + para crear tu primera lista de tareas"
            />
          }
          renderItem={({ item }) => (
            <ListCard
              list={item}
              onPress={() =>
                navigation.navigate('ListDetail', {
                  listId: item.id,
                  listTitle: item.title,
                })
              }
              onEdit={() => navigation.navigate('ListForm', { list: item })}
              onDelete={() => handleDelete(item)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statChip: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
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
  errorText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.danger,
  },
  retryText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});