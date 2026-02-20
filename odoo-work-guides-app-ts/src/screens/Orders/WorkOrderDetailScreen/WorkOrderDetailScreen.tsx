import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';
import { useAsync } from '../../../hooks';
import { ordersService } from '../../../api/services';
import { LoadingSpinner, Button } from '../../../components/common';
import { formatDate } from '../../../utils/dateUtils';
import { COLORS, SIZES, TYPOGRAPHY, SHADOWS } from '../../../config/theme.config';
import type { WorkOrderDetail, DrawerParamList } from '../../../types';

interface WorkOrderDetailScreenProps {
  navigation: DrawerNavigationProp<DrawerParamList, 'WorkOrderDetail'>;
  route: RouteProp<DrawerParamList, 'WorkOrderDetail'>;
}

const WorkOrderDetailScreen: React.FC<WorkOrderDetailScreenProps> = ({ navigation, route }) => {
  const { orderId, orderName } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<WorkOrderDetail | null>(null);

  const { data: order, isLoading, execute: loadOrder } = useAsync(
    async () => {
      const result = await ordersService.getOrderDetail(orderId);
      if (result.success && result.order) {
        setEditedOrder(result.order);
        return result.order;
      }
      throw new Error(result.error || 'No se pudo cargar la orden');
    },
    true
  );

  const handleSave = async () => {
    if (!editedOrder) return;

    Alert.alert(
      'Confirmar',
      '¿Desea guardar los cambios realizados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar',
          onPress: async () => {
            const result = await ordersService.updateOrder(orderId, editedOrder);
            if (result.success) {
              Alert.alert('Éxito', 'Orden actualizada correctamente');
              setIsEditing(false);
              loadOrder();
            } else {
              Alert.alert('Error', result.error || 'No se pudo actualizar la orden');
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setEditedOrder(order);
    setIsEditing(false);
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderRow = (label: string, value: any, editable = false, field?: string) => {
    const displayValue = value === false || value === null || value === undefined ? 'N/A' : String(value);
    
    return (
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}:</Text>
        {isEditing && editable && editedOrder && field ? (
          <TextInput
            style={styles.infoInput}
            value={displayValue}
            onChangeText={(text) => setEditedOrder({ ...editedOrder, [field]: text })}
          />
        ) : (
          <Text style={styles.infoValue}>{displayValue}</Text>
        )}
      </View>
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!order || !editedOrder) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No se pudo cargar la orden</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Detalle de Orden</Text>
          <Text style={styles.headerSubtitle}>{orderName}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {renderSection('Información General', (
          <>
            {renderRow('Origen', order.origin)}
            {renderRow('Nombre', order.name)}
            {renderRow('Fecha', formatDate(order.date))}
            {renderRow('Técnico', order.technical)}
            {renderRow('Plan', order.plan)}
            {renderRow('Estado', order.state)}
            {renderRow('Código', order.code)}
          </>
        ))}

        {renderSection('Cliente', (
          <>
            {renderRow('Nombre', order.partner.name)}
            {renderRow('Cédula', order.partner.cedula)}
            {renderRow('Teléfono', order.partner.telefono)}
            {renderRow('Celular', order.partner.celular)}
          </>
        ))}

        {renderSection('Configuración', (
          <>
            {renderRow('Usuario Contrato', order.contract_user, true, 'contract_user')}
            {renderRow('Password Contrato', order.contract_passwd, true, 'contract_passwd')}
            {renderRow('Usuario WiFi', order.wifi_user, true, 'wifi_user')}
            {renderRow('Password WiFi', order.wifi_passwd, true, 'wifi_passwd')}
            {renderRow('MAC Contrato', order.contract_mac, true, 'contract_mac')}
            {renderRow('Serie ONT', order.serie_ont, true, 'serie_ont')}
            {renderRow('IPv6', order.is_ipv6 ? 'Sí' : 'No')}
          </>
        ))}

        {renderSection('Notas', (
          <View>
            {isEditing ? (
              <TextInput
                style={styles.notesInput}
                value={editedOrder.note || ''}
                onChangeText={(text) => setEditedOrder({ ...editedOrder, note: text })}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            ) : (
              <Text style={styles.notesText}>{order.note || 'Sin notas'}</Text>
            )}
          </View>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.actionButtonsContainer}>
        {!isEditing ? (
          <Button onPress={() => setIsEditing(true)} fullWidth>
            Editar
          </Button>
        ) : (
          <View style={styles.editButtonsRow}>
            <Button variant="ghost" onPress={handleCancel} style={{ flex: 1 }}>
              Cancelar
            </Button>
            <Button variant="primary" onPress={handleSave} style={{ flex: 1 }}>
              Guardar
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SIZES.sm,
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.textPrimary,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginTop: SIZES.sm,
    marginHorizontal: SIZES.md,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    ...SHADOWS.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.md,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: SIZES.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: SIZES.fontMd,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: SIZES.fontMd,
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  infoInput: {
    fontSize: SIZES.fontMd,
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
  },
  notesText: {
    fontSize: SIZES.fontMd,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  notesInput: {
    fontSize: SIZES.fontMd,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radiusSm,
    padding: SIZES.md,
    minHeight: 120,
  },
  bottomSpacer: {
    height: 100,
  },
  actionButtonsContainer: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SIZES.md,
  },
  editButtonsRow: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  errorText: {
    fontSize: SIZES.fontBase,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SIZES.xl,
  },
});

export default WorkOrderDetailScreen;
