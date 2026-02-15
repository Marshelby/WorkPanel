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
  barberoFiltro,
  setBarberoFiltro,
  barberosDisponibles = [],
}) {

  /* ================================
     FECHA LOCAL (SIN BUG UTC)
  ================================= */

  const [yy, mm, dd] = fecha.split("-").map(Number);
  const date = new Date(yy, mm - 1, dd);

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const diasMes = new Date(year, month + 1, 0).getDate();

  const containerRef = useRef(null);
  const selectedRef = useRef(null);

  const [animando, setAnimando] = useState(false);

  /* ================================
     AUTO SCROLL
  ================================= */

  useEffect(() => {
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
  }, [fecha]);

  /* ================================
     TEXTO LARGO
  ================================= */

  const textoLargo = useMemo(() => {
    const d = new Date(yy, mm - 1, dd);
    return `${DIAS_LARGO[d.getDay()]} ${d.getDate()} de ${
      MESES[d.getMonth()]
    } ${d.getFullYear()}`;
  }, [fecha]);

  /* ================================
     CAMBIAR MES
  ================================= */

  const cambiarMes = (dir) => {
    const nueva = new Date(year, month + dir, 1);
    setFecha(nueva.toISOString().split("T")[0]);
  };

  /* ================================
     SELECCIONAR DÍA
     🔥 SI ESTABA EN MES → CAMBIA A DÍA
  ================================= */

  const seleccionarDia = (d) => {
    const nueva = new Date(year, month, d);
    setFecha(nueva.toISOString().split("T")[0]);

    if (modo === "mes") {
      setAnimando(true);
      setModo("dia");

      setTimeout(() => {
        setAnimando(false);
      }, 300);
    }
  };

  /* ================================
     CAMBIO MANUAL DE MODO
  ================================= */

  const cambiarModo = (nuevoModo) => {
    if (modo === nuevoModo) return;

    setAnimando(true);
    setModo(nuevoModo);

    setTimeout(() => {
      setAnimando(false);
    }, 300);
  };

  /* ================================
     RENDER
  ================================= */

  return (
    <div className="bg-white border border-black rounded-2xl p-6 shadow-sm">

      {/* TITULO */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          Contabilidad del
        </p>

        <h2 className="text-2xl font-semibold mt-1">
          {textoLargo}
        </h2>
      </div>

      {/* MES */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => cambiarMes(-1)}
          className="px-3 py-1 border rounded-md bg-zinc-100 hover:bg-zinc-200"
        >
          ←
        </button>

        <h3 className="font-medium tracking-wide">
          {MESES[month]} {year}
        </h3>

        <button
          onClick={() => cambiarMes(1)}
          className="px-3 py-1 border rounded-md bg-zinc-100 hover:bg-zinc-200"
        >
          →
        </button>
      </div>

      {/* DÍAS */}
      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {Array.from({ length: diasMes }, (_, i) => {
          const d = i + 1;
          const activo = d === day;

          return (
            <button
              key={d}
              ref={activo ? selectedRef : null}
              onClick={() => seleccionarDia(d)}
              className={`min-w-[56px] rounded-lg border text-xs py-2 px-1 flex flex-col items-center transition-all duration-200
                ${
                  activo
                    ? "bg-black text-white border-black scale-105 shadow-md"
                    : "bg-zinc-100 border-zinc-300 hover:bg-zinc-200 hover:scale-105"
                }
              `}
            >
              <span>{DIAS_CORTO[new Date(year, month, d).getDay()]}</span>
              <span className="text-sm font-semibold">{d}</span>
            </button>
          );
        })}
      </div>

      {/* CONTROLES */}
      <div className="flex items-center gap-6 mt-6">

        {/* Selector Día / Mes */}
        <div
          className={`flex border rounded-lg overflow-hidden shadow-sm transition-all duration-300 ${
            animando ? "scale-105" : ""
          }`}
        >
          <button
            onClick={() => cambiarModo("dia")}
            className={`px-4 py-2 text-sm font-semibold transition ${
              modo === "dia"
                ? "bg-black text-white"
                : "bg-zinc-100 hover:bg-zinc-200"
            }`}
          >
            Ganancias del día
          </button>

          <button
            onClick={() => cambiarModo("mes")}
            className={`px-4 py-2 text-sm font-semibold transition ${
              modo === "mes"
                ? "bg-black text-white"
                : "bg-zinc-100 hover:bg-zinc-200"
            }`}
          >
            Ganancias del mes
          </button>
        </div>

        {/* Selector Barbero */}
        <div>
          <select
            value={barberoFiltro}
            onChange={(e) => setBarberoFiltro(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-zinc-100 text-sm"
          >
            <option value="todos">Todos los barberos</option>
            {barberosDisponibles.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-zinc-500">
          {modo === "dia"
            ? "Mostrando ingresos del día seleccionado"
            : "Mostrando ingresos acumulados del mes completo"}
        </p>
      </div>
    </div>
  );
}
