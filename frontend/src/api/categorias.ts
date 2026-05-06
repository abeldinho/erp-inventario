import { api } from "./client";
import type { Categoria, CategoriaCreate } from "../types/categoria";

export const getCategorias = async (): Promise<Categoria[]> => {
  const res = await api.get("/categorias");
  return res.data;
};

export const createCategoria = async (data: CategoriaCreate) => {
  return api.post("/categorias", data);
};

export const updateCategoria = async (id: number, data: CategoriaCreate) => {
  return api.put(`/categorias/${id}`, data);
};

export const deleteCategoria = async (id: number) => {
  return api.delete(`/categorias/${id}`);
};