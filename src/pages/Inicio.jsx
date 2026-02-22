import { useEffect, useState } from "react";
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
    <div className="relative min-h-screen bg-gradient-to-br from-[#05070d] via-[#07101c] to-[#040812] text-zinc-100 p-8">

      {/* 🔵 GLOW METÁLICO AZUL INTENSO */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-blue-600/25 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-cyan-400/20 blur-[180px] rounded-full" />
      </div>

      <div className="relative space-y-12">

        {/* HEADER REAL */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(59,130,246,0.7)]">
            Inicio
          </h1>
          <p className="text-sm text-zinc-400">
            Gestión interna, control de inventario y monitoreo financiero.
          </p>
        </div>

        {/* ESTADO */}
        <EstadoEmpresaCard estadoEmpresa={estadoEmpresa} />

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2">
            <MovimientoHoyCard empresaId={empresaId} />
          </div>

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