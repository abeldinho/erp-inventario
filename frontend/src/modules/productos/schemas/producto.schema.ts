import { z } from "zod";

export const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
  precio: z.number().min(0, "Debe ser mayor o igual a 0"),
  stock_minimo: z.number().min(0),
  categoria_id: z.number().min(1, "Selecciona una categoría"),
});

export const productoCreateSchema = productoSchema.extend({
  sku: z.string().min(1, "SKU es obligatorio"),
});

export type ProductoCreateFormData = z.infer<typeof productoCreateSchema>;

export const productoUpdateSchema = productoSchema.partial();

export type ProductoUpdateFormData = z.infer<typeof productoUpdateSchema>;