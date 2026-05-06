# ⚡ Frontend Quick Reference

Referencia rápida para desarrolladores del frontend.

---

## 🚀 Crear un Nuevo Módulo

### Estructura Obligatoria
```
modules/<modulo>/
├── pages/<Modulo>Page.tsx     # Componente de página
├── components/                 # Componentes del módulo
│   ├── <Modulo>Table.tsx
│   └── <Modulo>Form.tsx
├── hooks/use<Modulo>.ts        # Custom hook para datos
├── schemas/<modulo>.schema.ts # Validación Zod
└── types/<modulo>.ts           # TypeScript interfaces
```

### Hook Estándar
```typescript
// hooks/useProducto.ts
export function useProducto() {
  const [data, setData] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getData();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const create = async (payload) => {
    await createData(payload);
    await load();
  };

  useEffect(() => { load(); }, []);

  return { data, loading, load, create };
}
```

---

## 📝 Agregar un Endpoint de API

### 1. Crear función en `api/nombre.ts`
```typescript
export const getSomething = async (id: number) => {
  const res = await api.get(`/recurso/${id}`);
  return res.data;
};
```

### 2. Exportar en hook
```typescript
// hooks/useAlgo.ts
import { getSomething } from "../../api/nombre";

const load = async () => {
  const data = await getSomething(id);
  setData(data);
};
```

---

## 🔧 Agregar un Campo a un Formulario

### 1. Agregar al Schema Zod
```typescript
// schemas/producto.schema.ts
export const productoSchema = z.object({
  nombre: z.string().min(1),
  nuevoCampo: z.string().min(1),  // ← Agregar aquí
});
```

### 2. Agregar al Tipo TypeScript
```typescript
// types/producto.ts
export interface ProductoCreate {
  nombre: string;
  nuevoCampo: string;  // ← Agregar aquí
}
```

### 3. Agregar Input en el Form
```tsx
// components/ProductoForm.tsx
<Input
  label="Nuevo Campo"
  {...register("nuevoCampo")}
  error={errors.nuevoCampo?.message}
/>
```

---

## 🎨 Usar un Componente UI

### Input
```tsx
<Input
  label="Nombre"
  {...register("nombre")}
  error={errors.nombre?.message}
/>
```

### Select
```tsx
<Controller
  name="categoria_id"
  control={control}
  render={({ field }) => (
    <Select
      label="Categoría"
      {...field}
      options={[{ label: "A", value: 1 }]}
/    />
  )}
/>
```

### Toast
```tsx
const { showSuccess, showError } = useToast();

showSuccess("Operación exitosa");
showError("Ocurrió un error");
```

---

## 🔄 Padrón de Página con Modal

```tsx
export default function ModulePage() {
  const { data, loading, create, update, remove } = useModule();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <div>
      <button onClick={() => { setEditing(null); setOpen(true); }}>
        + Nuevo
      </button>

      <ModuleTable
        data={data}
        onEdit={(item) => { setEditing(item); setOpen(true); }}
        onDelete={remove}
      />

      {open && (
        <div className="modal">
          <ModuleForm
            initialData={editing}
            onSubmit={async (data) => {
              if (editing) {
                await update(editing.id, data);
              } else {
                await create(data);
              }
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
```

---

## 🧩 Usar el Router

### Agregar nueva ruta
```tsx
// router/AppRouter.tsx
<Route path="/nueva-ruta" element={<NuevaPage />} />
```

### Navegar desde componente
```tsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/productos");
```

---

## ✅ Checklist Antes de Commit

- [ ] Sin `console.log` de debug
- [ ] Tipos TypeScript correctos
- [ ] Schemas Zod sincronizados con API
- [ ] Loading states implementados
- [ ] Errores manejados con toast
- [ ] Tests agregados (si aplica)

---

## 📚 Recursos

- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Axios](https://axios-http.com)