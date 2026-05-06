import { z } from "zod";

export const categoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
});

export type CategoriaFormData = z.infer<typeof categoriaSchema>;