import React from "react";

export default function TopProductosBox({
  topProductos = [],
  modo = "dia",
  loading = false,
}) {
  const top3 = [...topProductos]
    .map((p) => ({
      nombre: p.nombre || p.producto || "Sin nombre",
      total: Number(p.total ?? p.total_venta ?? 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  if (loading) {
    return (
      <Box>
        <p className="text-sm text-zinc-400">Cargando…</p>
      </Box>
    );
  }

  if (!top3.length) return null;

  return (
    <Box>
      <div className="grid grid-cols-3 items-stretch">

        {/* COLUMNA INFO */}
        <div className="flex flex-col items-center justify-center border-r border-white/10 pr-4 text-center">
          <div className="text-xl">📦</div>
          <p className="text-xs uppercase tracking-widest text-zinc-400 mt-1">
            Ranking
          </p>
          <p className="text-sm font-semibold text-white">
            Productos
          </p>
          <p className="text-xs text-zinc-400">
            {modo === "dia" ? "Del día" : "Del mes"}
          </p>
        </div>

        {/* LISTA */}
        <div className="col-span-2 pl-4 flex flex-col justify-center space-y-4">

          {top3.map((p, i) => (
            <div key={p.nombre + i} className="flex items-center">

              {/* IZQUIERDA */}
              <div className="flex items-center gap-2 text-sm min-w-[170px]">
                <Medal index={i} />
                <span className="text-zinc-300">
                  Top {i + 1}: {p.nombre}
                </span>
              </div>

              {/* LINEA */}
              <div className="flex-1 mx-3 border-b border-dashed border-white/10"></div>

              {/* TOTAL */}
              <div
                className={`
                  text-sm text-right min-w-[110px]
                  ${
                    i === 0
                      ? "font-semibold text-emerald-400"
                      : "text-zinc-400"
                  }
                `}
              >
                ${p.total.toLocaleString("es-CL")}
              </div>

            </div>
          ))}

        </div>

      </div>
    </Box>
  );
}

/* ========================= */

function Medal({ index }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <span className="text-base">
      {medals[index] || "🥉"}
    </span>
  );
}

/* ========================= */

function Box({ children }) {
  return (
    <div
      className="
        bg-gradient-to-br from-zinc-900/90 to-zinc-800/70
        border border-white/10
        rounded-2xl
        backdrop-blur-xl
        shadow-xl
        p-5
        transition-all duration-300
        hover:shadow-2xl
        hover:-translate-y-1
      "
    >
      {children}
    </div>
  );
}
