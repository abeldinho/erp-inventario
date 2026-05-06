import { useState } from "react";

export function useHistorialFiltros(load: any, reset: any) {
  const [productoId, setProductoId] = useState("");
  const [tipo, setTipo] = useState<"entrada" | "salida" | "">("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const buscar = () => {
    if (!productoId) return;

    if (desde && hasta && new Date(desde) > new Date(hasta)) {
      alert("La fecha 'Hasta' no puede ser anterior a 'Desde'");
      return;
    }

    load(Number(productoId), {
      desde: desde ? `${desde}T00:00:00` : undefined,
      hasta: hasta ? `${hasta}T23:59:59` : undefined,
      tipo: tipo || undefined,
    });
  };

  const limpiar = () => {
    setProductoId("");
    setTipo("");
    setDesde("");
    setHasta("");
    reset();
  };

  return {
    productoId,
    tipo,
    desde,
    hasta,
    setProductoId,
    setTipo,
    setDesde,
    setHasta,
    buscar,
    limpiar,
  };
}