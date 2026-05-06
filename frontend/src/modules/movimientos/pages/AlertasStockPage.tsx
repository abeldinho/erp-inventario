// pages/AlertasStockPage.tsx
import { useState } from "react";
import { useProductos } from "../../productos/hooks/useProductos";
import Card from "../../../shared/components/ui/Card";
import Badge from "../../../shared/components/ui/Badge";
import Button from "../../../shared/components/ui/Button";
import Loading from "../../../shared/components/ui/Loading";
import { useAlertasUnificadas, type AlertaUnificada, type NivelAlerta } from "../../../shared/hooks/useAlertasUnificadas";
import { AlertTriangle, Package, Filter } from "lucide-react";

type FiltroAlerta = "todos" | "critico" | "bajo" | "advertencia";

const getNivelBadge = (nivel: NivelAlerta) => {
  switch (nivel) {
    case "critico":
      return <Badge variant="danger">Crítico</Badge>;
    case "bajo":
      return <Badge variant="warning">Bajo</Badge>;
    case "advertencia":
      return <Badge variant="info">Advertencia</Badge>;
    default:
      return <Badge variant="success">OK</Badge>;
  }
};

const getNivelColor = (nivel: NivelAlerta) => {
  switch (nivel) {
    case "critico":
      return "bg-red-50 border-red-200";
    case "bajo":
      return "bg-amber-50 border-amber-200";
    case "advertencia":
      return "bg-blue-50 border-blue-200";
    default:
      return "bg-emerald-50 border-emerald-200";
  }
};

export default function AlertasStockPage() {
  const { productos, loading: loadingProductos } = useProductos();
  const [filtro, setFiltro] = useState<FiltroAlerta>("todos");

  // Pasar TODOS los productos al hook - él hace la lógica
  const { alertas, stats } = useAlertasUnificadas(productos);

  // Aplicar filtro
  const alertasFiltradas = filtro === "todos"
    ? alertas.filter((a) => a.nivel !== "ok")
    : alertas.filter((a) => a.nivel === filtro);

  if (loadingProductos) return <Loading text="Cargando alertas..." />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Alertas de Stock</h1>
        <p className="text-slate-500 mt-1">
          Productos que requieren atención ({alertas.length} total)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="p-3 bg-red-50 rounded-xl inline-block mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.critico}</p>
          <p className="text-sm text-slate-500">Críticos</p>
        </Card>
        <Card className="text-center">
          <div className="p-3 bg-amber-50 rounded-xl inline-block mb-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.bajo}</p>
          <p className="text-sm text-slate-500">Bajo</p>
        </Card>
        <Card className="text-center">
          <div className="p-3 bg-blue-50 rounded-xl inline-block mb-2">
            <AlertTriangle className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.advertencia}</p>
          <p className="text-sm text-slate-500">Advertencia</p>
        </Card>
        <Card className="text-center">
          <div className="p-3 bg-slate-100 rounded-xl inline-block mb-2">
            <Package className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-sm text-slate-500">Total</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Filtrar por:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["todos", "critico", "bajo", "advertencia"] as FiltroAlerta[]).map(
            (f) => (
              <Button
                key={f}
                variant={filtro === f ? "primary" : "secondary"}
                size="sm"
                onClick={() => setFiltro(f)}
              >
                {f === "todos" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            )
          )}
        </div>
      </Card>

      {/* Alerts Table - Desktop */}
      {alertasFiltradas.length > 0 ? (
        <>
          <div className="hidden lg:block">
            <Card padding="none">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="p-4 text-left font-medium">Producto</th>
                    <th className="p-4 text-left font-medium">SKU</th>
                    <th className="p-4 text-left font-medium">Stock Actual</th>
                    <th className="p-4 text-left font-medium">Stock Mínimo</th>
                    <th className="p-4 text-left font-medium">Diferencia</th>
                    <th className="p-4 text-left font-medium">Nivel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alertasFiltradas.map((alerta: AlertaUnificada) => (
                    <tr
                      key={alerta.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-slate-900">
                        {alerta.nombre}
                      </td>
                      <td className="p-4 font-mono text-slate-600">
                        {alerta.sku}
                      </td>
                      <td className="p-4 font-semibold text-slate-900">
                        {alerta.stock_actual}
                      </td>
                      <td className="p-4 text-slate-600">{alerta.stock_minimo}</td>
                      <td className="p-4">
                        <span
                          className={
                            alerta.diferencia < 0
                              ? "text-red-600 font-medium"
                              : "text-emerald-600 font-medium"
                          }
                        >
                          {alerta.diferencia > 0 ? "+" : ""}
                          {alerta.diferencia}
                        </span>
                      </td>
                      <td className="p-4">{getNivelBadge(alerta.nivel)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {alertasFiltradas.map((alerta: AlertaUnificada) => (
              <div
                key={alerta.id}
                className={`border rounded-xl p-4 ${getNivelColor(alerta.nivel)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{alerta.nombre}</h3>
                    <p className="text-sm text-slate-500 font-mono">{alerta.sku}</p>
                  </div>
                  {getNivelBadge(alerta.nivel)}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-slate-500">Actual</p>
                    <p className="font-medium text-slate-900">{alerta.stock_actual}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Mínimo</p>
                    <p className="font-medium text-slate-900">{alerta.stock_minimo}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Diferencia</p>
                    <p
                      className={`font-medium ${
                        alerta.diferencia < 0 ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {alerta.diferencia > 0 ? "+" : ""}
                      {alerta.diferencia}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Sin alertas
          </h3>
          <p className="text-slate-500">
            {filtro === "todos"
              ? "No hay productos con stock bajo"
              : `No hay alertas de nivel "${filtro}"`}
          </p>
        </Card>
      )}
    </div>
  );
}