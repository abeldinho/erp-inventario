import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./shared/context/ToastContext";
import ToastContainer from "./shared/components/ui/toast/ToastContainer";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRouter />
        <ToastContainer />
      </ToastProvider>
    </BrowserRouter>
  );
}