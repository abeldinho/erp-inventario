import { useProductos } from "../../productos/hooks/useProductos";
import Card from "../../../shared/components/ui/Card";
import Badge from "../../../shared/components/ui/Badge";
import Loading from "../../../shared/components/ui/Loading";
import { useAlertasUnificadas, type AlertaUnificada, type NivelAlerta } from "../../../shared/hooks/useAlertasUnificadas";

import {
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

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

export default function DashboardPage() {
  const { productos, loading: loadingProductos } = useProductos();
  
  // Pasar TODOS los productos al hook - él hace la lógica
  const { productosConAlerta, stats: alertasStats } = useAlertasUnificadas(productos);

  const loading = loadingProductos;

  if (loading) return <Loading text="Cargando dashboard..." />;
  if (!productos.length) return <Loading text="Cargando productos..." />;

  // Stats calculations
  const totalValor = productos.reduce(
    (sum, p) => sum + p.precio * p.stock_actual,
    0
  );

  const stats = {
    totalProductos: productos.length,
    valorTotalInventario: Math.round(totalValor),
    stockBajo: alertasStats.total,
    promedioPrecio: Math.round(totalValor / productos.length),
  };

  // Top productos
  const topCantidad = [...productos]
    .sort((a, b) => b.stock_actual - a.stock_actual)
    .slice(0, 5);

  const topValor = [...productos]
    .sort((a, b) => b.precio * b.stock_actual - a.precio * a.stock_actual)
    .slice(0, 5);

  // Alertas críticas (solo las que están bajo stock)
  const alertasCriticas = productosConAlerta.filter(
    (a) => a.nivel === "critico" || a.nivel === "bajo"
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Resumen del estado de tu inventario
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-primary-50 rounded-xl">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-slate-900">
              {stats.totalProductos}
            </p>
            <p className="text-sm text-slate-500">Productos</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
              <span>+8%</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-slate-900">
              ${stats.valorTotalInventario.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500">Valor Inventario</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-amber-50 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-slate-900">
              {stats.stockBajo}
            </p>
            <p className="text-sm text-slate-500">Stock Bajo</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-purple-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-slate-900">
              ${stats.promedioPrecio.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500">Precio Promedio</p>
          </div>
        </Card>
      </div>

      {/* Top Productos Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top por Cantidad */}
        <Card padding="none">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Top por Cantidad</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {topCantidad.map((producto: any, index: number) => (
              <div
                key={producto.id}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{producto.nombre}</p>
                    <p className="text-sm text-slate-500">{producto.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{producto.stock_actual}</p>
                  <p className="text-sm text-slate-500">unidades</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top por Valor */}
        <Card padding="none">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Top por Valor</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {topValor.map((producto: any, index: number) => {
              const valor = producto.precio * producto.stock_actual;
              return (
                <div
                  key={producto.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{producto.nombre}</p>
                      <p className="text-sm text-slate-500">
                        ${producto.precio.toLocaleString()} c/u
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      ${valor.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">valor total</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Stock Alerts */}
      {alertasCriticas.length > 0 && (
        <Card padding="none">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Productos con Stock Bajo</h2>
            <Badge variant="warning" dot>
              {alertasCriticas.length} alertas
            </Badge>
          </div>
          <div className="divide-y divide-slate-100">
            {alertasCriticas.slice(0, 5).map((alerta: AlertaUnificada) => (
              <div
                key={alerta.id}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-slate-900">{alerta.nombre}</p>
                  <p className="text-sm text-slate-500">{alerta.sku}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {alerta.stock_actual} / {alerta.stock_minimo}
                    </p>
                    <p className="text-xs text-slate-500">mínimo</p>
                  </div>
                  {getNivelBadge(alerta.nivel)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}