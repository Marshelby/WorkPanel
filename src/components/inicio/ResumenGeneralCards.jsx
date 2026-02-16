import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ResumenGeneralCards({ barberiaId }) {
  const [resumenDia, setResumenDia] = useState({
    total_cortes: 0,
    total_ingresos: 0,
  });
  const [ingresosMes, setIngresosMes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (barberiaId) cargarResumen();
  }, [barberiaId]);

  async function cargarResumen() {
    setLoading(true);

    const { data: diaBarberos } = await supabase
      .from("v_calculo_dia_barbero")
      .select("*")
      .eq("barberia_id", barberiaId);

    const { data: mesGlobal } = await supabase
      .from("v_calculo_mes_global")
      .select("*")
      .eq("barberia_id", barberiaId)
      .maybeSingle();

    const totalCortesDia =
      diaBarberos?.reduce(
        (acc, d) => acc + Number(d.total_cortes),
        0
      ) || 0;

    const totalIngresoDia =
      diaBarberos?.reduce(
        (acc, d) => acc + Number(d.total_precio),
        0
      ) || 0;

    setResumenDia({
      total_cortes: totalCortesDia,
      total_ingresos: totalIngresoDia,
    });

    setIngresosMes(Number(mesGlobal?.total_precio || 0));
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4">

      <ResumenCard
        titulo="Cortes hoy"
        valor={loading ? "..." : resumenDia.total_cortes}
        color="emerald"
      />

      <ResumenCard
        titulo="Ingresos hoy"
        valor={
          loading
            ? "..."
            : `$${resumenDia.total_ingresos.toLocaleString()}`
        }
        color="emerald"
      />

      <ResumenCard
        titulo="Ingresos mes"
        valor={
          loading
            ? "..."
            : `$${ingresosMes.toLocaleString()}`
        }
        color="cyan"
      />

    </div>
  );
}

/* ================================================= */

function ResumenCard({ titulo, valor, color = "emerald" }) {
  const valueColor =
    color === "cyan"
      ? "text-cyan-400"
      : "text-emerald-400";

  const hoverGlow =
    color === "cyan"
      ? "hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
      : "hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]";

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-5
        border border-white/10
        bg-gradient-to-br from-zinc-900 to-zinc-800
        shadow-xl
        transition-all duration-300 ease-out
        hover:bg-white/10
        ${hoverGlow}
      `}
    >
      <p className="text-[11px] text-zinc-400 uppercase tracking-[0.2em] mb-2">
        {titulo}
      </p>

      <p className={`text-3xl font-black tracking-tight ${valueColor}`}>
        {valor}
      </p>
    </div>
  );
}

