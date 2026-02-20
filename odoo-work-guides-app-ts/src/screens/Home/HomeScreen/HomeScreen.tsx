/**
 * HomeScreen
 * Pantalla principal con lista de guías
 */

import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useAsync, useDebounce, useRefresh } from '../../../hooks';
import { guidesService } from '../../../api/services';
import { GuideCard } from '../../../components/domain/Guide';
import { SearchBar, LoadingSpinner, EmptyState } from '../../../components/common';
import { COLORS, SIZES } from '../../../config/theme.config';
import type { WorkGuide, DrawerParamList } from '../../../types';

interface HomeScreenProps {
  navigation: DrawerNavigationProp<DrawerParamList, 'Home'>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { refreshing, onRefresh } = useRefresh();

  const {
    data: guides = [],
    isLoading,
    execute: loadGuides,
  } = useAsync(
    async () => {
      const result = await guidesService.getAllGuides();
      return result.guides || [];
    },
    true
  );

  // const filteredGuides = React.useMemo(() => {
  //   if (!debouncedQuery) return guides;
  //   return guidesService.searchGuides(guides, debouncedQuery);
  // }, [guides, debouncedQuery]);

  const filteredGuides = React.useMemo(() => {
  if (!debouncedQuery) return guides ?? [];
  return guidesService.searchGuides(guides, debouncedQuery) ?? [];
}, [guides, debouncedQuery]);


  const handleGuidePress = (guide: WorkGuide) => {
    navigation.navigate('WorkOrders', {
      guideId: guide.id,
      guideName: guide.name,
    });
  };

  if (isLoading && !refreshing) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guías de Trabajo</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar guías..."
        />
      </View>

      {/* Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredGuides.length} guía{filteredGuides.length !== 1 ? 's' : ''} encontrada{filteredGuides.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={filteredGuides}
        renderItem={({ item }) => (
          <GuideCard guide={item} onPress={handleGuidePress} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh(loadGuides)}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📋"
            title="No hay guías"
            message="No se encontraron guías para mostrar"
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
  menuButton: {
    padding: SIZES.sm,
  },
  menuIcon: {
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: SIZES.fontXl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
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
  list: {
    padding: SIZES.md,
  },
});

export default HomeScreen;
