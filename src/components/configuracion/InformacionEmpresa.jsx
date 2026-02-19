import { useState } from "react";
import { useWork } from "../../context/WorkContext";

export default function InformacionEmpresa() {
  const { empresa } = useWork();
  const [editando, setEditando] = useState(false);

  if (!empresa) return null;

  return (
    <div className="bg-white border border-black rounded-xl p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Información de la empresa
        </h3>

        <button
          onClick={() => setEditando(!editando)}
          className="text-sm px-3 py-1 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 transition"
        >
          {editando ? "Cancelar" : "Editar"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

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
    <div>
      <p className="text-zinc-500 text-xs uppercase tracking-wide">
        {label}
      </p>
      <p className="text-zinc-800 font-medium mt-1">
        {value || "-"}
      </p>
    </div>
  );
}
