import { useState } from "react";
import { useProductos } from "../../productos/hooks/useProductos";
import { useCategorias } from "../../categorias/hooks/useCategorias";
import ProductoForm from "../components/ProductoForm";
import ProductoTable from "../components/ProductoTable";
import Card from "../../../shared/components/ui/Card";
import Button from "../../../shared/components/ui/Button";
import Loading from "../../../shared/components/ui/Loading";
import { Plus, Search, X } from "lucide-react";

export default function ProductosPage() {
  const { productos, create, update, remove, loading } = useProductos();
  const { categorias } = useCategorias();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");

  const filteredProducts = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (producto: any) => {
    setEditing(producto);
    setOpen(true);
  };

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

  if (loading) return <Loading text="Cargando productos..." />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-slate-500 mt-1">
            Gestiona el catálogo de productos ({productos.length} total)
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Nuevo Producto
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <ProductoTable
          productos={filteredProducts}
          categorias={categorias}
          onEdit={handleEdit}
          onDelete={remove}
        />
      </Card>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editing ? "Editar Producto" : "Nuevo Producto"}
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
              <ProductoForm
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