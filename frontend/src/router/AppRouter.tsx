// src/router/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import AppLayout from "../layout/AppLayout";

import Dashboard from "../modules/dashboard/pages/DashboardPage";
import ProductosPage from "../modules/productos/pages/ProductosPage";
import CategoriasPage from "../modules/categorias/pages/CategoriasPage";
import MovimientosPage from "../modules/movimientos/pages/MovimientosPage";
import HistorialPage from "../modules/movimientos/pages/HistorialPage";
import AlertasStockPage from "../modules/movimientos/pages/AlertasStockPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="movimientos" element={<MovimientosPage />} />
        <Route path="historial" element={<HistorialPage />} />
        <Route path="alertas" element={<AlertasStockPage />} />
      </Route>
    </Routes>
  );
}