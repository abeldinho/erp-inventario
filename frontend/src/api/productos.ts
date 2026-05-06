// src/api/productos.ts
import { api } from "./client";
import type { Producto, ProductoCreate, ProductoUpdate } from "../modules/productos/types/producto";

export const getProductos = async (): Promise<Producto[]> => {
  const res = await api.get("/productos");
  return res.data;
};

export const createProducto = async (data: ProductoCreate) => {
  return api.post("/productos", data);
};

export const updateProducto = async (id: number, data: ProductoUpdate) => {
  return api.put(`/productos/${id}`, data);
};

export const deleteProducto = async (id: number) => {
  return api.delete(`/productos/${id}`);
};

export const getAlertas = async () => {
  const res = api.get(`/productos/alertas/stock-bajo`);
  return (await res).data;
};