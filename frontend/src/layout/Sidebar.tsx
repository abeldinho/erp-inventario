// src/layout/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ArrowLeftRight,
  History,
  AlertTriangle,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Productos", path: "/productos", icon: Package },
  { name: "Categorías", path: "/categorias", icon: Tags },
  { name: "Movimientos", path: "/movimientos", icon: ArrowLeftRight },
  { name: "Historial", path: "/historial", icon: History },
  { name: "Alertas de Stock", path: "/alertas", icon: AlertTriangle },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-slate-200
          transform transition-transform duration-200 ease-out
          lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">
              Inventario
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  font-medium transition-all duration-200
                  ${active
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${active ? "text-primary-600" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 text-center">
            v1.0.0 • Inventory Manager
          </p>
        </div>
      </aside>
    </>
  );
}