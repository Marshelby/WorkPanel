import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function BarberosHoyCard({ barberiaId }) {
  const [presentes, setPresentes] = useState([]);
  const [ausentes, setAusentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (barberiaId) cargarBarberos();
  }, [barberiaId]);

  async function cargarBarberos() {
    setLoading(true);

    const { data: barberos } = await supabase
      .from("v_barberos")
      .select("*")
      .eq("barberia_id", barberiaId);

    const { data: disponibilidad } = await supabase
      .from("v_inicio_disponibilidad")
      .select("*")
      .eq("barberia_id", barberiaId);

    const { data: cortesDia } = await supabase
      .from("v_calculo_dia_barbero")
      .select("*")
      .eq("barberia_id", barberiaId);

    const final = (barberos || []).map((b) => {
      const estadoRow = disponibilidad?.find(
        (d) => d.barbero_id === b.id
      );

      const corteRow = cortesDia?.find(
        (c) => c.barbero_id === b.id
      );

      return {
        id: b.id,
        nombre: b.nombre,
        estado: estadoRow?.estado_barbero || "PRESENTE",
        cortes: corteRow?.total_cortes || 0,
        ingreso: Number(corteRow?.total_precio || 0),
      };
    });

    setPresentes(
      final.filter(
        (b) => b.estado === "PRESENTE" || b.estado === "COLACION"
      )
    );

    setAusentes(
      final.filter(
        (b) =>
          b.estado === "AUSENTE" ||
          b.estado === "NO_DISPONIBLE"
      )
    );

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl p-6 border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-2xl">
        <p className="text-zinc-400 text-sm">Cargando barberos...</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-2xl">

      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-emerald-500 pointer-events-none" />

      <div className="flex items-center gap-4 mb-6">
        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
          Barberos hoy
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* PRESENTES */}
        <div>
          <h3 className="text-xs font-semibold mb-4 text-emerald-400 uppercase tracking-wide">
            Presentes
          </h3>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {presentes.length === 0 && (
              <p className="text-zinc-500 text-sm">
                Sin barberos presentes
              </p>
            )}

            {presentes.map((b) => (
              <BarberoItem key={b.id} barbero={b} tipo="presente" />
            ))}
          </div>
        </div>

        {/* AUSENTES */}
        <div>
          <h3 className="text-xs font-semibold mb-4 text-red-400 uppercase tracking-wide">
            Ausentes
          </h3>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {ausentes.length === 0 && (
              <p className="text-zinc-500 text-sm">
                Sin ausentes
              </p>
            )}

            {ausentes.map((b) => (
              <BarberoItem key={b.id} barbero={b} tipo="ausente" />
            ))}
          </div>
        </div>

      </div>

      <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

/* ========================================== */

function BarberoItem({ barbero, tipo }) {

  const isPresente = tipo === "presente";

  const hoverEffect = isPresente
    ? "hover:border-emerald-400/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]"
    : "hover:border-red-400/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.35)]";

  const badgeColors = {
    PRESENTE: "bg-emerald-500/20 text-emerald-400",
    COLACION: "bg-yellow-500/20 text-yellow-400",
    AUSENTE: "bg-red-500/20 text-red-400",
    NO_DISPONIBLE: "bg-zinc-600/30 text-zinc-300",
  };

  const tieneIngreso = barbero.ingreso > 0;

  return (
    <div
      className={`
        rounded-xl border border-white/10 px-4 py-3
        backdrop-blur-sm bg-white/5
        transition-all duration-300 ease-out
        hover:bg-white/10
        ${hoverEffect}
      `}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-base text-white tracking-tight">
            {barbero.nombre}
          </p>

          <p className="text-sm text-zinc-300 font-semibold">
            {barbero.cortes} cortes
          </p>
        </div>

        <span
          className={`text-[10px] font-semibold px-3 py-1 rounded-full ${
            badgeColors[barbero.estado] ||
            "bg-zinc-700 text-zinc-300"
          }`}
        >
          {barbero.estado.replace("_", " ")}
        </span>
      </div>

      <div className="mt-3 flex justify-between items-end">
        <p className="text-[10px] text-zinc-500 uppercase tracking-wide">
          Ingreso
        </p>

        <p
          className={`text-lg font-extrabold tracking-tight transition-all duration-300 ${
            tieneIngreso
              ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]"
              : "text-white"
          }`}
        >
          ${barbero.ingreso.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
