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
import { listService } from '../../services/listService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { HomeStackParamList } from '../../types';
import { colors, spacing, fontSize, fontWeight, radius } from '../../constants/theme';

type Route = RouteProp<HomeStackParamList, 'ListForm'>;

const ACCENT_COLORS = [
  '#A855F7', '#7C3AED', '#FF4444', '#FFAA00',
  '#00AAFF', '#FF00AA', '#00FFAA', '#FF6600',
];

export const ListFormScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const editingList = params?.list;

  const [title, setTitle] = useState(editingList?.title ?? '');
  const [description, setDescription] = useState(editingList?.description ?? '');
  const [color, setColor] = useState(editingList?.color ?? colors.primary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!editingList;

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('El nombre de la lista es requerido.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        await listService.update(editingList.id, { title: title.trim(), description, color });
      } else {
        await listService.create({ title: title.trim(), description, color });
      }
      navigation.goBack();
    } catch (e: any) {
      const data = e.response?.data;
      setError(data?.message ?? (typeof data === 'string' ? data : null) ?? e.message ?? 'Error al guardar la lista.');
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
            {isEditing ? 'Editar lista' : 'Nueva lista'}
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
            placeholder="Ej. Trabajo, Personal, Compras..."
            value={title}
            onChangeText={setTitle}
            leftIcon="list-outline"
            autoFocus
          />
          <Input
            label="Descripción (opcional)"
            placeholder="Agrega una descripción..."
            value={description}
            onChangeText={setDescription}
            leftIcon="text-outline"
            multiline
            numberOfLines={3}
          />

          {/* Color picker */}
          <View style={styles.colorSection}>
            <Text style={styles.colorLabel}>Color de acento</Text>
            <View style={styles.colorGrid}>
              {ACCENT_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setColor(c)}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    color === c && styles.colorDotSelected,
                  ]}
                >
                  {color === c && (
                    <Ionicons name="checkmark" size={16} color={colors.textInverse} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button
            label={isEditing ? 'Guardar cambios' : 'Crear lista'}
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
  scroll: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  colorSection: { gap: spacing.sm },
  colorLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: colors.textPrimary,
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