/**
 * Warehouse Service
 * Servicio para gestionar el almacén/bodega
 */

import httpClient from '../client/httpClient';
import { API_ENDPOINTS } from '../../config/api.config';
import authService from './authService';
import type {
  OdooJsonRpcRequest,
  OdooJsonRpcResponse,
  GetWarehouseParams,
  WarehouseResponse,
} from '../../types/api.types';
import type { WarehouseData, StockItem } from '../../types/models.types';

class WarehouseService {
  /**
   * Obtiene la bodega del técnico
   */
  async getWarehouse(): Promise<WarehouseResponse> {
    try {
      const userId = await authService.getCurrentUserId();

      if (!userId) {
        throw new Error('No hay sesión activa');
      }

      const requestBody: OdooJsonRpcRequest<GetWarehouseParams> = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'ek.contract.work.guide.service',
          method: 'get_detailed_store',
          args: [],
          kwargs: {},
        },
        id: userId,
      };

      const response = await httpClient.post<OdooJsonRpcResponse<WarehouseData>>(
        API_ENDPOINTS.WAREHOUSE.GET_DETAILED,
        requestBody
      );

      if (response.result) {
        return {
          success: true,
          warehouse: response.result,
        };
      }

      return {
        success: false,
        error: 'No se pudo obtener la bodega',
      };
    } catch (error: any) {
      console.error('Error obteniendo bodega:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener la bodega',
      };
    }
  }

  /**
   * Filtra productos por búsqueda
   */
  searchProducts(stocks: StockItem[], query: string): StockItem[] {
    if (!query.trim()) return stocks;

    const lowerQuery = query.toLowerCase();
    return stocks.filter((item) =>
      item.product_name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filtra productos que tienen seriales
   */
  filterWithSerials(stocks: StockItem[]): StockItem[] {
    return stocks.filter((item) => item.serials && item.serials.length > 0);
  }

  /**
   * Calcula estadísticas del warehouse
   */
  getStatistics(stocks: StockItem[]) {
    const totalProducts = stocks.length;
    const totalQuantity = stocks.reduce((sum, item) => sum + item.total_quantity, 0);
    const withSerials = stocks.filter((item) => item.serials.length > 0).length;

    return {
      totalProducts,
      totalQuantity,
      withSerials,
    };
  }

  /**
   * Ordena productos por nombre
   */
  sortByName(stocks: StockItem[], ascending: boolean = true): StockItem[] {
    return [...stocks].sort((a, b) => {
      const comparison = a.product_name.localeCompare(b.product_name);
      return ascending ? comparison : -comparison;
    });
  }

  /**
   * Ordena productos por cantidad
   */
  sortByQuantity(stocks: StockItem[], ascending: boolean = false): StockItem[] {
    return [...stocks].sort((a, b) => {
      const diff = a.total_quantity - b.total_quantity;
      return ascending ? diff : -diff;
    });
  }
}

export default new WarehouseService();
