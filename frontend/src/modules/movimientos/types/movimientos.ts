export type TipoMovimiento = "entrada" | "salida";

export interface MovimientoPayload {
  producto_id: number;
  cantidad: number;
  motivo: string;
}

export interface MovimientoCreate extends MovimientoPayload {
  tipo: TipoMovimiento; // SOLO frontend
}

export interface Movimiento {
  id: number;
  producto_id: number;
  fecha_hora: string;
  tipo: 'entrada' | 'salida' | '';
  cantidad: number;
  motivo: string;
  usuario: string;
  stock_resultante: number;
  // ... otros campos para el detalle
}

export interface HistorialResponse {
  total: number;
  movimientos: Movimiento[];
}


