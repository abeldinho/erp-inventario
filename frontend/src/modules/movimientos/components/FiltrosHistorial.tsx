import Select from "../../../shared/components/ui/Select";
import Input from "../../../shared/components/ui/Input";

export default function FiltrosHistorial({
  productos,
  filtros,
}: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-5 gap-4">

      <Select
        label="Producto"
        value={filtros.productoId}
        onChange={(e) => filtros.setProductoId(e.target.value)}
        options={productos.map((p: any) => ({
          label: p.nombre,
          value: p.id,
        }))}
      />

      <Select
        label="Tipo"
        value={filtros.tipo}
        onChange={(e) =>
          filtros.setTipo(e.target.value as "entrada" | "salida" | "")
        }
        options={[
          { label: "Todos", value: "" },
          { label: "Entrada", value: "entrada" },
          { label: "Salida", value: "salida" },
        ]}
      />

      <Input
        label="Desde"
        type="date"
        value={filtros.desde}
        onChange={(e) => filtros.setDesde(e.target.value)}
      />

      <Input
        label="Hasta"
        type="date"
        value={filtros.hasta}
        onChange={(e) => filtros.setHasta(e.target.value)}
      />

      <div className="flex items-end gap-2">
        <button
          onClick={filtros.buscar}
          disabled={!filtros.productoId}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Buscar
        </button>

        <button
          onClick={filtros.limpiar}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg w-full"
        >
          Limpiar
        </button>
      </div>

    </div>
  );
}