import { useMemo } from "react";
import type { Producto } from "../../modules/productos/types/producto";

export type NivelAlerta = "critico" | "bajo" | "advertencia" | "ok";

export interface AlertaUnificada {
  id: number;
  nombre: string;
  sku: string;
  categoria_id: number;
  stock_actual: number;
  stock_minimo: number;
  nivel: NivelAlerta;
  diferencia: number;
}

export function useAlertasUnificadas(productos: Producto[]): {
  alertas: AlertaUnificada[];
  stats: { critico: number; bajo: number; advertencia: number; total: number };
  productosConAlerta: AlertaUnificada[];
} {
  const alertas = useMemo(() => {
    if (!productos || productos.length === 0) return [];

    return productos.map((p) => {
      const diferencia = p.stock_actual - p.stock_minimo;
      let nivel: NivelAlerta;

      // productos sin stock = crítico
      if (p.stock_actual === 0) {
        nivel = "critico";
      } 
      // productos con stock bajo el mínimo
      else if (diferencia < 0) {
        const porcentaje = (p.stock_actual / p.stock_minimo) * 100;
        if (porcentaje <= 30) {
          nivel = "critico";
        } else if (porcentaje <= 60) {
          nivel = "bajo";
        } else {
          nivel = "advertencia";
        }
      } 
      // productos en el mínimo o por encima = ok
      else {
        nivel = "ok";
      }

      return {
        id: p.id,
        nombre: p.nombre,
        sku: p.sku,
        categoria_id: p.categoria_id,
        stock_actual: p.stock_actual,
        stock_minimo: p.stock_minimo,
        nivel,
        diferencia,
      };
    });
  }, [productos]);

  // Filtrar solo los que tienen problema (no son "ok")
  const productosConAlerta = useMemo(() => {
    return alertas.filter((a) => a.nivel !== "ok");
  }, [alertas]);

  const stats = useMemo(() => {
    return {
      critico: alertas.filter((a) => a.nivel === "critico").length,
      bajo: alertas.filter((a) => a.nivel === "bajo").length,
      advertencia: alertas.filter((a) => a.nivel === "advertencia").length,
      total: productosConAlerta.length,
    };
  }, [alertas, productosConAlerta]);

  return { alertas, stats, productosConAlerta };
}