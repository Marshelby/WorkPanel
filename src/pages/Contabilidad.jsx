import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useWork } from "../context/WorkContext";
import useContabilidad from "../hooks/useContabilidad";

import ContabilidadFilters from "../components/contabilidad/ContabilidadFilters";
import TablaMovimientos from "../components/contabilidad/TablaMovimientos";
import ResumenTotales from "../components/contabilidad/ResumenTotales";
import ResumenPorProducto from "../components/contabilidad/ResumenPorProducto";
import TopProductosBox from "../components/contabilidad/TopProductosBox";

export default function Contabilidad() {
  const { empresa, loading: loadingEmpresa } = useWork();

  const [fecha, setFecha] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [modo, setModo] = useState("dia");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");

  const empresaId = empresa?.id;
  const { inicio, fin } =
    modo === "dia"
      ? getRangoDiaISO(fecha)
      : getRangoMesISO(fecha);

  const {
    movimientos,
    totales,
    loading,
  } = useContabilidad(empresaId, {
    fechaInicio: inicio,
    fechaFin: fin,
  });

  function getRangoDiaISO(dateStr) {
    const [y, m, d] = dateStr.split("-");
    const inicio = new Date(y, m - 1, d, 0, 0, 0, 0);
    const fin = new Date(y, m - 1, d, 23, 59, 59, 999);
    return { inicio: inicio.toISOString(), fin: fin.toISOString() };
  }

  function getRangoMesISO(dateStr) {
    const [y, m] = dateStr.split("-");
    const year = Number(y);
    const month = Number(m) - 1;
    const inicio = new Date(year, month, 1, 0, 0, 0, 0);
    const fin = new Date(year, month + 1, 0, 23, 59, 59, 999);
    return { inicio: inicio.toISOString(), fin: fin.toISOString() };
  }

  const movimientosFiltrados = useMemo(() => {
    if (categoriaFiltro === "todas") return movimientos;
    return movimientos.filter(
      (m) => m.categoria === categoriaFiltro
    );
  }, [movimientos, categoriaFiltro]);

  const totalVentas = totales.totalVentas;
  const totalCompras = totales.totalCompras;
  const utilidad = totales.utilidadNeta;

  const resumenCategorias = useMemo(() => {
    const acc = {};
    movimientosFiltrados.forEach((m) => {
      const cat = m.categoria || "Sin categoría";
      if (!acc[cat]) {
        acc[cat] = { categoria: cat, ventas: 0, compras: 0 };
      }
      acc[cat].ventas += Number(m.total_venta || 0);
      acc[cat].compras += Number(m.total_compra || 0);
    });
    return Object.values(acc).sort((a, b) => b.ventas - a.ventas);
  }, [movimientosFiltrados]);

  const topProductos = useMemo(() => {
    const acc = {};
    movimientos.forEach((m) => {
      const nombre = m.producto || "Sin nombre";
      if (!acc[nombre]) acc[nombre] = { nombre, total: 0 };
      acc[nombre].total += Number(m.total_venta || 0);
    });
    return Object.values(acc)
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  }, [movimientos]);

  const categoriasDisponibles = useMemo(() => {
    const set = new Set();
    movimientos.forEach(
      (m) => m.categoria && set.add(m.categoria)
    );
    return Array.from(set).sort();
  }, [movimientos]);

  if (loadingEmpresa) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-zinc-400">
        Cargando empresa…
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

      <div className="relative space-y-10">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-3xl p-10 border border-blue-400/20 bg-gradient-to-br from-[#0a1626]/85 via-[#0c1d33]/75 to-[#0a1626]/85 backdrop-blur-xl shadow-[0_0_80px_rgba(59,130,246,0.25)]">

          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 blur-[180px] rounded-full" />

          <div className="flex items-center justify-between">

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
                <p className="text-xs uppercase tracking-[0.35em] text-blue-300/70">
                  Control Financiero
                </p>
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                CONTABILIDAD
              </h1>

              <p className="mt-4 text-zinc-400 max-w-2xl">
                Resumen financiero estructurado del inventario y rendimiento operativo.
              </p>
            </div>

            <div className="text-xs px-4 py-2 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 backdrop-blur shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              Modo profesional
            </div>

          </div>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        </div>

        {/* FILTROS */}
        <div className="bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 border border-blue-400/15 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
          <ContabilidadFilters
            fecha={fecha}
            setFecha={setFecha}
            modo={modo}
            setModo={setModo}
            categoriaFiltro={categoriaFiltro}
            setCategoriaFiltro={setCategoriaFiltro}
            categoriasDisponibles={categoriasDisponibles}
          />
        </div>

        {/* TOTALES + TOP */}
        <div className="grid grid-cols-12 gap-8 items-stretch">

          <div className="col-span-12 xl:col-span-8 bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 border border-blue-400/15 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_60px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(59,130,246,0.35)]">
            <ResumenTotales
              totalVentas={totalVentas}
              totalCompras={totalCompras}
              utilidad={utilidad}
              loading={loading}
            />
          </div>

          {categoriaFiltro === "todas" && (
            <div className="col-span-12 xl:col-span-4 bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 border border-blue-400/15 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_60px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(59,130,246,0.35)]">
              <TopProductosBox
                topProductos={topProductos}
                modo={modo}
                loading={loading}
              />
            </div>
          )}
        </div>

        {/* TABLA */}
        <div className="bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 border border-blue-400/15 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_60px_rgba(59,130,246,0.15)]">
          <TablaMovimientos
            movimientos={movimientosFiltrados}
            loading={loading}
          />
        </div>

        {/* RESUMEN POR CATEGORÍA */}
        {categoriaFiltro === "todas" && (
          <div className="bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 border border-blue-400/15 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_60px_rgba(59,130,246,0.15)]">
            <ResumenPorProducto
              resumen={resumenCategorias}
              loading={loading}
            />
          </div>
        )}

      </div>
    </div>
  );
}