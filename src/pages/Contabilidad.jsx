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


  /* ===============================
     RANGOS FECHA
  =============================== */

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

  /* ===============================
     FETCH MOVIMIENTOS
  =============================== */

  

  /* ===============================
     FILTROS
  =============================== */

  const movimientosFiltrados = useMemo(() => {
    if (categoriaFiltro === "todas") return movimientos;
    return movimientos.filter(
      (m) => m.categoria === categoriaFiltro
    );
  }, [movimientos, categoriaFiltro]);

  /* ===============================
     TOTALES
  =============================== */

  const totalVentas = totales.totalVentas;
const totalCompras = totales.totalCompras;
const utilidad = totales.utilidadNeta;

  /* ===============================
     RESUMEN POR CATEGORÍA
  =============================== */

  const resumenCategorias = useMemo(() => {
    const acc = {};

    movimientosFiltrados.forEach((m) => {
      const cat = m.categoria || "Sin categoría";

      if (!acc[cat]) {
        acc[cat] = {
          categoria: cat,
          ventas: 0,
          compras: 0,
        };
      }

      acc[cat].ventas += Number(m.total_venta || 0);
      acc[cat].compras += Number(m.total_compra || 0);
    });

    return Object.values(acc).sort(
      (a, b) => b.ventas - a.ventas
    );
  }, [movimientosFiltrados]);

  /* ===============================
     TOP PRODUCTOS
  =============================== */

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

  /* ===============================
     LOADING EMPRESA
  =============================== */

  if (loadingEmpresa) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-zinc-400">
        Cargando empresa…
      </div>
    );
  }

  /* ===============================
     UI
  =============================== */

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#0f1720] to-[#0c1117] text-zinc-100 p-6">

      {/* Glow decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-cyan-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Contabilidad
            </h1>
            <p className="text-sm text-zinc-400">
              Resumen financiero estructurado del inventario
            </p>
          </div>

          <div className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 backdrop-blur">
            Modo profesional
          </div>
        </div>

        {/* FILTROS */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
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
        <div className="grid grid-cols-12 gap-6 items-stretch">

          <div className="col-span-12 xl:col-span-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <ResumenTotales
              totalVentas={totalVentas}
              totalCompras={totalCompras}
              utilidad={utilidad}
              loading={loading}
            />
          </div>

          {categoriaFiltro === "todas" && (
            <div className="col-span-12 xl:col-span-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
              <TopProductosBox
                topProductos={topProductos}
                modo={modo}
                loading={loading}
              />
            </div>
          )}
        </div>

        {/* TABLA */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
          <TablaMovimientos
            movimientos={movimientosFiltrados}
            loading={loading}
          />
        </div>

        {/* RESUMEN POR CATEGORÍA */}
        {categoriaFiltro === "todas" && (
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
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
