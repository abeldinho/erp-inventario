import { api } from "./client";
import type { MovimientoPayload } from "../types/movimientos";

// 🔥 OJO con las rutas (sin plural extra)
export const createMovimientoEntrada = async (
  data: MovimientoPayload
) => {
  return api.post("/movimientos/entradas", data);
};

export const createMovimientoSalida = async (
  data: MovimientoPayload
) => {
  return api.post("/movimientos/salidas", data);
};

export const getHistorialMovimientos = async (
  producto_id: number,
  params?: {
    desde?: string;
    hasta?: string;
    tipo?: "entrada" | "salida";
  }
) => {
  const response = await api.get(
    `/movimientos/historial/${producto_id}`,
    { params }
  );

  return response.data;
};