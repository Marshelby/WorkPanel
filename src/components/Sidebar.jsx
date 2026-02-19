import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const links = [
  { to: "/app", label: "Inicio", icon: "🏠" },
  { to: "/app/registrar-venta", label: "Registrar venta", icon: "🧾" },
  { to: "/app/bodega", label: "Bodega", icon: "📦" },
  { to: "/app/editar-bodega", label: "Editar bodega", icon: "✏️" },
  { to: "/app/contabilidad", label: "Contabilidad", icon: "💰" },
  { to: "/app/configuracion", label: "Configuración", icon: "⚙️" },
];

export default function Sidebar() {
  const location = useLocation();
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });

  useEffect(() => {
    const active = navRef.current?.querySelector(".active-link");

    if (active) {
      setIndicator({
        top: active.offsetTop,
        height: active.offsetHeight,
      });

      active.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [location.pathname]);

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 flex flex-col border-r border-white/10 relative overflow-hidden">

      {/* Glow decorativo azul */}
      <div className="absolute top-20 -left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-10 pointer-events-none" />

      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-white/10 flex-shrink-0">
        <span className="text-lg font-semibold tracking-tight">
          <span className="text-white">Work</span>
          <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]">
            Panel
          </span>
        </span>
      </div>

      {/* Navegación */}
      <nav
        ref={navRef}
        className="
          relative flex-1 p-4 space-y-2
          overflow-y-auto
          scrollbar-thin
          scrollbar-thumb-blue-500/30
          scrollbar-track-transparent
        "
      >
        {/* Indicador elástico */}
        <span
          className="
            absolute left-0 w-1 rounded-r-full
            bg-gradient-to-b from-blue-400 to-blue-600
            shadow-[0_0_12px_rgba(59,130,246,0.7)]
          "
          style={{
            top: indicator.top,
            height: indicator.height,
            transition:
              "top 600ms cubic-bezier(0.34,1.56,0.64,1), height 400ms ease",
          }}
        />

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/app"}
            className={({ isActive }) =>
              `
              relative flex items-center gap-3 px-4 py-3 rounded-xl
              text-sm font-medium transition-all duration-300 group
              transform
              ${isActive ? "active-link text-white scale-[1.03]" : "text-zinc-400"}
              ${
                isActive
                  ? "bg-gradient-to-r from-blue-600/30 to-blue-500/10 border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  : "hover:text-white hover:bg-white/5 hover:border hover:border-white/10 hover:translate-x-1"
              }
            `
            }
          >
            <span className="absolute inset-0 rounded-xl bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-300 pointer-events-none" />

            <span className="text-lg transition-transform duration-300 group-hover:scale-110">
              {link.icon}
            </span>

            <span className="tracking-wide">
              {link.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 text-xs text-zinc-500">
        WorkPanel v1.0
      </div>
    </aside>
  );
}
