import {
  createMovimientoEntrada,
  createMovimientoSalida,
} from "../../../api/movimientos";
import type { MovimientoCreate } from "../../../types/movimientos";

export function useMovimientos() {
  const create = async (data: MovimientoCreate): Promise<void> => {
    const { tipo, ...payload } = data;
    if (tipo === "entrada") {
      await createMovimientoEntrada(payload);
      return;
    }

    await createMovimientoSalida(payload);
  };

  return { create };
}