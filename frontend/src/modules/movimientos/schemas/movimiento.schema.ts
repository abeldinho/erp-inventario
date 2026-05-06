import { z } from "zod";

export const movimientoSchema = z.object({
  producto_id: z.number().min(1, "Selecciona un producto"),
  tipo: z.enum(["entrada","salida"]),
  cantidad: z.number().min(1, "Debe ser mayor a 0"),
  motivo: z.string().min(1, "El motivo es obligatorio"),
  usuario: z.string().min(1),
});

export type MovimientoFormData = z.infer<typeof movimientoSchema>;