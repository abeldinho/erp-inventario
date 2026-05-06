import { AlertTriangle } from "lucide-react";
import Button from "./Button";

type Props = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-50 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {message && (
              <p className="mt-2 text-sm text-slate-500">{message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}