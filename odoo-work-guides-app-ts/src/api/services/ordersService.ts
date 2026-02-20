/**
 * Orders Service
 * Servicio para gestionar órdenes de trabajo
 */

import httpClient from '../client/httpClient';
import { API_ENDPOINTS } from '../../config/api.config';
import authService from './authService';
import type {
  OdooJsonRpcRequest,
  OdooJsonRpcResponse,
  GetOrdersByGuideParams,
  GetOrderParams,
  UpdateOrderParams,
  OrdersResponse,
  OrderDetailResponse,
  UpdateOrderResponse,
} from '../../types/api.types';
import type { WorkOrder, WorkOrderDetail } from '../../types/models.types';

class OrdersService {
  /**
   * Obtiene las órdenes por guía
   */
  async getOrdersByGuide(guideId: number): Promise<OrdersResponse> {
    try {
      const userId = await authService.getCurrentUserId();

      if (!userId) {
        throw new Error('No hay sesión activa');
      }

      const requestBody: OdooJsonRpcRequest<GetOrdersByGuideParams> = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'ek.contract.work.guide.service',
          method: 'get_orders_by_guide',
          args: [guideId],
          kwargs: {},
        },
        id: userId,
      };

      const response = await httpClient.post<OdooJsonRpcResponse<WorkOrder[]>>(
        API_ENDPOINTS.ORDERS.GET_BY_GUIDE,
        requestBody
      );

      if (response.result) {
        return {
          success: true,
          orders: response.result,
        };
      }

      return {
        success: false,
        error: 'No se pudieron obtener las órdenes',
      };
    } catch (error: any) {
      console.error('Error obteniendo órdenes:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener las órdenes',
      };
    }
  }

  /**
   * Obtiene el detalle de una orden
   */
  async getOrderDetail(orderId: number): Promise<OrderDetailResponse> {
    try {
      const userId = await authService.getCurrentUserId();

      if (!userId) {
        throw new Error('No hay sesión activa');
      }

      const requestBody: OdooJsonRpcRequest<GetOrderParams> = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'ek.contract.work.guide.service',
          method: 'get_order',
          args: [orderId],
          kwargs: {},
        },
        id: userId,
      };

      const response = await httpClient.post<OdooJsonRpcResponse<WorkOrderDetail>>(
        API_ENDPOINTS.ORDERS.GET_DETAIL,
        requestBody
      );

      if (response.result) {
        return {
          success: true,
          order: response.result,
        };
      }

      return {
        success: false,
        error: 'No se pudo obtener el detalle de la orden',
      };
    } catch (error: any) {
      console.error('Error obteniendo detalle de orden:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener el detalle de la orden',
      };
    }
  }

  /**
   * Actualiza una orden
   */
  async updateOrder(
    orderId: number,
    updateData: Partial<WorkOrderDetail>
  ): Promise<UpdateOrderResponse> {
    try {
      const userId = await authService.getCurrentUserId();

      if (!userId) {
        throw new Error('No hay sesión activa');
      }

      const requestBody: OdooJsonRpcRequest<UpdateOrderParams> = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'ek.contract.work.guide.service',
          method: 'update_order',
          args: [orderId, updateData],
          kwargs: {},
        },
        id: userId,
      };

      const response = await httpClient.post<OdooJsonRpcResponse<boolean>>(
        API_ENDPOINTS.ORDERS.UPDATE,
        requestBody
      );

      if (response.result) {
        return {
          success: true,
        };
      }

      return {
        success: false,
        error: 'No se pudo actualizar la orden',
      };
    } catch (error: any) {
      console.error('Error actualizando orden:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar la orden',
      };
    }
  }

  /**
   * Filtra órdenes por estado
   */
  filterByState(orders: WorkOrder[], state: WorkOrder['state']): WorkOrder[] {
    return orders.filter((order) => order.state === state);
  }

  /**
   * Busca órdenes por texto
   */
  searchOrders(orders: WorkOrder[], searchQuery: string): WorkOrder[] {
    if (!searchQuery.trim()) return orders;

    const query = searchQuery.toLowerCase();
    return orders.filter(
      (order) =>
        order.name.toLowerCase().includes(query) ||
        order.subscription_id[1].toLowerCase().includes(query) ||
        order.type_id[1].toLowerCase().includes(query)
    );
  }

  /**
   * Obtiene estadísticas de las órdenes
   */
  getStatistics(orders: WorkOrder[]) {
    const total = orders.length;
    const byState = orders.reduce((acc, order) => {
      acc[order.state] = (acc[order.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      progress: byState.progress || 0,
      done: byState.done || 0,
      cancel: byState.cancel || 0,
    };
  }
}

export default new OrdersService();
