// shared/components/ui/toast/Toast.tsx
import { CheckCircle, XCircle, X } from "lucide-react";

type Props = {
  message: string;
  type: "success" | "error";
};

export default function Toast({ message, type }: Props) {
  const styles = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-500",
      text: "text-emerald-800",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-500",
      text: "text-red-800",
    },
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-xl shadow-lg border
        animate-slide-down
        ${styles[type].bg} ${styles[type].border}
        pointer-events-auto
      `}
    >
      <span className={styles[type].icon}>{icons[type]}</span>
      <p className={`flex-1 text-sm font-medium ${styles[type].text}`}>
        {message}
      </p>
    </div>
  );
}