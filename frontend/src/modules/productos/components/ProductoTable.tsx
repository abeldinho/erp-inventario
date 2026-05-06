import { useState } from "react";
import ConfirmModal from "../../../shared/components/ui/ConfirmModal";
import Badge from "../../../shared/components/ui/Badge";
import Button from "../../../shared/components/ui/Button";
import { useToast } from "../../../shared/hooks/useToast";
import { Pencil, Trash2, Package } from "lucide-react";
import EmptyState from "../../../shared/components/ui/EmptyState";

type Producto = {
  id: number;
  nombre: string;
  descripcion?: string;
  sku: string;
  precio: number;
  stock_minimo: number;
  stock_actual: number;
  categoria_id: number;
};

type Categoria = {
  id: number;
  nombre: string;
};

type Props = {
  productos: Producto[];
  categorias?: Categoria[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function ProductoTable({
  productos,
  categorias = [],
  onEdit,
  onDelete,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productoId, setProductoId] = useState<number | null>(null);
  const { showSuccess, showError } = useToast();

  const openConfirm = (id: number) => {
    setProductoId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productoId) return;
    try {
      await onDelete(productoId);
      showSuccess("Producto eliminado correctamente");
    } catch (e: any) {
      showError(e?.response?.data?.detail || "Error al eliminar producto");
    } finally {
      setConfirmOpen(false);
      setProductoId(null);
    }
  };

  const getStockStatus = (actual: number, minimo: number) => {
    if (actual === 0) return { variant: "danger" as const, label: "Sin stock" };
    if (actual < minimo) return { variant: "warning" as const, label: "Bajo" };
    return { variant: "success" as const, label: "OK" };
  };

  const getCategoriaNombre = (categoriaId: number) => {
    const cat = categorias.find((c) => c.id === categoriaId);
    return cat?.nombre || "Sin categoría";
  };

  if (productos.length === 0) {
    return (
      <EmptyState
        icon={<Package className="w-8 h-8 text-slate-400" />}
        title="No hay productos"
        description="Comienza agregando productos a tu inventario"
      />
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="p-4 text-left font-medium">Producto</th>
              <th className="p-4 text-left font-medium">Categoría</th>
              <th className="p-4 text-left font-medium">SKU</th>
              <th className="p-4 text-left font-medium">Precio</th>
              <th className="p-4 text-left font-medium">Stock</th>
              <th className="p-4 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productos.map((p) => {
              const status = getStockStatus(p.stock_actual, p.stock_minimo);
              return (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-slate-900">{p.nombre}</p>
                      <p className="text-sm text-slate-500 truncate max-w-xs">
                        {p.descripcion || "Sin descripción"}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {getCategoriaNombre(p.categoria_id)}
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {p.sku}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-slate-900">
                      ${p.precio.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        {p.stock_actual}
                      </span>
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      mín: {p.stock_minimo}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Pencil className="w-4 h-4" />}
                        onClick={() => onEdit(p)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => openConfirm(p.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3 p-4">
        {productos.map((p) => {
          const status = getStockStatus(p.stock_actual, p.stock_minimo);
          return (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{p.nombre}</h3>
                  <p className="text-sm text-slate-500 font-mono">{p.sku}</p>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <p className="text-slate-500">Categoría</p>
                  <p className="font-medium text-slate-900">
                    {getCategoriaNombre(p.categoria_id)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Precio</p>
                  <p className="font-medium text-slate-900">
                    ${p.precio.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Stock</p>
                  <p className="font-medium text-slate-900">
                    {p.stock_actual} <span className="text-slate-400">/ {p.stock_minimo} min</span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Descripción</p>
                  <p className="text-slate-600 truncate">
                    {p.descripcion || "-"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  icon={<Pencil className="w-4 h-4" />}
                  onClick={() => onEdit(p)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => openConfirm(p.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="¿Eliminar producto?"
        message="Esta acción no se puede deshacer. El producto será marcado como inactivo."
        confirmLabel="Eliminar"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}