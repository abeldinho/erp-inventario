// src/types/producto.ts

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  sku: string;
  categoria_id: number;
  precio: number;
  stock_minimo: number;
  stock_actual: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductoCreate {
  "nombre": string,
  "descripcion": string,
  "sku": string,
  "categoria_id": number,
  "precio": number,
  "stock_minimo": number,
  "stock_inicial": number
}

export interface ProductoUpdate {
  "nombre"?: string,
  "descripcion"?: string,
  "categoria_id"?: number,
  "precio"?: number,
  "stock_minimo"?: number,
}

// types/movimientos.ts
export interface Movimiento {
  id: number;
  producto_nombre: string;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  fecha_hora: string;
  observaciones?: string;
  usuario?: string;
  // ... otros campos que tengas
}

export interface ProductoAlerta {
  id: number;
  nombre: string;
  sku: string;
  stock_actual: number;
  stock_minimo: number;
  categoria_id: number;
  diferencia: number;
}