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
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { colors, spacing, fontSize, fontWeight, radius } from '../../constants/theme';

type Mode = 'login' | 'register';

export const LoginScreen = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearError = () => setError('');

  const getFirebaseError = (code: string): string => {
    const errors: Record<string, string> = {
      'auth/invalid-email': 'Email inválido.',
      'auth/user-not-found': 'No existe una cuenta con este email.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/email-already-in-use': 'Este email ya está registrado.',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
      'auth/network-request-failed': 'Error de red. Verifica tu conexión.',
      'auth/popup-closed-by-user': 'Inicio con Google cancelado.',
    };
    return errors[code] ?? 'Ocurrió un error. Intenta de nuevo.';
  };

  const handleSubmit = async () => {
    clearError();
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (mode === 'register' && !displayName) {
      setError('El nombre es requerido.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await authService.loginWithEmail(email, password);
      } else {
        await authService.registerWithEmail(email, password, displayName);
      }
      // AuthContext detecta el cambio automáticamente vía onAuthStateChanged
    } catch (e: any) {
      if (e.code?.startsWith('auth/')) {
        setError(getFirebaseError(e.code));
      } else {
        setError(e.message ?? 'Ocurrió un error. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('Google Sign-In no disponible aún en esta versión.');
  };

  const toggleMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    clearError();
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="checkmark-done" size={32} color={colors.textInverse} />
            </View>
            <Text style={styles.appName}>Todoit</Text>
            <Text style={styles.tagline}>
              {mode === 'login' ? 'Bienvenida de nuevo' : 'Crea tu cuenta'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {mode === 'register' && (
              <Input
                label="Nombre"
                placeholder="Tu nombre"
                value={displayName}
                onChangeText={setDisplayName}
                leftIcon="person-outline"
                autoCapitalize="words"
              />
            )}
            <Input
              label="Email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Input
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              leftIcon="lock-closed-outline"
              isPassword
            />
            {mode === 'register' && (
              <Text style={styles.passwordHint}>
                Mínimo 8 caracteres, una mayúscula, una minúscula y un número.
              </Text>
            )}

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Button
              label={mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              onPress={handleSubmit}
              loading={loading}
              fullWidth
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o continúa con</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogle}
              activeOpacity={0.75}
            >
              <Ionicons name="logo-google" size={20} color={colors.textPrimary} />
              <Text style={styles.googleText}>Google</Text>
            </TouchableOpacity>
          </View>

          {/* Toggle */}
          <View style={styles.toggle}>
            <Text style={styles.toggleText}>
              {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.toggleLink}>
                {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    gap: spacing.xl,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  appName: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.md,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FF444420',
    borderRadius: radius.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FF444440',
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.sm,
    flex: 1,
  },
  passwordHint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: -spacing.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  googleText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  toggleLink: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});