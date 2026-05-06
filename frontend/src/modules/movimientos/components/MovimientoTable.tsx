// MovimientoTable.tsx
export default function MovimientoTable({ movimientos}: any) {
  return (
    <table className="w-full text-sm">
  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
    <tr>
      <th className="p-4 text-left">Movimiento</th>
      <th className="p-4 text-left">Stock</th>
      <th className="p-4 text-right">Acciones</th>
    </tr>
  </thead>

  <tbody>
    {movimientos.map((p: any) => (
      <tr key={p.id} className="border-t hover:bg-gray-50 transition">
        
        <td className="p-4 font-medium text-gray-800">
          {p.producto_nombre}
        </td>

        <td className="p-4 font-medium text-gray-800">
            {p.tipo}
        </td>
        <td className="p-4 font-medium text-gray-800">
          {p.motivo}
        </td>

        <td className="p-4">
          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
            {p.cantidad}
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>
  );
}