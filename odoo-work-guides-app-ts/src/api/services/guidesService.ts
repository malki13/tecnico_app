/**
 * Guides Service
 * Servicio para gestionar guías de trabajo
 */

import httpClient from '../client/httpClient';
import { API_ENDPOINTS } from '../../config/api.config';
import authService from './authService';
import type {
  OdooJsonRpcRequest,
  OdooJsonRpcResponse,
  GetAllGuidesParams,
  GuidesResponse,
} from '../../types/api.types';
import type { WorkGuide } from '../../types/models.types';

class GuidesService {
  /**
   * Obtiene todas las guías de trabajo
   */
  async getAllGuides(): Promise<GuidesResponse> {
    try {
      const userId = await authService.getCurrentUserId();

      if (!userId) {
        throw new Error('No hay sesión activa');
      }

      const requestBody: OdooJsonRpcRequest<GetAllGuidesParams> = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'ek.contract.work.guide.service',
          method: 'get_all_guides',
          args: [],
          kwargs: {},
        },
        id: userId,
      };

      const response = await httpClient.post<OdooJsonRpcResponse<WorkGuide[]>>(
        API_ENDPOINTS.GUIDES.GET_ALL,
        requestBody
      );

      if (response.result) {
        return {
          success: true,
          guides: response.result,
        };
      }

      return {
        success: false,
        error: 'No se pudieron obtener las guías',
      };
    } catch (error: any) {
      console.error('Error obteniendo guías:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener las guías',
      };
    }
  }

  /**
   * Filtra guías por fecha
   */
  filterByDate(guides: WorkGuide[], targetDate: Date): WorkGuide[] {
    return guides.filter((guide) => {
      const guideDate = new Date(guide.date);
      return (
        guideDate.getDate() === targetDate.getDate() &&
        guideDate.getMonth() === targetDate.getMonth() &&
        guideDate.getFullYear() === targetDate.getFullYear()
      );
    });
  }

  /**
   * Filtra guías por estado
   */
  filterByState(guides: WorkGuide[], state: WorkGuide['state']): WorkGuide[] {
    return guides.filter((guide) => guide.state === state);
  }

  /**
   * Busca guías por texto
   */
  searchGuides(guides: WorkGuide[], searchQuery: string): WorkGuide[] {
    if (!searchQuery.trim()) return guides;

    const query = searchQuery.toLowerCase();
    // return guides.filter(
    //   (guide) =>
    //     guide.name.toLowerCase().includes(query) ||
    //     guide.team_id[1].toLowerCase().includes(query)
    // );
    return guides.filter(
      (guide) =>
        guide.name?.toLowerCase().includes(query) ||
        guide.team_id?.[1]?.toLowerCase().includes(query)
    );
  }

  /**
   * Ordena guías por fecha (más reciente primero)
   */
  sortByDate(guides: WorkGuide[], ascending: boolean = false): WorkGuide[] {
    return [...guides].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Obtiene estadísticas de las guías
   */
  getStatistics(guides: WorkGuide[]) {
    const total = guides.length;
    const byState = guides.reduce((acc, guide) => {
      acc[guide.state] = (acc[guide.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      open: byState.open || 0,
      closed: byState.closed || 0,
      draft: byState.draft || 0,
      done: byState.done || 0,
    };
  }
}

export default new GuidesService();
