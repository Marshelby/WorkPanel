import React from "react";

export default function ResumenTotales({
  totalIngresos = 0,
  totalBarberos = 0,
  totalLocal = 0,
  loading = false,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <Stat
        label="Total ingresos"
        value={totalIngresos}
        accent="emerald"
        loading={loading}
      />

      <Stat
        label="Total barberos"
        value={totalBarberos}
        accent="blue"
        loading={loading}
      />

      <Stat
        label="Total local"
        value={totalLocal}
        accent="zinc"
        loading={loading}
      />

    </div>
  );
}

/* ========================= */

function Stat({ label, value, accent = "zinc", loading }) {

  const colorMap = {
    emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-200",
    blue: "from-blue-500/10 to-blue-500/5 border-blue-200",
    zinc: "from-zinc-500/10 to-zinc-500/5 border-zinc-200",
  };

  return (
    <div
      className={`
        relative
        bg-white
        rounded-2xl
        border
        ${colorMap[accent]}
        shadow-sm
        p-6
        transition-all
        duration-300
        hover:shadow-md
        hover:-translate-y-0.5
      `}
    >
      {/* Línea lateral sutil */}
      <div
        className={`
          absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl
          ${
            accent === "emerald"
              ? "bg-emerald-500"
              : accent === "blue"
              ? "bg-blue-500"
              : "bg-zinc-400"
          }
        `}
      />

      {/* Label */}
      <p className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </p>

      {/* Valor */}
      <div className="mt-3 flex items-end justify-between">
        <p className="text-3xl font-semibold tracking-tight text-zinc-900">
          {loading
            ? "—"
            : typeof value === "number"
            ? `$${value.toLocaleString()}`
            : value}
        </p>

        {/* Indicador decorativo sutil */}
        <div
          className={`
            text-xs font-medium px-2 py-1 rounded-full
            ${
              accent === "emerald"
                ? "bg-emerald-100 text-emerald-600"
                : accent === "blue"
                ? "bg-blue-100 text-blue-600"
                : "bg-zinc-100 text-zinc-600"
            }
          `}
        >
          {loading ? "..." : "Actual"}
        </div>
      </div>

      {/* Gradiente sutil de fondo */}
      <div
        className={`
          absolute inset-0 rounded-2xl pointer-events-none
          bg-gradient-to-br ${colorMap[accent]}
          opacity-30
        `}
      />
    </div>
  );
}
