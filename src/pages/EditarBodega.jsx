import React from "react";
import { useWork } from "../context/WorkContext";
import { useBodega } from "../hooks/useBodega";

// Componentes
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
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#0f1720] to-[#0c1117] text-zinc-100 p-6">

      {/* Glow decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-blue-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-cyan-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative space-y-10">

        {/* BANNER */}
        <div className="relative overflow-hidden rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Gestión de Inventario
            </p>
          </div>

          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            PANEL DE BODEGA
          </h1>

          <p className="mt-4 text-zinc-400 max-w-3xl">
            Administración de ingresos y control estructurado del inventario de{" "}
            <span className="font-semibold text-zinc-200">
              {empresa?.nombre_empresa}
            </span>.
          </p>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {error && (
          <div className="text-sm text-red-400">
            {error}
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

          <div className="xl:col-span-2 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <IngresarProductoBodega
              crearProductoIngreso={crearProductoIngreso}
            />
          </div>

          <div className="xl:col-span-3 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
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
