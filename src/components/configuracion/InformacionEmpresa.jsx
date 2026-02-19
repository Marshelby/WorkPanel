import { useState } from "react";
import { useWork } from "../../context/WorkContext";

export default function InformacionEmpresa() {
  const { empresa } = useWork();
  const [editando, setEditando] = useState(false);

  if (!empresa) return null;

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 space-y-8 shadow-xl">

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold tracking-tight text-zinc-100">
          Información de la empresa
        </h3>

        <button
          onClick={() => setEditando(!editando)}
          className="text-xs px-4 py-2 rounded-full 
                     bg-emerald-500/15 text-emerald-400 
                     border border-emerald-500/30 
                     hover:bg-emerald-500/25 
                     transition-all duration-200 backdrop-blur"
        >
          {editando ? "Cancelar" : "Editar"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">

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
    <div className="space-y-1">
      <p className="text-[11px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="text-zinc-200 font-medium text-base">
        {value || "-"}
      </p>
    </div>
  );
}
