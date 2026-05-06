import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../../shared/components/ui/Input";
import Select from "../../../shared/components/ui/Select";
import Button from "../../../shared/components/ui/Button";
import { useToast } from "../../../shared/hooks/useToast";

import {
  productoCreateSchema,
  productoUpdateSchema,
  type ProductoCreateFormData,
  type ProductoUpdateFormData,
} from "../schemas/producto.schema";

import type { Producto } from "../types/producto";
import { useCategorias } from "../../categorias/hooks/useCategorias";
import { ArrowLeft } from "lucide-react";

type Props = {
  onSubmit: (data: any) => Promise<void>;
  initialData?: Producto | null;
};

export default function ProductoForm({ onSubmit, initialData }: Props) {
  const { categorias } = useCategorias();
  const { showSuccess, showError } = useToast();

  const isEdit = !!initialData;

  const schema = isEdit ? productoUpdateSchema : productoCreateSchema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductoCreateFormData | ProductoUpdateFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      sku: "",
      precio: 0,
      stock_minimo: 0,
      categoria_id: undefined,
    },
  });

  useEffect(() => {
    if (isEdit && initialData) {
      reset({
        nombre: initialData.nombre,
        descripcion: initialData.descripcion || "",
        precio: initialData.precio,
        stock_minimo: initialData.stock_minimo,
        categoria_id: initialData.categoria_id,
      } as ProductoUpdateFormData);
    } else {
      reset({
        nombre: "",
        descripcion: "",
        sku: "",
        precio: 0,
        stock_minimo: 0,
        categoria_id: undefined,
      } as ProductoCreateFormData);
    }
  }, [initialData, isEdit, reset]);

  const handleFormSubmit = async (data: any) => {
    try {
      let payload: any = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: Number(data.precio),
        stock_minimo: Number(data.stock_minimo),
        categoria_id: Number(data.categoria_id),
      };

      if (!isEdit) {
        payload.sku = data.sku;
      }

      await onSubmit(payload);
      showSuccess(isEdit ? "Producto actualizado" : "Producto creado");

      if (!isEdit) reset();
    } catch (err: any) {
      showError(err?.response?.data?.detail || "Error al guardar producto");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Nombre"
        placeholder="Ingresa el nombre del producto"
        {...register("nombre")}
        error={errors.nombre?.message}
      />

      <Input
        label="Descripción"
        placeholder="Descripción opcional del producto"
        {...register("descripcion")}
        error={errors.descripcion?.message}
      />

      {!isEdit && (
        <Input
          label="SKU"
          placeholder="Código único del producto"
          {...register("sku")}
          error={errors.sku?.message}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("precio", { valueAsNumber: true })}
          error={errors.precio?.message}
        />

        <Input
          label="Stock mínimo"
          type="number"
          placeholder="0"
          {...register("stock_minimo", { valueAsNumber: true })}
          error={errors.stock_minimo?.message}
        />
      </div>

      <Controller
        name="categoria_id"
        control={control}
        render={({ field }) => (
          <Select
            label="Categoría"
            placeholder="Selecciona una categoría"
            options={categorias.map((c) => ({
              label: c.nombre,
              value: c.id,
            }))}
            value={field.value ?? ""}
            onChange={(e) =>
              field.onChange(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            error={errors.categoria_id?.message}
          />
        )}
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1"
          loading={isSubmitting}
        >
          {isEdit ? "Actualizar Producto" : "Crear Producto"}
        </Button>
      </div>
    </form>
  );
}