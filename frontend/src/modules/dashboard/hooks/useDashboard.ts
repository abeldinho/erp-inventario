import { useMemo } from "react";
import type { Producto } from "../../../types/producto";

export function useDashboard(productos: Producto[]) {

  const stats = useMemo(() => {
    if (!productos.length) return null;

    const totalValor = productos.reduce(
      (sum, p) => sum + p.precio * p.stock_actual,
      0
    );

    return {
      totalProductos: productos.length,
      valorTotalInventario: Math.round(totalValor),
      stockBajo: productos.filter(
        p => p.stock_actual <= p.stock_minimo
      ).length,
      promedioPrecio: Math.round(totalValor / productos.length),
    };
  }, [productos]);

  const topCantidad = useMemo(() => {
    return [...productos]
      .sort((a, b) => b.stock_actual - a.stock_actual)
      .slice(0, 5);
  }, [productos]);

  const topValor = useMemo(() => {
    return [...productos]
      .sort(
        (a, b) =>
          b.precio * b.stock_actual - a.precio * a.stock_actual
      )
      .slice(0, 5);
  }, [productos]);

  const stockCritico = useMemo(() => {
    return productos.filter(
      p => p.stock_actual <= p.stock_minimo
    );
  }, [productos]);

  return {
    stats,
    topCantidad,
    topValor,
    stockCritico,
  };
}