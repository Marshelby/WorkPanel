import React, { useEffect, useMemo, useRef, useState } from "react";

/* =====================================
   CONFIG
===================================== */

const DIAS_CORTO = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
const DIAS_LARGO = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

/* =====================================
   COMPONENTE
===================================== */

export default function ContabilidadFilters({
  fecha,
  setFecha,
  modo,
  setModo,
  categoriaFiltro,
  setCategoriaFiltro,
  categoriasDisponibles = [],
}) {

  const [yy, mm, dd] = fecha.split("-").map(Number);
  const date = new Date(yy, mm - 1, dd);

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const diasMes = new Date(year, month + 1, 0).getDate();

  const containerRef = useRef(null);
  const selectedRef = useRef(null);

  const [animando, setAnimando] = useState(false);

  /* =====================================
     SCROLL AUTO AL DIA ACTIVO
  ===================================== */

  useEffect(() => {
    if (modo !== "dia") return;

    if (selectedRef.current && containerRef.current) {
      const container = containerRef.current;
      const selected = selectedRef.current;

      const offset =
        selected.offsetLeft -
        container.offsetWidth / 2 +
        selected.offsetWidth / 2;

      container.scrollTo({
        left: offset,
        behavior: "smooth",
      });
    }
  }, [fecha, modo]);

  /* =====================================
     TEXTO DINÁMICO
  ===================================== */

  const textoHeader = useMemo(() => {

    if (modo === "mes") {
      return `${MESES[month]} ${year}`;
    }

    const d = new Date(yy, mm - 1, dd);
    return `${DIAS_LARGO[d.getDay()]} ${d.getDate()} de ${
      MESES[d.getMonth()]
    } ${d.getFullYear()}`;

  }, [fecha, modo]);

  /* =====================================
     ACCIONES
  ===================================== */

  const cambiarMes = (dir) => {
    const nueva = new Date(year, month + dir, 1);
    setFecha(nueva.toISOString().split("T")[0]);
  };

  const seleccionarDia = (d) => {
    const nueva = new Date(year, month, d);
    setFecha(nueva.toISOString().split("T")[0]);

    if (modo === "mes") {
      setAnimando(true);
      setModo("dia");
      setTimeout(() => setAnimando(false), 250);
    }
  };

  const cambiarModo = (nuevoModo) => {
    if (modo === nuevoModo) return;

    setAnimando(true);
    setModo(nuevoModo);
    setTimeout(() => setAnimando(false), 250);
  };

  /* =====================================
     UI
  ===================================== */

  return (
    <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">

      {/* TITULO */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-zinc-400">
          Contabilidad
        </p>

        <h2 className="text-2xl font-semibold mt-1 text-white">
          {textoHeader}
        </h2>
      </div>

      {/* MES */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => cambiarMes(-1)}
          className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200 transition"
        >
          ←
        </button>

        <h3 className="font-medium tracking-wide text-zinc-200">
          {MESES[month]} {year}
        </h3>

        <button
          onClick={() => cambiarMes(1)}
          className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200 transition"
        >
          →
        </button>
      </div>

      {/* DÍAS */}
      {modo === "dia" && (
        <div
          ref={containerRef}
          className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/10"
        >
          {Array.from({ length: diasMes }, (_, i) => {
            const d = i + 1;
            const activo = d === day;

            return (
              <button
                key={d}
                ref={activo ? selectedRef : null}
                onClick={() => seleccionarDia(d)}
                className={`min-w-[58px] rounded-xl border text-xs py-2 px-2 flex flex-col items-center transition-all duration-200
                  ${
                    activo
                      ? "bg-emerald-500 text-black border-emerald-400 scale-105 shadow-lg"
                      : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:scale-105"
                  }
                `}
              >
                <span className="text-[10px] opacity-70">
                  {DIAS_CORTO[new Date(year, month, d).getDay()]}
                </span>
                <span className="text-sm font-semibold">{d}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* CONTROLES */}
      <div className="flex flex-wrap items-center gap-6 mt-8">

        {/* Selector Día / Mes */}
        <div
          className={`flex rounded-xl overflow-hidden border border-white/10 transition-all duration-300 ${
            animando ? "scale-105" : ""
          }`}
        >
          <button
            onClick={() => cambiarModo("dia")}
            className={`px-5 py-2 text-sm font-semibold transition-all ${
              modo === "dia"
                ? "bg-emerald-500 text-black"
                : "bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
          >
            Día
          </button>

          <button
            onClick={() => cambiarModo("mes")}
            className={`px-5 py-2 text-sm font-semibold transition-all ${
              modo === "mes"
                ? "bg-emerald-500 text-black"
                : "bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
          >
            Mes
          </button>
        </div>

        {/* Selector Categoría */}
        <div>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <option value="todas">Todas las categorías</option>
            {categoriasDisponibles.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-zinc-400">
          {modo === "dia"
            ? "Mostrando movimientos del día seleccionado"
            : "Mostrando acumulado del mes completo"}
        </p>

      </div>
    </div>
  );
}
