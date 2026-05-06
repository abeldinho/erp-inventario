import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";
import { useToast } from "../../../shared/hooks/useToast";

import {
  categoriaSchema,
  type CategoriaFormData,
} from "../schemas/categorias.shcema";
import type { Categoria } from "../types/categoria";

type Props = {
  onSubmit: (data: CategoriaFormData) => Promise<void>;
  initialData?: Categoria | null;
};

export default function CategoriaForm({ onSubmit, initialData }: Props) {
  const isEdit = !!initialData;
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nombre: initialData.nombre,
        descripcion: initialData.descripcion || "",
      });
    } else {
      reset({
        nombre: "",
        descripcion: "",
      });
    }
  }, [initialData, reset]);

  const onSubmitForm = async (data: CategoriaFormData) => {
    try {
      setLoading(true);
      await onSubmit(data);
      showSuccess(
        isEdit
          ? "Categoría actualizada correctamente"
          : "Categoría creada correctamente"
      );
      if (!isEdit) {
        reset({ nombre: "", descripcion: "" });
      }
    } catch (err: any) {
      showError(
        err?.response?.data?.detail || "Error al guardar categoría"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <Input
        label="Nombre"
        placeholder="Ingresa el nombre de la categoría"
        {...register("nombre")}
        error={errors.nombre?.message}
      />

      <Input
        label="Descripción"
        placeholder="Descripción opcional"
        {...register("descripcion")}
        error={errors.descripcion?.message}
      />

      <Button type="submit" className="w-full" loading={loading}>
        {isEdit ? "Actualizar Categoría" : "Crear Categoría"}
      </Button>
    </form>
  );
}