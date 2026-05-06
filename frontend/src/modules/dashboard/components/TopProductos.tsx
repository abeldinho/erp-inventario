export default function TopProductos({ title, productos, getValue }: any) {
  const max = Math.max(...productos.map(getValue));

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="font-bold mb-4">{title}</h2>

      {productos.map((p: any, i: number) => {
        const val = getValue(p);
        const percent = (val / max) * 100;

        return (
          <div key={p.id} className="mb-3">
            <div className="flex justify-between text-sm">
              <span>{p.nombre}</span>
              <span>{val}</span>
            </div>

            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}