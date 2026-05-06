// shared/components/ui/toast/ToastContainer.tsx
import { useToastContext } from "../../../context/ToastContext";
import Toast from "./Toast";

export default function ToastContainer() {
  const { toasts } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto z-50 flex flex-col gap-2 pointer-events-none md:w-96">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} />
      ))}
    </div>
  );
}