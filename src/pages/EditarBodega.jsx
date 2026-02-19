import React from "react";
import { useWork } from "../context/WorkContext";
import { useBodega } from "../hooks/useBodega";

// Componentes
import IngresarProductoBodega from "../components/editar/IngresarProductoBodega";
import HistorialBodega from "../components/editar/HistorialBodega";

export default function EditarBodega() {
  const { empresa, loading } = useWork();

  // 🔥 Hook centralizado
  const {
    productos,     // stock actual
    historial,     // historial ingresos
    loading: loadingBodega,
    error,
    crearProductoIngreso,
    ajustarStock,
  } = useBodega(empresa?.id);

  if (loading) {
    return (
      <div className="text-sm text-zinc-500">
        Cargando bodega...
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="text-sm text-red-500">
        No se encontró empresa asociada al usuario.
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* 🔥 BANNER */}
      <div
        className="
          relative overflow-hidden rounded-3xl p-6 md:p-8
          border border-white/10
          bg-gradient-to-br from-zinc-900 to-zinc-800
          shadow-2xl
        "
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none" />

        <div className="flex items-center gap-3 mb-4 relative">
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            Gestión de Inventario
          </p>
        </div>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-blue-400">
          PANEL DE BODEGA
        </h1>

        <p className="mt-4 text-zinc-300 max-w-3xl">
          Administración de ingresos y control estructurado del inventario de{" "}
          <span className="font-semibold text-white">
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

        {/* INGRESAR PRODUCTO */}
        <div className="xl:col-span-2">
          <IngresarProductoBodega
            crearProductoIngreso={crearProductoIngreso}
          />
        </div>

              <div className="xl:col-span-3">
          <HistorialBodega
            registros={historial}               loading={loadingBodega}
          />
        </div>

      </div>
    </div>
  );
}
