/**
 * UserInfoScreen
 * Pantalla de información del usuario
 * TODO: Implementar según el diseño original
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/common';
import { COLORS, SIZES, TYPOGRAPHY } from '../../../config/theme.config';

const UserInfoScreen: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user.name || 'Usuario'}</Text>
        </View>

        {/* Info Card */}
        <Card variant="elevated" style={styles.card}>
          <InfoRow label="Email" value={user.username} />
          <Divider />
          <InfoRow label="ID de Usuario" value={user.uid.toString()} />
          <Divider />
          <InfoRow label="ID de Socio" value={user.partner_id.toString()} />
          <Divider />
          <InfoRow label="ID de Compañía" value={user.company_id.toString()} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.md,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.surface,
  },
  userName: {
    fontSize: SIZES.font2xl,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textPrimary,
  },
  card: {
    marginTop: SIZES.md,
  },
  infoRow: {
    paddingVertical: SIZES.md,
  },
  infoLabel: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
  infoValue: {
    fontSize: SIZES.fontBase,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weightMedium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});

export default UserInfoScreen;
