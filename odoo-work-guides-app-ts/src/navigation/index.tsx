/**
 * Navigation
 * Configuración principal de navegación
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common';

// Screens
import { LoginScreen } from '../screens/Auth/LoginScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import UserInfoScreen from '../screens/Profile/UserInfoScreen';
import MyWarehouseScreen from '../screens/Warehouse/MyWarehouseScreen';
import WorkOrdersScreen from '../screens/Orders/WorkOrdersScreen';
import WorkOrderDetailScreen from '../screens/Orders/WorkOrderDetailScreen';

// Components
import CustomDrawerContent from '../components/layout/CustomDrawerContent';

// Types
import type { RootStackParamList, DrawerParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />
      <Drawer.Screen
        name="UserInfo"
        component={UserInfoScreen}
        options={{ title: 'Información del usuario' }}
      />
      <Drawer.Screen
        name="MyWarehouse"
        component={MyWarehouseScreen}
        options={{ title: 'Mi Bodega' }}
      />
      <Drawer.Screen
        name="WorkOrders"
        component={WorkOrdersScreen}
        options={{ 
          title: 'Órdenes de Trabajo',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="WorkOrderDetail"
        component={WorkOrderDetailScreen}
        options={{ 
          title: 'Detalle de Orden',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer.Navigator>
  );
};

const Navigation: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={DrawerNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
