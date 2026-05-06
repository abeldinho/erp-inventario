import { useMovimientos } from "../hooks/useMovimientos";
import { useProductos } from "../../productos/hooks/useProductos";
import MovimientoForm from "../components/MovimientoForm";

export default function MovimientosPage() {
  const { create } = useMovimientos();
  const { productos, loading } = useProductos();

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Movimientos</h1>

      <div className="bg-white p-4 rounded-xl shadow">
        <MovimientoForm
          productos={productos}
          onSubmit={create}
        />
      </div>
    </div>
  );
}