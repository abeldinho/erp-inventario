import { useState } from "react";
import { useCategorias } from "../hooks/useCategorias";
import CategoriaForm from "../components/CategoriaForm";
import CategoriaTable from "../components/CategoriaTable";
import Card from "../../../shared/components/ui/Card";
import Button from "../../../shared/components/ui/Button";
import Loading from "../../../shared/components/ui/Loading";
import { Plus, X } from "lucide-react";

export default function CategoriasPage() {
  const { categorias, create, update, remove, loading } = useCategorias();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const handleSubmit = async (data: any) => {
    if (editing) {
      await update(editing.id, data);
    } else {
      await create(data);
    }
    setOpen(false);
    setEditing(null);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  if (loading) return <Loading text="Cargando categorías..." />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categorías</h1>
          <p className="text-slate-500 mt-1">
            Organiza tus productos por categorías ({categorias.length} total)
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Nueva Categoría
        </Button>
      </div>

      {/* Table */}
      <Card padding="none">
        <CategoriaTable
          categorias={categorias}
          onEdit={(categoria: any) => {
            setEditing(categoria);
            setOpen(true);
          }}
          onDelete={remove}
        />
      </Card>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editing ? "Editar Categoría" : "Nueva Categoría"}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <CategoriaForm
                initialData={editing}
                onSubmit={handleSubmit}
              />
            </div>

            {/* Modal Footer - Cancel Button */}
            <div className="px-4 pb-4">
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}