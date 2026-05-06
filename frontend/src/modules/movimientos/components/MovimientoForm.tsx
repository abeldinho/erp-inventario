import { useMemo, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../../shared/components/ui/Input";
import Select from "../../../shared/components/ui/Select";

import {
  movimientoSchema,
  type MovimientoFormData,
} from "../schemas/movimiento.schema";

type Producto = {
  id: number;
  nombre: string;
  stock_actual: number;
};

type Props = {
  productos: Producto[];
  onSubmit: (data: MovimientoFormData) => Promise<void>;
};

export default function MovimientoForm({ productos, onSubmit }: Props) {
  // ✅ UX states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<MovimientoFormData>({
    resolver: zodResolver(movimientoSchema),
    defaultValues: {
      tipo: "",
      usuario: "admin",
    },
  });

  // 👀 Watchers
  const productoId = watch("producto_id");
  const tipo = watch("tipo");
  const cantidad = watch("cantidad") || 0;

  // 🔎 Producto seleccionado
  const productoSeleccionado = useMemo(
    () => productos.find(p => p.id === productoId),
    [productoId, productos]
  );

  const stockActual = productoSeleccionado?.stock_actual || 0;

  // 🧠 Stock calculado
  const stockResultante = useMemo(() => {
    if (!productoSeleccionado) return 0;

    return tipo === "entrada"
      ? stockActual + cantidad
      : stockActual - cantidad;
  }, [tipo, cantidad, stockActual, productoSeleccionado]);

  const stockInvalido =
    tipo === "salida" && cantidad > stockActual;

  // 🚀 Submit
  const handleFormSubmit = async (data: MovimientoFormData) => {
    setErrorMsg("");
    setSuccess("");

    if (stockInvalido) {
      setErrorMsg("No hay suficiente stock");
      return;
    }

    try {
      setLoading(true);

      await onSubmit(data);

      // ✅ éxito
      setSuccess("Movimiento registrado correctamente");

      // ✅ reset form
      reset({
        producto_id: undefined,
        tipo: "",
        cantidad: undefined,
        motivo: "",
        usuario: "admin",
      });

    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.detail || "Error al registrar movimiento"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🧼 Auto limpiar mensaje éxito
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
    >
      {/* ✅ Feedback */}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg">
          {success}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Producto */}
      <Controller
        name="producto_id"
        control={control}
        render={({ field }) => (
          <Select
            label="Producto"
            name={field.name}
            value={field.value || ""}
            onChange={(e) => field.onChange(Number(e.target.value))}
            options={productos.map(p => ({
              label: p.nombre,
              value: p.id,
            }))}
            error={errors.producto_id?.message}
          />
        )}
      />

      {/* Info de stock */}
      {productoSeleccionado && (
        <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
          <p>Stock actual: <b>{stockActual}</b></p>
          <p>
            Stock resultante:{" "}
            <b className={stockInvalido ? "text-red-600" : "text-green-600"}>
              {stockResultante}
            </b>
          </p>
        </div>
      )}

      {/* Tipo */}
      <Controller
        name="tipo"
        control={control}
        render={({ field }) => (
          <Select
            label="Tipo"
            name={field.name}
            value={field.value || ""}
            onChange={field.onChange}
            options={[
              { label: "Entrada", value: "entrada" },
              { label: "Salida", value: "salida" },
            ]}
            error={errors.tipo?.message}
          />
        )}
      />

      {/* Cantidad */}
      <Input
        label="Cantidad"
        type="number"
        {...register("cantidad", { valueAsNumber: true })}
        error={errors.cantidad?.message}
        disabled={!tipo}
      />

      {/* Motivo */}
      <Input
        label="Motivo"
        {...register("motivo")}
        error={errors.motivo?.message}
      />

      {/* Usuario */}
      <Input
        label="Usuario"
        {...register("usuario")}
      />

      {/* Error de stock */}
      {stockInvalido && (
        <p className="text-red-500 text-sm">
          No puedes retirar más de lo disponible
        </p>
      )}

      {/* Botón */}
      <button
        type="submit"
        disabled={loading || stockInvalido}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium"
      >
        {loading ? "Guardando..." : "Registrar Movimiento"}
      </button>
    </form>
  );
}