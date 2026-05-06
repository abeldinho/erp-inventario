// components/AlertasTable.tsx
import AlertaBadge from "./AlertaBadge";

export default function AlertasTable({
  alertas,
  getColor,
  calcularPorcentaje,
}: any) {
  return (
    <table className="w-full bg-white rounded-xl shadow">
      <thead>
        <tr className="bg-gray-100">
          <th>Producto</th>
          <th>Stock</th>
          <th>Mín</th>
          <th>%</th>
        </tr>
      </thead>

      <tbody>
        {alertas.map((a: any) => {
          const color = getColor(a);
          const porcentaje = calcularPorcentaje(a);

          return (
            <tr key={a.id}>
              <td>{a.nombre}</td>
              <td>{a.stock_actual}</td>
              <td>{a.stock_minimo}</td>
              <td>
                <AlertaBadge
                  color={color}
                  porcentaje={porcentaje}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}