import { NavLink } from "react-router-dom";

const links = [
  { to: "/app", label: "Inicio", icon: "🏠" },
  { to: "/app/registrar-venta", label: "Registrar venta", icon: "🧾" },
  { to: "/app/bodega", label: "Bodega", icon: "📦" },
  { to: "/app/editar-bodega", label: "Editar bodega", icon: "✏️" },
  { to: "/app/contabilidad", label: "Contabilidad", icon: "💰" },
  { to: "/app/configuracion", label: "Configuración", icon: "⚙️" },
];

export default function Sidebar() {
  return (
    <aside
      className="
        w-64 h-full
        bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950
        text-zinc-100
        flex flex-col
        border-r border-white/10
        relative
      "
    >
      {/* Glow lateral sutil */}
      <div className="absolute top-20 -left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-10 pointer-events-none" />

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 flex-shrink-0">
        <span className="text-lg font-semibold tracking-tight">
          <span className="text-white">Work</span>
          <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]">
            Panel
          </span>
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/app"}
            className={({ isActive }) =>
              `
              relative flex items-center gap-3 px-4 py-3 rounded-xl
              text-sm font-medium
              transition-all duration-300
              group
              ${
                isActive
                  ? `
                    bg-gradient-to-r from-blue-600/30 to-blue-500/10
                    text-white
                    border border-blue-400/30
                    shadow-[0_0_15px_rgba(59,130,246,0.35)]
                  `
                  : `
                    text-zinc-400
                    hover:text-white
                    hover:bg-white/5
                    hover:border hover:border-white/10
                  `
              }
            `
            }
          >
            {/* Indicador activo lateral */}
            <span
              className={`
                absolute left-0 top-0 h-full w-1 rounded-r-full
                transition-all duration-300
                ${
                  window.location.pathname === link.to
                    ? "bg-blue-400"
                    : "bg-transparent"
                }
              `}
            />

            {/* Icono */}
            <span className="text-lg transition-transform duration-300 group-hover:scale-110">
              {link.icon}
            </span>

            {/* Label */}
            <span className="tracking-wide">
              {link.label}
            </span>
          </NavLink>
        ))}

      </nav>

      {/* Footer pequeño opcional */}
      <div className="p-4 border-t border-white/10 text-xs text-zinc-500">
        Sistema v1.0
      </div>
    </aside>
  );
}
