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
    <div className="relative min-h-screen bg-gradient-to-br from-[#05070d] via-[#07101c] to-[#040812] text-zinc-100 p-8">

      {/* 🔵 Glow azul tecnológico */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-600/25 blur-[220px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-cyan-400/20 blur-[220px] rounded-full" />
      </div>

      <div className="relative space-y-12">

        {/* HEADER PRINCIPAL */}
        <div className="relative overflow-hidden rounded-3xl p-10 border border-blue-400/20 bg-gradient-to-br from-[#0a1626]/85 via-[#0c1d33]/75 to-[#0a1626]/85 backdrop-blur-xl shadow-[0_0_80px_rgba(59,130,246,0.25)]">

          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 blur-[180px] rounded-full" />

          <div className="flex items-center justify-between">

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
                <p className="text-xs uppercase tracking-[0.35em] text-blue-300/70">
                  Configuración del Sistema
                </p>
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                CONFIGURACIÓN
              </h1>

              <p className="mt-4 text-zinc-400 max-w-2xl">
                Gestión estructural del negocio y parámetros operativos del sistema.
              </p>
            </div>

            <div className="text-xs px-4 py-2 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 backdrop-blur shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              Modo profesional
            </div>

          </div>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        </div>

        {/* HEADER EMPRESA */}
        <div className="bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 border border-blue-400/15 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_60px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(59,130,246,0.35)]">
          <ConfiguracionHeader
            nombreEmpresa={empresa?.nombre_empresa}
            plan={empresa?.plan}
            estadoPlan={empresa?.estado_plan}
            fechaPago={empresa?.fecha_pago}
          />
        </div>

        {/* CONTENIDO */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

          <div className="bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 border border-blue-400/15 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_60px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(59,130,246,0.35)]">
            <InformacionEmpresa empresaId={empresa.id} />
          </div>

        </div>

      </div>
    </div>
  );
}