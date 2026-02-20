/**
 * MyWarehouseScreen
 * Pantalla de bodega del técnico - Refactorizada
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  ListRenderItem,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAsync, useDebounce } from '../../../hooks';
import { warehouseService } from '../../../api/services';
import { LoadingSpinner, EmptyState } from '../../../components/common';
import { COLORS, SIZES, TYPOGRAPHY, SHADOWS } from '../../../config/theme.config';
import type { StockItem } from '../../../types';

const MyWarehouseScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<StockItem | null>(null);
  const [showSerials, setShowSerials] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const {
    data: warehouse,
    isLoading,
    execute: loadWarehouse,
  } = useAsync(
    async () => {
      const result = await warehouseService.getWarehouse();
      if (result.success && result.warehouse) {
        return result.warehouse;
      }
      throw new Error(result.error || 'No se pudo cargar la bodega');
    },
    true
  );

  const filteredStocks = React.useMemo(() => {
    if (!warehouse?.stocks) return [];
    if (!debouncedQuery) return warehouse.stocks;
    return warehouseService.searchProducts(warehouse.stocks, debouncedQuery);
  }, [warehouse, debouncedQuery]);

  const stats = React.useMemo(() => {
    if (!filteredStocks.length) return { totalProducts: 0, totalQuantity: 0, withSerials: 0 };
    return warehouseService.getStatistics(filteredStocks);
  }, [filteredStocks]);

  const handleProductPress = (item: StockItem): void => {
    if (item.serials && item.serials.length > 0) {
      setSelectedProduct(item);
      setShowSerials(true);
    }
  };

  const renderStockItem: ListRenderItem<StockItem> = ({ item }) => {
    const hasSerials = item.serials && item.serials.length > 0;

    return (
      <TouchableOpacity
        style={styles.stockCard}
        onPress={() => handleProductPress(item)}
        disabled={!hasSerials}
        activeOpacity={hasSerials ? 0.7 : 1}
      >
        <View style={styles.stockHeader}>
          <View style={styles.productNameContainer}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.product_name}
            </Text>
            {hasSerials && (
              <View style={styles.serialBadge}>
                <Text style={styles.serialBadgeText}>
                  📋 {item.serials.length} seriales
                </Text>
              </View>
            )}
          </View>
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityText}>{item.total_quantity}</Text>
          </View>
        </View>
        <Text style={styles.productId}>ID: {item.product_id}</Text>
        {hasSerials && (
          <Text style={styles.tapToView}>👆 Toca para ver números de serie</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando bodega..." />;
  }

  if (!warehouse) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="⚠️"
          title="Error"
          message="No se pudo cargar la bodega"
          actionLabel="Reintentar"
          onAction={loadWarehouse}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Bodega</Text>
        <Text style={styles.headerSubtitle}>{warehouse.location_name}</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          placeholderTextColor={COLORS.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalProducts}</Text>
          <Text style={styles.statLabel}>Productos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalQuantity.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.withSerials}</Text>
          <Text style={styles.statLabel}>Con Serie</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredStocks}
        renderItem={renderStockItem}
        keyExtractor={(item) => item.product_id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadWarehouse} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📦"
            title={searchQuery ? 'No se encontraron productos' : 'No hay productos'}
            message={searchQuery ? 'Intenta con otro término de búsqueda' : 'La bodega está vacía'}
          />
        }
      />

      {/* Modal de seriales */}
      <Modal
        visible={showSerials}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSerials(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={2}>
                {selectedProduct?.product_name}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSerials(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalStats}>
              <Text style={styles.modalStatsText}>
                Total: {selectedProduct?.total_quantity} unidades
              </Text>
              <Text style={styles.modalStatsText}>
                {selectedProduct?.serials.length} números de serie
              </Text>
            </View>

            <ScrollView
              style={styles.serialsList}
              contentContainerStyle={styles.serialsListContent}
            >
              {selectedProduct?.serials.map((serial, index) => (
                <View key={serial.lot_id} style={styles.serialItem}>
                  <View style={styles.serialHeader}>
                    <Text style={styles.serialNumber}>#{index + 1}</Text>
                    <Text style={styles.serialQuantity}>Qty: {serial.quantity}</Text>
                  </View>
                  <Text style={styles.serialCode}>{serial.serial_number.trim()}</Text>
                  <Text style={styles.serialLotId}>Lot ID: {serial.lot_id}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: SIZES.font2xl,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  searchContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInput: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    fontSize: SIZES.fontBase,
    color: COLORS.textPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    marginTop: SIZES.sm,
    marginHorizontal: SIZES.md,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.font2xl,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  listContainer: {
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.md,
    paddingBottom: SIZES.md,
  },
  stockCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    borderLeftWidth: SIZES.borderThick,
    borderLeftColor: COLORS.secondary,
    ...SHADOWS.md,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.sm,
  },
  productNameContainer: {
    flex: 1,
    marginRight: SIZES.md,
  },
  productName: {
    fontSize: SIZES.fontBase,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.xs,
  },
  serialBadge: {
    backgroundColor: COLORS.info + '20',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
    alignSelf: 'flex-start',
    marginTop: SIZES.xs,
  },
  serialBadgeText: {
    fontSize: SIZES.fontSm,
    color: COLORS.info,
    fontWeight: TYPOGRAPHY.weightSemibold,
  },
  quantityBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusMd,
    minWidth: 50,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: SIZES.fontBase,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.surface,
  },
  productId: {
    fontSize: SIZES.fontSm,
    color: COLORS.textTertiary,
  },
  tapToView: {
    fontSize: SIZES.fontXs,
    color: COLORS.primary,
    marginTop: SIZES.sm,
    fontStyle: 'italic',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SIZES.radiusLg,
    borderTopRightRadius: SIZES.radiusLg,
    maxHeight: '80%',
    paddingBottom: SIZES.lg,
    flex: 1, 
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    flex: 1,
    fontSize: SIZES.fontLg,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textPrimary,
    marginRight: SIZES.md,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: SIZES.fontXl,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    backgroundColor: COLORS.background,
  },
  modalStatsText: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weightSemibold,
  },
  serialsList: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
  },
  serialsListContent: {
    paddingBottom: SIZES.lg,
  },
  serialItem: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusSm,
    padding: SIZES.md,
    marginTop: SIZES.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  serialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  serialNumber: {
    fontSize: SIZES.fontMd,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.primary,
  },
  serialQuantity: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radiusXs,
  },
  serialCode: {
    fontSize: SIZES.fontBase,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.textPrimary,
    fontFamily: 'monospace',
    marginBottom: SIZES.xs,
  },
  serialLotId: {
    fontSize: SIZES.fontSm,
    color: COLORS.textTertiary,
  },
});

export default MyWarehouseScreen;
