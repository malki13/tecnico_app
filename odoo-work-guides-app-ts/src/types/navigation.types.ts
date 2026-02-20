/**
 * Navigation Types
 * Tipos para React Navigation
 */

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type DrawerParamList = {
  Home: undefined;
  UserInfo: undefined;
  MyWarehouse: undefined;
  WorkOrders: {
    guideId: number;
    guideName: string;
  };
  WorkOrderDetail: {
    orderId: number;
    orderName: string;
  };
};
