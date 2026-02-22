import React from "react";
import { useWork } from "../context/WorkContext";
import { useBodega } from "../hooks/useBodega";

import IngresarProductoBodega from "../components/editar/IngresarProductoBodega";
import HistorialBodega from "../components/editar/HistorialBodega";

export default function EditarBodega() {
  const { empresa, loading } = useWork();

  const {
    productos,
    historial,
    loading: loadingBodega,
    error,
    crearProductoIngreso,
    ajustarStock,
  } = useBodega(empresa?.id);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-zinc-400">
        Cargando bodega...
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

      {/* 🔵 Glow metálico fuerte */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-180px] left-[-180px] w-[520px] h-[520px] bg-blue-600/25 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-180px] right-[-180px] w-[520px] h-[520px] bg-cyan-400/20 blur-[200px] rounded-full" />
      </div>

      <div className="relative space-y-12">

        {/* 🔵 BANNER PREMIUM */}
        <div className="relative overflow-hidden rounded-3xl p-10 border border-blue-400/20 bg-gradient-to-br from-[#0a1626]/85 via-[#0c1d33]/75 to-[#0a1626]/85 backdrop-blur-xl shadow-[0_0_80px_rgba(59,130,246,0.25)]">

          <div className="absolute -top-28 -right-28 w-80 h-80 bg-blue-500/20 rounded-full blur-[180px]" />

          <div className="flex items-center gap-3 mb-5">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse shadow-[0_0_14px_rgba(59,130,246,0.9)]" />
            <p className="text-xs uppercase tracking-[0.35em] text-blue-300/70">
              Gestión de Inventario
            </p>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
            PANEL DE BODEGA
          </h1>

          <p className="mt-6 text-zinc-400 max-w-3xl">
            Administración de ingresos y control estructurado del inventario de{" "}
            <span className="font-semibold text-zinc-200">
              {empresa?.nombre_empresa}
            </span>.
          </p>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl text-sm backdrop-blur">
            {error}
          </div>
        )}

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">

          {/* INGRESAR PRODUCTO */}
          <div className="xl:col-span-2 bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 border border-blue-400/15 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(59,130,246,0.35)]">

            <IngresarProductoBodega
              crearProductoIngreso={crearProductoIngreso}
            />

          </div>

          {/* HISTORIAL */}
          <div className="xl:col-span-3 bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 border border-blue-400/15 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(59,130,246,0.35)]">

            <HistorialBodega
              registros={historial}
              loading={loadingBodega}
            />

          </div>

        </div>

      </div>
    </div>
  );
}