import React from "react";

export default function TopBarberosBox({
  topBarberos = [],
  modo = "dia",
  loading = false,
}) {
  const top3 = [...topBarberos]
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  if (loading) {
    return (
      <Box>
        <p className="text-sm text-zinc-500">Cargando…</p>
      </Box>
    );
  }

  if (!top3.length) return null;

  return (
    <Box>
      <div className="grid grid-cols-3 items-stretch">

        {/* COLUMNA 1 */}
        <div className="flex flex-col items-center justify-center border-r border-zinc-200 pr-4 text-center">
          <div className="text-xl">🏆</div>
          <p className="text-xs uppercase tracking-wider text-zinc-500 mt-1">
            Ranking
          </p>
          <p className="text-sm font-semibold text-zinc-900">
            Barberos
          </p>
          <p className="text-xs text-zinc-500">
            Del {modo}
          </p>
        </div>

        {/* COLUMNA 2 + 3 CONECTADAS */}
        <div className="col-span-2 pl-4 flex flex-col justify-center space-y-3">

          {top3.map((b, i) => (
            <div key={b.nombre} className="flex items-center">

              {/* LADO IZQUIERDO (Top + Medalla) */}
              <div className="flex items-center gap-2 text-sm min-w-[140px]">
                <Medal index={i} />
                <span className="text-zinc-700">
                  Top {i + 1}: {b.nombre}
                </span>
              </div>

              {/* LINEA CONECTORA */}
              <div className="flex-1 mx-3 border-b border-dashed border-zinc-300"></div>

              {/* TOTAL */}
              <div
                className={`
                  text-sm text-right min-w-[90px]
                  ${i === 0 ? "font-semibold text-zinc-900" : "text-zinc-600"}
                `}
              >
                ${Number(b.total || 0).toLocaleString()}
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
        bg-white
        border border-zinc-200
        rounded-2xl
        shadow-sm
        p-4
        transition-all duration-300
        hover:shadow-md
      "
    >
      {children}
    </div>
  );
}
