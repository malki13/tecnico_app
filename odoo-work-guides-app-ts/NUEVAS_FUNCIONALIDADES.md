# Guías de Trabajo - Funcionalidad de Órdenes de Trabajo

## Nuevas Funcionalidades Implementadas

Se han agregado las siguientes funcionalidades al proyecto:

### 1. Navegación a Órdenes de Trabajo
- Al hacer clic en una guía de trabajo en la pantalla de inicio, ahora se abre la lista de órdenes asociadas a esa guía
- Se utiliza el endpoint: `http://localhost:8079/web/dataset/call_kw/ek.contract.work.guide.service/get_orders_by_guide`

### 2. Pantalla de Órdenes de Trabajo (WorkOrdersScreen)
**Características:**
- Muestra la lista de órdenes de trabajo asociadas a una guía específica
- Filtro por fecha (similar a la funcionalidad de guías)
- Pull-to-refresh para actualizar la lista
- Navegación hacia atrás a la pantalla de guías
- Al hacer clic en una orden, navega al detalle de la orden

**Datos mostrados:**
- Nombre de la orden (ej: OT-005539)
- Estado (En Progreso, Completada, Cancelada)
- Tipo de orden (ej: ORDEN DE INSTALACION)
- Cliente/Suscripción

### 3. Pantalla de Detalle de Orden (WorkOrderDetailScreen)
**Características:**
- Muestra toda la información detallada de una orden de trabajo
- Modo de vista y modo de edición
- Actualización de información ISP y otros campos editables
- Confirmación antes de guardar cambios

**Secciones de información:**

#### a) Información General
- Origen
- Nombre
- Fecha
- Técnico
- Plan
- Estado
- Código

#### b) Información del Cliente
- Nombre
- Cédula
- Teléfono
- Celular

#### c) Información ISP (Editable)
- Core
- OLT
- Tarjeta
- Puerto
- NAP
- Puerto NAP
- IP
- Tipo ONU
- Estado Actual
- Horas Totales
- Fecha Fin Técnico

#### d) Configuración (Editable)
- Usuario Contrato
- Password Contrato
- Usuario WiFi
- Password WiFi
- MAC Contrato
- Serie ONT
- IPv6

#### e) Ubicación
- Latitud
- Longitud

#### f) Notas (Editable)
- Campo de texto multilínea para notas

## Archivos Modificados y Nuevos

### Archivos Nuevos:
1. `/src/screens/WorkOrdersScreen.tsx` - Pantalla de lista de órdenes
2. `/src/screens/WorkOrderDetailScreen.tsx` - Pantalla de detalle de orden
3. `/NUEVAS_FUNCIONALIDADES.md` - Este archivo

### Archivos Modificados:
1. `/src/types/index.ts` - Se agregaron tipos para órdenes de trabajo
2. `/src/services/odooService.ts` - Se agregaron métodos para trabajar con órdenes
3. `/src/screens/HomeScreen.tsx` - Se agregó navegación a WorkOrdersScreen
4. `/src/navigation/index.tsx` - Se registraron las nuevas pantallas

## Tipos Agregados

```typescript
// Tipos principales
export interface WorkOrder {
  id: number;
  name: string;
  state: string;
  type_id: [number, string];
  subscription_id: [number, string];
}

export interface WorkOrderDetail {
  id: number;
  origin: string;
  name: string;
  date: string;
  technical: string;
  partner: Partner;
  plan: string;
  state: string;
  isp: IspInfo;
  ubicacion: Ubicacion;
  equipos: any[];
  materiales: any[];
  note: string;
  // ... más campos
}

// Interfaces de soporte para información ISP
export interface IspInfo {
  core: IspCore;
  olt: IspOlt;
  tarjeta: IspTarjeta;
  puerto: IspPuerto;
  nap: IspNap;
  nap_port: IspNapPort;
  ip: IspIp;
  current_status: IspCurrentStatus;
  total_hours_spent: IspTotalHours;
  technical_end_date: IspTechnicalEndDate;
  onu_type_id: IspOnuType;
}
```

## Métodos del Servicio Agregados

### getOrdersByGuide(guideId: number)
Obtiene la lista de órdenes asociadas a una guía de trabajo.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "model": "ek.contract.work.guide.service",
    "method": "get_orders_by_guide",
    "args": [919],
    "kwargs": {}
  },
  "id": 1
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "id": 42578,
      "name": "OT-005539",
      "state": "progress",
      "type_id": [30, "ORDEN DE INSTALACION"],
      "subscription_id": [288259, "600333 - CENTRO..."]
    }
  ]
}
```

### getOrderDetail(orderId: number)
Obtiene el detalle completo de una orden de trabajo.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "model": "ek.contract.work.guide.service",
    "method": "get_order",
    "args": [42578],
    "kwargs": {}
  },
  "id": 1
}
```

**Response:** Ver ejemplo en la documentación original

### updateOrder(orderId: number, updateData: Partial<WorkOrderDetail>)
Actualiza la información de una orden de trabajo.

**Parámetros:**
- `orderId`: ID de la orden a actualizar
- `updateData`: Objeto con los campos a actualizar

## Flujo de Navegación

```
HomeScreen (Guías)
    ↓ [Click en guía]
WorkOrdersScreen (Órdenes de la guía)
    ↓ [Click en orden]
WorkOrderDetailScreen (Detalle de orden)
    ↓ [Botón Editar]
WorkOrderDetailScreen (Modo edición)
    ↓ [Botón Guardar]
[Confirmación y actualización]
```

## Notas de Implementación

1. **Campos editables en información ISP:**
   - La información ISP se puede editar en cascada
   - Los campos se actualizan directamente en el objeto `isp` del detalle de orden
   - Valores `false` se muestran como "N/A"

2. **Validaciones:**
   - Se solicita confirmación antes de guardar cambios
   - Se muestra un indicador de carga mientras se guarda
   - Se muestran alertas de éxito o error después de intentar guardar

3. **Filtrado por fecha:**
   - Actualmente el filtro por fecha en WorkOrdersScreen está preparado pero no implementado completamente
   - Las órdenes no tienen campo de fecha en la respuesta de `get_orders_by_guide`
   - Se puede implementar si el backend proporciona este campo

4. **Estilos:**
   - Se mantiene el mismo diseño visual que las pantallas de guías
   - Estados de órdenes con colores distintivos:
     - `progress`: Amarillo (en progreso)
     - `done`: Azul claro (completada)
     - `cancel`: Rojo claro (cancelada)

## Próximos Pasos Sugeridos

1. Implementar validaciones de campos antes de guardar
2. Agregar selección de valores desde catálogos para campos ISP (OLT, NAP, etc.)
3. Implementar visualización de equipos y materiales
4. Agregar mapa para mostrar/editar la ubicación
5. Implementar carga de imágenes para evidencias
6. Agregar timeline de actividades de la orden

## Instalación y Prueba

1. Asegúrate de tener todas las dependencias instaladas:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm start
```

3. Prueba el flujo completo:
   - Inicia sesión
   - Selecciona una guía de trabajo
   - Visualiza las órdenes asociadas
   - Abre el detalle de una orden
   - Edita campos y guarda cambios
