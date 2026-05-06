import { useState } from "react";
import ConfirmModal from "../../../shared/components/ui/ConfirmModal";
import Badge from "../../../shared/components/ui/Badge";
import Button from "../../../shared/components/ui/Button";
import { useToast } from "../../../shared/hooks/useToast";
import { Pencil, Trash2, Tags } from "lucide-react";
import EmptyState from "../../../shared/components/ui/EmptyState";
import type { Categoria } from "../../../types/categoria";

type Props = {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function CategoriaTable({
  categorias,
  onEdit,
  onDelete,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const { showSuccess, showError } = useToast();

  const openConfirm = (id: number) => {
    setCategoriaId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoriaId) return;
    try {
      await onDelete(categoriaId);
      showSuccess("Categoría eliminada correctamente");
    } catch (e: any) {
      showError(e?.response?.data?.detail || "Error al eliminar categoría");
    } finally {
      setConfirmOpen(false);
      setCategoriaId(null);
    }
  };

  if (categorias.length === 0) {
    return (
      <EmptyState
        icon={<Tags className="w-8 h-8 text-slate-400" />}
        title="No hay categorías"
        description="Crea categorías para organizar tus productos"
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
              <th className="p-4 text-left font-medium">Nombre</th>
              <th className="p-4 text-left font-medium">Descripción</th>
              <th className="p-4 text-left font-medium">Estado</th>
              <th className="p-4 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categorias.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <Tags className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="font-medium text-slate-900">
                      {c.nombre}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-slate-600">
                  {c.descripcion || "Sin descripción"}
                </td>
                <td className="p-4">
                  <Badge variant={c.activo ? "success" : "neutral"}>
                    {c.activo ? "Activa" : "Inactiva"}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Pencil className="w-4 h-4" />}
                      onClick={() => onEdit(c)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => openConfirm(c.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3 p-4">
        {categorias.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Tags className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{c.nombre}</h3>
                  <Badge variant={c.activo ? "success" : "neutral"}>
                    {c.activo ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-sm mb-3">
              <p className="text-slate-500">
                <span className="font-medium text-slate-700">Descripción:</span>{" "}
                {c.descripcion || "Sin descripción"}
              </p>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                icon={<Pencil className="w-4 h-4" />}
                onClick={() => onEdit(c)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => openConfirm(c.id)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="¿Eliminar categoría?"
        message="Los productos asociados ya no tendrán categoría asignada."
        confirmLabel="Eliminar"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}