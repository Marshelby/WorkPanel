import React from "react";

export default function ResumenTotales({
  totalVentas = 0,
  totalCompras = 0,
  utilidad = 0,
  loading = false,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <Stat
        label="Total ventas"
        value={totalVentas}
        accent="emerald"
        loading={loading}
      />

      <Stat
        label="Total compras"
        value={totalCompras}
        accent="blue"
        loading={loading}
      />

      <Stat
        label="Utilidad neta"
        value={utilidad}
        accent={utilidad >= 0 ? "emerald" : "red"}
        loading={loading}
      />

    </div>
  );
}

/* ========================= */

function Stat({ label, value, accent = "zinc", loading }) {

  const colorMap = {
    emerald: {
      glow: "shadow-emerald-500/10",
      border: "border-emerald-500/30",
      line: "bg-emerald-400",
      badge: "bg-emerald-500/15 text-emerald-400",
      value: "text-emerald-400",
    },
    blue: {
      glow: "shadow-blue-500/10",
      border: "border-blue-500/30",
      line: "bg-blue-400",
      badge: "bg-blue-500/15 text-blue-400",
      value: "text-blue-400",
    },
    red: {
      glow: "shadow-red-500/10",
      border: "border-red-500/30",
      line: "bg-red-400",
      badge: "bg-red-500/15 text-red-400",
      value: "text-red-400",
    },
    zinc: {
      glow: "shadow-zinc-500/10",
      border: "border-white/10",
      line: "bg-zinc-400",
      badge: "bg-white/10 text-zinc-300",
      value: "text-white",
    },
  };

  const colors = colorMap[accent] || colorMap.zinc;

  const valorFormateado =
    typeof value === "number"
      ? `$${value.toLocaleString("es-CL")}`
      : value;

  return (
    <div
      className={`
        relative
        bg-gradient-to-br from-zinc-900/90 to-zinc-800/70
        rounded-2xl
        border ${colors.border}
        backdrop-blur-xl
        shadow-xl ${colors.glow}
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
      `}
    >
      {/* Línea lateral */}
      <div
        className={`
          absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl
          ${colors.line}
        `}
      />

      {/* Label */}
      <p className="text-xs uppercase tracking-widest text-zinc-400">
        {label}
      </p>

      {/* Valor */}
      <div className="mt-4 flex items-end justify-between">
        <p className={`text-3xl font-semibold tracking-tight ${colors.value}`}>
          {loading ? "—" : valorFormateado}
        </p>

        <div
          className={`
            text-xs font-medium px-3 py-1 rounded-full
            ${colors.badge}
          `}
        >
          {loading ? "..." : "Actual"}
        </div>
      </div>

      {/* Glow interno */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none bg-white/5 opacity-20" />
    </div>
  );
}
