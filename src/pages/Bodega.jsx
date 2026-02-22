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

      {/* 🔵 Glow metálico intenso */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-180px] left-[-180px] w-[520px] h-[520px] bg-blue-600/25 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-180px] right-[-180px] w-[520px] h-[520px] bg-cyan-400/20 blur-[200px] rounded-full" />
      </div>

      <div className="relative space-y-12">

        {/* 🔵 BANNER PREMIUM */}
        <div className="relative overflow-hidden rounded-3xl p-10 border border-blue-400/20 bg-gradient-to-br from-[#0a1626]/80 via-[#0c1d33]/70 to-[#0a1626]/80 backdrop-blur-xl shadow-[0_0_80px_rgba(59,130,246,0.25)]">

          <div className="absolute -top-28 -right-28 w-80 h-80 bg-blue-500/20 rounded-full blur-[180px] pointer-events-none" />

          <div className="flex items-center gap-3 mb-5">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse shadow-[0_0_14px_rgba(59,130,246,0.9)]" />
            <p className="text-xs uppercase tracking-[0.35em] text-blue-300/70">
              Gestión de Inventario
            </p>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
            BODEGA
          </h1>

          <p className="mt-6 text-zinc-400 max-w-3xl">
            Visualización y análisis estructurado del inventario de{" "}
            <span className="font-semibold text-zinc-200">
              {empresa?.nombre_empresa}
            </span>.
          </p>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        </div>

        {/* 🔵 RESUMEN */}
        <div className="bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 border border-blue-400/15 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(59,130,246,0.35)]">
          <BodegaResumenCards
            loading={isLoading}
            resumen={resumenGlobal}
          />
        </div>

        {/* 🔵 TABLA */}
        <div className="bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 border border-blue-400/15 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(59,130,246,0.35)]">
          <BodegaTabla
            productos={productos}
            loading={isLoading}
          />
        </div>

      </div>
    </div>
  );
}