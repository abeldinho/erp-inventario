// components/AlertasFilters.tsx
export default function AlertasFilters({
  vista,
  setVista,
  total,
}: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex gap-2 flex-wrap">
      {["todos", "rojo", "naranja", "amarillo"].map((v) => (
        <button
          key={v}
          onClick={() => setVista(v)}
          className={`px-4 py-2 rounded-lg ${
            vista === v
              ? "bg-blue-600 text-white"
              : "bg-gray-100"
          }`}
        >
          {v} {v === "todos" && `(${total})`}
        </button>
      ))}
    </div>
  );
}