import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useWork } from "../context/WorkContext";

export default function Header() {
  const { empresa } = useWork();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header
      className="
        h-20 px-8
        flex items-center justify-between
        bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950
        border-b border-white/10
        relative
      "
    >
      {/* Glow sutil */}
      <div className="absolute -top-10 left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-10 pointer-events-none" />

      {/* Lado izquierdo */}
      <div className="flex flex-col">
        <h1
          className="
            text-2xl font-black tracking-tight
            text-blue-400
            drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]
          "
        >
          {empresa?.nombre_empresa || "Empresa"}
        </h1>

        <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 mt-1">
          WorkPanel
        </span>
      </div>

      {/* Lado derecho */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center gap-3
            px-4 py-2 rounded-xl
            border border-white/10
            bg-white/5
            hover:bg-white/10
            transition-all duration-300
          "
        >
          <span className="text-sm text-zinc-300">
            Administrador/a
          </span>

          <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            👤
          </div>
        </button>

        {open && (
          <div
            className="
              absolute right-0 mt-3 w-44
              bg-zinc-900 border border-white/10
              rounded-xl shadow-xl
              overflow-hidden z-50
            "
          >
            <button
              onClick={handleLogout}
              className="
                w-full text-left px-4 py-3 text-sm
                text-red-400 hover:bg-white/5
                transition
              "
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
