import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { colors, spacing, fontSize, fontWeight, radius } from '../../constants/theme';
import api from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

type InfoRowProps = { icon: any; label: string; value: string };

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={18} color={colors.textSecondary} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [backendName, setBackendName] = useState<string | null>(null);

  useEffect(() => {
    api.get(ENDPOINTS.me)
      .then((res) => setBackendName(res.data.fullName))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      // Alert.alert no dispara callbacks de forma confiable en web
      if (window.confirm('¿Cerrar sesión?')) logout();
      return;
    }
    Alert.alert(
      'Cerrar sesión',
      '¿Estás segura de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
      ]
    );
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? '?';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.displayName}>
            {backendName ?? user?.displayName ?? 'Usuario'}
          </Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
        </View>

        {/* Info */}
        <Card style={styles.card}>
          <InfoRow
            icon="person-outline"
            label="Nombre"
            value={backendName ?? user?.displayName ?? 'Sin nombre'}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="mail-outline"
            label="Email"
            value={user?.email ?? 'Sin email'}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="shield-checkmark-outline"
            label="UID"
            value={user?.uid?.slice(0, 16) + '...' || '—'}
          />
        </Card>

        {/* About */}
        <Card style={styles.card}>
          <View style={styles.aboutHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.aboutTitle}>Acerca de Todoit</Text>
          </View>
          <Text style={styles.aboutText}>
            Aplicación de gestión de tareas construida con React Native, Expo y Firebase.
          </Text>
          <View style={styles.divider} />
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Versión</Text>
            <Text style={styles.versionValue}>1.0.0</Text>
          </View>
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Framework</Text>
            <Text style={styles.versionValue}>Expo SDK 56</Text>
          </View>
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Auth</Text>
            <Text style={styles.versionValue}>Firebase</Text>
          </View>
        </Card>

        {/* Logout */}
        <Button
          label="Cerrar sesión"
          onPress={handleLogout}
          variant="danger"
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: { paddingTop: spacing.sm },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  avatarSection: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  avatarText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textInverse,
  },
  displayName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  card: { gap: spacing.md },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoContent: { flex: 1 },
  infoLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  aboutTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  aboutText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  versionLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  versionValue: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
});