import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { HomeStackParamList, Task, TaskList } from '../../types';
import api from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import { colors, spacing, fontSize, fontWeight, radius } from '../../constants/theme';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

type SearchResult = {
  lists: TaskList[];
  tasks: Task[];
};

export const SearchScreen = () => {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ lists: [], tasks: [] });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults({ lists: [], tasks: [] });
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(ENDPOINTS.search, { params: { q: text.trim() } });
      setResults(res.data);
      setSearched(true);
    } catch {
      setResults({ lists: [], tasks: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const totalResults = results.lists.length + results.tasks.length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar listas y tareas..."
          value={query}
          onChangeText={handleSearch}
          leftIcon="search-outline"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {loading ? (
        <LoadingSpinner message="Buscando..." />
      ) : searched && totalResults === 0 ? (
        <EmptyState
          icon="search-outline"
          title="Sin resultados"
          subtitle={`No se encontró nada para "${query}"`}
        />
      ) : !searched ? (
        <EmptyState
          icon="search-outline"
          title="Busca algo"
          subtitle="Escribe al menos 2 caracteres para buscar"
        />
      ) : (
        <FlatList
          data={[
            ...results.lists.map((l) => ({ type: 'list' as const, item: l })),
            ...results.tasks.map((t) => ({ type: 'task' as const, item: t })),
          ]}
          keyExtractor={(r) => `${r.type}-${r.item.id}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.resultsLabel}>
              {totalResults} resultado{totalResults !== 1 ? 's' : ''}
            </Text>
          }
          renderItem={({ item: result }) => (
            result.type === 'list' ? (
              <TouchableOpacity
                style={styles.resultCard}
                onPress={() =>
                  navigation.navigate('ListDetail', {
                    listId: result.item.id,
                    listTitle: (result.item as TaskList).title,
                  })
                }
                activeOpacity={0.8}
              >
                <View style={[styles.resultIcon, { backgroundColor: 'rgba(168,85,247,0.12)' }]}>
                  <Ionicons name="list" size={18} color={colors.primary} />
                </View>
                <View style={styles.resultContent}>
                  <Text style={styles.resultTitle}>{(result.item as TaskList).title}</Text>
                  <Text style={styles.resultMeta}>Lista</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ) : (
              <View style={styles.resultCard}>
                <View style={[styles.resultIcon, { backgroundColor: '#1C1C1C' }]}>
                  <Ionicons name="checkbox-outline" size={18} color={colors.textSecondary} />
                </View>
                <View style={styles.resultContent}>
                  <Text style={styles.resultTitle}>{(result.item as Task).title}</Text>
                  <Text style={styles.resultMeta}>Tarea</Text>
                </View>
                {(result.item as Task).completed && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                )}
              </View>
            )
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  resultsLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  resultIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(168,85,247,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContent: { flex: 1 },
  resultTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  resultMeta: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});