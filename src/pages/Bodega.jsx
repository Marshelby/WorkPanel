import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useWork } from "../context/WorkContext";

import BodegaResumenCards from "../components/bodega/BodegaResumenCards";
import BodegaTabla from "../components/bodega/BodegaTabla";

export default function Bodega() {
  const { empresa, loading } = useWork();

  const [productos, setProductos] = useState([]);
  const [loadingStock, setLoadingStock] = useState(false);

  /* =========================
     FETCH STOCK
  ========================= */

  useEffect(() => {
    if (!empresa?.id) return;

    const fetchStock = async () => {
      setLoadingStock(true);

      const { data, error } = await supabase
        .from("work_view_stock_actual")
        .select("*")
        .eq("empresa_id", empresa.id)
        .order("categoria_nombre", { ascending: true });

      if (error) {
        console.error("Error cargando stock:", error);
        setProductos([]);
      } else {
        setProductos(data ?? []);
      }

      setLoadingStock(false);
    };

    fetchStock();
  }, [empresa?.id]);

  /* =========================
     MÉTRICAS
  ========================= */

  const resumenGlobal = useMemo(() => {
    if (!productos.length) {
      return {
        totalProductos: 0,
        stockTotal: 0,
        totalCompra: 0,
        totalVenta: 0,
        utilidad: 0,
      };
    }

    return {
      totalProductos: productos.length,
      stockTotal: productos.reduce(
        (acc, p) => acc + Number(p.stock_total || 0),
        0
      ),
      totalCompra: productos.reduce(
        (acc, p) => acc + Number(p.valor_total_compra || 0),
        0
      ),
      totalVenta: productos.reduce(
        (acc, p) => acc + Number(p.valor_total_venta || 0),
        0
      ),
      utilidad: productos.reduce(
        (acc, p) => acc + Number(p.utilidad_proyectada || 0),
        0
      ),
    };
  }, [productos]);

  const isLoading = loading || loadingStock;

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

      {/* 🔥 BANNER (idéntico estilo EditarBodega) */}
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
          BODEGA
        </h1>

        <p className="mt-4 text-zinc-300 max-w-3xl">
          Visualización y análisis estructurado del inventario de{" "}
          <span className="font-semibold text-white">
            {empresa?.nombre_empresa}
          </span>.
        </p>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* RESUMEN CARDS */}
      <div
        className="
          relative rounded-3xl p-6
          border border-white/10
          bg-gradient-to-br from-zinc-900 to-zinc-950
          shadow-xl
        "
      >
        <BodegaResumenCards
          loading={isLoading}
          resumen={resumenGlobal}
        />
      </div>

      {/* TABLA */}
      <div
        className="
          relative rounded-3xl p-6
          border border-white/10
          bg-gradient-to-br from-zinc-900 to-zinc-950
          shadow-xl
        "
      >
        <BodegaTabla
          productos={productos}
          loading={isLoading}
        />
      </div>

    </div>
  );
}
