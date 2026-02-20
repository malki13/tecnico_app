/**
 * LoginScreen
 * Pantalla de inicio de sesión refactorizada
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/common/Button/Button';
import { COLORS, SIZES, TYPOGRAPHY } from '../../../config/theme.config';
import { useAsync } from '../../../hooks/useAsync';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login } = useAuth();

  // Usar el hook useAsync para manejar el login
  const { execute: handleLogin, isLoading } = useAsync(
    async () => {
      // Validar campos
      if (!email.trim() || !password.trim()) {
        throw new Error('Por favor ingresa email y contraseña');
      }

      // Realizar login
      const result = await login(email, password);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al iniciar sesión');
      }
    },
    false,
    undefined,
    (error) => {
      Alert.alert('Error', error);
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="correo@ejemplo.com"
                placeholderTextColor={COLORS.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <Button
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              fullWidth
              size="lg"
            >
              Ingresar
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SIZES.xl,
  },
  header: {
    marginBottom: SIZES.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.font3xl,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.fontBase,
    color: COLORS.textSecondary,
  },
  form: {
    gap: SIZES.lg,
  },
  inputContainer: {
    gap: SIZES.sm,
  },
  label: {
    fontSize: SIZES.fontMd,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    fontSize: SIZES.fontBase,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
