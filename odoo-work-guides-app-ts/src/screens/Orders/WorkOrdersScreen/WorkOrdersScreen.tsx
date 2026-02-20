import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';
import { useAsync, useDebounce } from '../../../hooks';
import { ordersService } from '../../../api/services';
import { LoadingSpinner, EmptyState, SearchBar, Badge, getBadgeVariantFromStatus } from '../../../components/common';
import { COLORS, SIZES, TYPOGRAPHY, SHADOWS } from '../../../config/theme.config';
import type { WorkOrder, DrawerParamList } from '../../../types';

interface WorkOrdersScreenProps {
  navigation: DrawerNavigationProp<DrawerParamList, 'WorkOrders'>;
  route: RouteProp<DrawerParamList, 'WorkOrders'>;
}

const WorkOrdersScreen: React.FC<WorkOrdersScreenProps> = ({ navigation, route }) => {
  const { guideId, guideName } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  const {
    data: orders = [],
    isLoading,
    execute: loadOrders,
  } = useAsync(
    async () => {
      const result = await ordersService.getOrdersByGuide(guideId);
      return result.orders || [];
    },
    true
  );

  // const filteredOrders = React.useMemo(() => {
  //   if (!debouncedQuery) return orders;
  //   return ordersService.searchOrders(orders, debouncedQuery);
  // }, [orders, debouncedQuery]);
  const filteredOrders = React.useMemo(() => {
    if (!debouncedQuery) return orders ?? [];
    return ordersService.searchOrders(orders, debouncedQuery) ?? [];
  }, [orders, debouncedQuery]);


  const getStatusLabel = (state: string): string => {
    const labels: Record<string, string> = {
      progress: 'En Progreso',
      done: 'Completada',
      cancel: 'Cancelada',
    };
    return labels[state] || state;
  };

  const handleOrderPress = (order: WorkOrder) => {
    navigation.navigate('WorkOrderDetail', {
      orderId: order.id,
      orderName: order.name,
    });
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Órdenes de Trabajo</Text>
          <Text style={styles.headerSubtitle}>{guideName}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar órdenes..."
        />
      </View>

      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredOrders.length} orden{filteredOrders.length !== 1 ? 'es' : ''} encontrada{filteredOrders.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => handleOrderPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderName}>{item.name}</Text>
              <Badge variant={getBadgeVariantFromStatus(item.state)}>
                {getStatusLabel(item.state)}
              </Badge>
            </View>
            <Text style={styles.orderInfo}>Tipo: {item.type_id?.[1]}</Text>
            <Text style={styles.orderInfo} numberOfLines={2}>
              Cliente: {item.subscription_id?.[1]}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadOrders} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📋"
            title="No hay órdenes"
            message="No se encontraron órdenes para esta guía"
          />
        }
      />
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
  searchContainer: {
    padding: SIZES.md,
  },
  countContainer: {
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.sm,
  },
  countText: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  listContainer: {
    padding: SIZES.md,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    borderLeftWidth: SIZES.borderThick,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  orderName: {
    flex: 1,
    fontSize: SIZES.fontLg,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textPrimary,
    marginRight: SIZES.sm,
  },
  orderInfo: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
});

export default WorkOrdersScreen;
