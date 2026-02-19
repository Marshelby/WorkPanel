import React from "react";
import { useWork } from "../context/WorkContext";

import ConfiguracionHeader from "../components/configuracion/ConfiguracionHeader";
import InformacionEmpresa from "../components/configuracion/InformacionEmpresa";

export default function Configuracion() {
  const { empresa, loading } = useWork();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-zinc-400">
        Cargando configuración...
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        No se encontró empresa asociada al usuario.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#0f1720] to-[#0c1117] text-zinc-100 p-6">

      {/* Glow decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-cyan-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative space-y-10">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Configuración
            </h1>
            <p className="text-sm text-zinc-400">
              Gestión estructural del negocio y parámetros del sistema
            </p>
          </div>

          <div className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 backdrop-blur">
            Modo profesional
          </div>
        </div>

        {/* HEADER EMPRESA */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
          <ConfiguracionHeader
            nombreEmpresa={empresa?.nombre_empresa}
            plan={empresa?.plan}
            estadoPlan={empresa?.estado_plan}
            fechaPago={empresa?.fecha_pago}
          />
        </div>

        {/* CONTENIDO */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <InformacionEmpresa empresaId={empresa.id} />
          </div>

        </div>

      </div>
    </div>
  );
}
