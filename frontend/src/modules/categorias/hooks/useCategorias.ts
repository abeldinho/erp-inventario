import { useEffect, useState } from "react";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../../../api/categorias";
import type { Categoria } from "../types/categoria";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await getCategorias();
    setCategorias(data);
    setLoading(false);
  };

  const create = async (data: any) => {
    await createCategoria(data);
    await load();
  };

  const update = async (id: number, data: any) => {
    await updateCategoria(id, data);
    await load();
  };

  const remove = async (id: number) => {
    await deleteCategoria(id);
    await load();
  };

  useEffect(() => {
    load();
  }, []);

  return { categorias, loading, create, update, remove };
}