import { useState } from "react";
import { getHistorialMovimientos } from "../../../api/movimientos";
import type { Movimiento } from "../../../types/movimientos";

export function useHistorialMovimientos() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async (
    producto_id: number,
    filtros?: {
      desde?: string;
      hasta?: string;
      tipo?: "entrada" | "salida";
    }
  ) => {
    setLoading(true);

    try {
      const data = await getHistorialMovimientos(producto_id, filtros);
      setMovimientos(data.movimientos);
    } catch (error) {
      console.error("Error cargando historial", error);
    } finally {
      setLoading(false);
    }
  };
   const reset = () => {
    setMovimientos([]);
    setLoading(false);
  };

  return { movimientos, loading, load, reset };
}