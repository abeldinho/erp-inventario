import type { Movimiento } from "../types/movimientos";

export default function MovimientoDetalleModal({
  movimiento,
  onClose,
  getNombreProducto,
}: {
  movimiento: Movimiento;
  onClose: () => void;
  getNombreProducto: (id: number) => string;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl w-full max-w-xl">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Detalle</h2>
          <button onClick={onClose}>×</button>
        </div>

        <p><b>Producto:</b> {getNombreProducto(movimiento.producto_id)}</p>
        <p><b>Tipo:</b> {movimiento.tipo}</p>
        <p><b>Cantidad:</b> {movimiento.cantidad}</p>
        <p><b>Stock:</b> {movimiento.stock_resultante}</p>
        <p><b>Motivo:</b> {movimiento.motivo}</p>

      </div>
    </div>
  );
}