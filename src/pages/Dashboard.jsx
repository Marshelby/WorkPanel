import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useBarberia } from "../context/BarberiaContext";

import EstadoLocalCard from "../components/inicio/EstadoLocalCard";
import BarberosHoyCard from "../components/inicio/BarberosHoyCard";
import ResumenGeneralCards from "../components/inicio/ResumenGeneralCards";

export default function Dashboard() {
  const { barberia } = useBarberia();
  const barberiaId = barberia?.id;

  const [estadoLocal, setEstadoLocal] = useState(null);
  const [resumenDia, setResumenDia] = useState({
    total_cortes: 0,
    total_ingresos: 0,
  });
  const [ingresosMes, setIngresosMes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (barberiaId) cargarDatos();
  }, [barberiaId]);

  async function cargarDatos() {
    setLoading(true);

    const { data: localData } = await supabase
      .from("v_inicio_local")
      .select("*")
      .eq("barberia_id", barberiaId)
      .maybeSingle();

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

    setEstadoLocal(localData);
    setResumenDia({
      total_cortes: totalCortesDia,
      total_ingresos: totalIngresoDia,
    });

    setIngresosMes(Number(mesGlobal?.total_precio || 0));
    setLoading(false);
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Panel de Control
        </h1>
        <p className="text-sm text-gray-500">
          Monitoreo en tiempo real
        </p>
      </div>

      {/* ESTADO LOCAL */}
      <EstadoLocalCard estadoLocal={estadoLocal} />

      {/* NUEVA DISTRIBUCIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 2/3 IZQUIERDA → BARBEROS */}
        <div className="lg:col-span-2">
          <BarberosHoyCard barberiaId={barberiaId} />
        </div>

        {/* 1/3 DERECHA → RESÚMENES */}
        <ResumenGeneralCards
          barberiaId={barberiaId}
          resumenDia={resumenDia}
          ingresosMes={ingresosMes}
          loading={loading}
        />

      </div>

    </div>
  );
}
