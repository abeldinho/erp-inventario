export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  created_at: string;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion: string;
}