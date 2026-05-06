export default function StockAlert({ productos }: any) {
  if (!productos.length) return null;

  return (
    <div className="bg-red-500 text-white p-6 rounded-2xl">
      <h3 className="font-bold mb-4">Stock Crítico</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {productos.map((p: any) => (
          <div key={p.id} className="bg-white/20 p-3 rounded">
            <div className="font-bold">{p.stock_actual}</div>
            <div className="text-sm">{p.nombre}</div>
          </div>
        ))}
      </div>
    </div>
  );
}