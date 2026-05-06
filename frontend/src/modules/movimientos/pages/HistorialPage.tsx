import { useState } from "react";
import { useProductos } from "../../productos/hooks/useProductos";
import { useHistorialMovimientos } from "../hooks/useHistorialMovimientos";
import { useHistorialFiltros } from "../hooks/useHistorialFiltros";

import FiltrosHistorial from "../components/FiltrosHistorial";
import HistorialMovimientos from "../components/HistorialMovimientos";
import MovimientoDetalleModal from "../components/MovimientoDetalleModal";

import type { Movimiento } from "../types/movimientos";

export default function HistorialPage() {
  const { productos } = useProductos();
  const { movimientos, load, loading, reset } = useHistorialMovimientos();

  const filtros = useHistorialFiltros(load, reset);

  const [selected, setSelected] = useState<Movimiento | null>(null);

  const getNombreProducto = (id: number) =>
    productos.find(p => p.id === id)?.nombre || "N/A";

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Historial de Movimientos
      </h1>

      <FiltrosHistorial productos={productos} filtros={filtros} />

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <HistorialMovimientos
          movimientos={movimientos}
          onVerDetalle={setSelected}
        />
      )}

      {selected && (
        <MovimientoDetalleModal
          movimiento={selected}
          onClose={() => setSelected(null)}
          getNombreProducto={getNombreProducto}
        />
      )}
    </div>
  );
}