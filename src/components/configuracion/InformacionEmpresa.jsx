import { useState } from "react";
import { useWork } from "../../context/WorkContext";

export default function InformacionEmpresa() {
  const { empresa } = useWork();
  const [editando, setEditando] = useState(false);

  if (!empresa) return null;

  return (
    <div className="relative bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 
                    border border-blue-400/15 backdrop-blur-xl 
                    rounded-2xl p-10 space-y-10 
                    shadow-[0_0_60px_rgba(59,130,246,0.15)]
                    transition-all duration-300 hover:shadow-[0_0_80px_rgba(59,130,246,0.25)]">

      {/* Glow interno sutil */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex justify-between items-center relative">

        <h3 className="text-2xl font-bold tracking-tight 
                       bg-gradient-to-r from-blue-300 to-cyan-400 
                       bg-clip-text text-transparent">
          Información de la empresa
        </h3>

        <button
          onClick={() => setEditando(!editando)}
          className="text-xs px-5 py-2 rounded-full 
                     bg-blue-500/15 text-blue-300
                     border border-blue-500/30
                     hover:bg-blue-500/25 
                     hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]
                     transition-all duration-200 backdrop-blur"
        >
          {editando ? "Cancelar" : "Editar"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm relative">

        <Info label="Nombre empresa" value={empresa.nombre_empresa} />
        <Info label="Dirección" value={empresa.direccion} />
        <Info label="Teléfono" value={empresa.telefono} />
        <Info label="WhatsApp" value={empresa.whatsapp} />
        <Info label="Email" value={empresa.email} />
        <Info
          label="IVA"
          value={`${empresa.porcentaje_iva}% ${
            empresa.precios_incluyen_iva
              ? "(Incluido en precios)"
              : "(No incluido)"
          }`}
        />

      </div>

    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="space-y-2 p-4 rounded-xl 
                    bg-white/5 border border-white/5
                    hover:border-blue-400/20 
                    hover:bg-white/10
                    transition-all duration-300">

      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </p>

      <p className="text-zinc-200 font-semibold text-base tracking-tight">
        {value || "-"}
      </p>
    </div>
  );
}