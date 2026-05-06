// src/hooks/useProductos.ts
import { useEffect, useState } from "react";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  getAlertas,
} from "../../../api/productos";
import type { Producto, ProductoCreate, ProductoUpdate, ProductoAlerta } from "../types/producto";

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [alertas, setAlertas] = useState<ProductoAlerta[]>([]); 
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: ProductoCreate) => {
    try {
      await createProducto(data);
      await load();  // Recargar lista
    } catch (error) {
      console.error("Error creando producto:", error);
      throw error;  // Re-lanzar para manejo en UI
    }
  };

  const update = async (id: number, data: ProductoUpdate) => {
    try {
      await updateProducto(id, data);
      await load();  // Recargar lista
    } catch (error) {
      console.error("Error actualizando producto:", error);
      throw error;
    }
  };

  const remove = async (id: number) => {
    try {
      await deleteProducto(id);
      await load();  // Recargar lista
    } catch (error) {
      console.error("Error eliminando producto:", error);
      throw error;
    }
  };

  // ✅ CARGA AUTOMÁTICA DE ALERTAS
  const loadAlertas = async () => {
    setLoading(true);
    try {
      const data = await getAlertas();
      setAlertas(data);
    } catch (error) {
      console.error("❌ Error alertas:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CARGAR AMBOS AUTOMÁTICAMENTE
  useEffect(() => {
    load();
    loadAlertas();  // ← ESTO ES CLAVE
  }, []);

  return { productos, alertas, loading, load, loadAlertas, create, update, remove };
}