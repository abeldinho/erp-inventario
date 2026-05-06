// shared/hooks/useToast.ts

import { useToastContext } from "../context/ToastContext";

export function useToast() {
  const { addToast } = useToastContext();

  const showSuccess = (msg: string) => addToast(msg, "success");
  const showError = (msg: string) => addToast(msg, "error");

  return { showSuccess, showError };
}