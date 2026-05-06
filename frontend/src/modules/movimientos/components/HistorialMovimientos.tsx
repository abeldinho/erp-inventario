import type { Movimiento } from "../types/movimientos";

interface HistorialMovimientosProps {
  movimientos: Movimiento[];
  onVerDetalle?: (movimiento: Movimiento) => void;  // ✅ Nuevo prop
}

export default function HistorialMovimientos({ 
  movimientos, 
  onVerDetalle 
}: HistorialMovimientosProps) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Fecha</th>
            <th className="p-3">Tipo</th>
            <th className="p-3">Cantidad</th>
            <th className="p-3">Motivo</th>
            <th className="p-3">Usuario</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {movimientos.map((m) => (
            <tr key={m.id} className="border-t hover:bg-gray-50">
              <td className="p-3">
                {new Date(m.fecha_hora).toLocaleString()}
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    m.tipo === "entrada"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {m.tipo}
                </span>
              </td>

              <td className="p-3 font-medium">{m.cantidad}</td>
              <td className="p-3">{m.motivo}</td>
              <td className="p-3">{m.usuario}</td>
              <td className="p-3 font-semibold text-gray-900">
                {m.stock_resultante}
              </td>
              <td className="p-3">
                <button
                  onClick={() => onVerDetalle?.(m)}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors font-medium"
                  title="Ver detalle del movimiento"
                >
                  Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}