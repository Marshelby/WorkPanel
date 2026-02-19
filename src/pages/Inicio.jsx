import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useWork } from "../context/WorkContext";

import EstadoEmpresaCard from "../components/inicio/EstadoEmpresaCard";
import MovimientoHoyCard from "../components/inicio/MovimientoHoyCard";
import ResumenGeneralWork from "../components/inicio/ResumenGeneralWork";

export default function InicioWork() {
  const { empresa } = useWork();
  const empresaId = empresa?.id;

  const [estadoEmpresa, setEstadoEmpresa] = useState(null);
  const [resumenDia, setResumenDia] = useState({
    total_ventas: 0,
    total_ingresos: 0,
  });
  const [ingresosMes, setIngresosMes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId) cargarDatos();
  }, [empresaId]);

  async function cargarDatos() {
    setLoading(true);

    // 🔹 Solo placeholders visuales
    // aquí luego conectas tus views reales

    setEstadoEmpresa({
      mensaje: "Sistema operativo",
      estado: "ACTIVO",
    });

    setResumenDia({
      total_ventas: 0,
      total_ingresos: 0,
    });

    setIngresosMes(0);

    setLoading(false);
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#0f1720] to-[#0c1117] text-zinc-100 p-6">

      {/* Glow decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-blue-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative space-y-10">

        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Panel de Control
          </h1>
          <p className="text-sm text-zinc-500">
            Monitoreo general y estado operativo en tiempo real
          </p>
        </div>

        {/* ESTADO EMPRESA (equivalente EstadoLocalCard) */}
        <EstadoEmpresaCard estadoEmpresa={estadoEmpresa} />

        {/* DISTRIBUCIÓN PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 2/3 IZQUIERDA */}
          <div className="lg:col-span-2">
            <MovimientoHoyCard empresaId={empresaId} />
          </div>

          {/* 1/3 DERECHA */}
          <ResumenGeneralWork
            empresaId={empresaId}
            resumenDia={resumenDia}
            ingresosMes={ingresosMes}
            loading={loading}
          />

        </div>

      </div>
    </div>
  );
}
