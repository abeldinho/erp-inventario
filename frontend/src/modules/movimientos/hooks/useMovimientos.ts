import {
  createMovimientoEntrada,
  createMovimientoSalida,
} from "../../../api/movimientos";
import type { MovimientoCreate } from "../../../types/movimientos";

export function useMovimientos() {
  const create = async (data: MovimientoCreate) => {
    const { tipo, ...payload } = data;
    if (tipo === "entrada") {
      return await createMovimientoEntrada(payload);
    }

    return await createMovimientoSalida(payload);
  };

  return { create };
}