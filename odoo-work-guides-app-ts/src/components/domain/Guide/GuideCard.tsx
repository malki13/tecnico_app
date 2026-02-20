/**
 * GuideCard Component
 * Tarjeta para mostrar información de una guía de trabajo
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../../common/Card/Card';
import { Badge, getBadgeVariantFromStatus } from '../../common/Badge/Badge';
import { COLORS, SIZES, TYPOGRAPHY } from '../../../config/theme.config';
import { formatDate } from '../../../utils/dateUtils';
import type { WorkGuide } from '../../../types/models.types';

export interface GuideCardProps {
  guide: WorkGuide;
  onPress?: (guide: WorkGuide) => void;
}

export const GuideCard: React.FC<GuideCardProps> = ({ guide, onPress }) => {
  const handlePress = () => {
    onPress?.(guide);
  };

  const statusLabels: Record<WorkGuide['state'], string> = {
    open: 'Abierta',
    closed: 'Cerrada',
    draft: 'Borrador',
    done: 'Completada',
  };

  return (
    <Card onPress={handlePress} variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {guide.name}
        </Text>
        <Badge variant={getBadgeVariantFromStatus(guide.state)} size="sm">
          {statusLabels[guide.state]}
        </Badge>
      </View>

      <View style={styles.content}>
        <InfoRow icon="📅" label="Fecha" value={formatDate(guide.date)} />
        <InfoRow icon="👥" label="Equipo" value={guide.team_id[1]} />
      </View>
    </Card>
  );
};

// Helper component for info rows
interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.icon}>{icon}</Text>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: SIZES.md,
    borderLeftWidth: SIZES.borderThick,
    borderLeftColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.md,
    gap: SIZES.sm,
  },
  title: {
    flex: 1,
    fontSize: SIZES.fontLg,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textPrimary,
  },
  content: {
    gap: SIZES.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  icon: {
    fontSize: SIZES.fontLg,
  },
  infoContent: {
    flex: 1,
    flexDirection: 'row',
    gap: SIZES.xs,
  },
  infoLabel: {
    fontSize: SIZES.fontMd,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.textSecondary,
  },
  infoValue: {
    flex: 1,
    fontSize: SIZES.fontMd,
    color: COLORS.textPrimary,
  },
});
