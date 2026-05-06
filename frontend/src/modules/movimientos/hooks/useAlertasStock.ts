// hooks/useAlertasStock.ts
import { useMemo, useState } from "react";
import type { AlertaStock } from "../types/alerta";

export function useAlertasStock(alertas: AlertaStock[]) {
  const [vista, setVista] = useState<
    "todos" | "rojo" | "naranja" | "amarillo"
  >("todos");

  const calcularPorcentaje = (a: AlertaStock) =>
    a.stock_minimo > 0
      ? Math.round((a.stock_actual / a.stock_minimo) * 100)
      : 0;

  const getColor = (a: AlertaStock) => {
    const p = calcularPorcentaje(a);
    if (p <= 30) return "rojo";
    if (p <= 60) return "naranja";
    return "amarillo";
  };

 const filtradas = useMemo(() => {
  if (!alertas || alertas.length === 0) return [];
  if (vista === "todos") return alertas;

  return alertas.filter((a) => getColor(a) === vista);
}, [vista, alertas]);

  return {
    vista,
    setVista,
    filtradas,
    calcularPorcentaje,
    getColor,
  };
}