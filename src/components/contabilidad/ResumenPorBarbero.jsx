import React from "react";

export default function ResumenPorBarbero({
  resumen = [],
  loading = false,
}) {
  const maxGenerado =
    resumen.length > 0
      ? Math.max(...resumen.map((b) => Number(b.generado || 0)))
      : 0;

  if (loading) {
    return (
      <div className="bg-white border border-black rounded-xl p-5">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          ✂️ <span>Cortes por barbero</span>
        </h3>
        <p className="text-zinc-500">Cargando…</p>
      </div>
    );
  }

  if (!resumen.length) {
    return (
      <div className="bg-white border border-black rounded-xl p-5">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          ✂️ <span>Cortes por barbero</span>
        </h3>
        <p className="text-zinc-500">No hay datos</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
        ✂️ <span>Cortes por barbero</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resumen.map((b) => {
          const generado = Number(b.generado || 0);
          const porcentaje =
            maxGenerado > 0 ? (generado / maxGenerado) * 100 : 0;

          const esTop = generado === maxGenerado;

          return (
            <div
              key={b.nombre}
              className={`
                relative rounded-xl p-4 transition-all duration-200
                ${
                  esTop
                    ? "bg-white border border-green-500 shadow-md"
                    : "bg-zinc-50 border border-zinc-300"
                }
              `}
            >
              {/* Medalla Top */}
              {esTop && (
                <div className="absolute top-3 right-3 text-yellow-500 text-lg">
                  🥇
                </div>
              )}

              {/* Nombre */}
              <p className="font-semibold text-base mb-1">
                {b.nombre}
              </p>

              {/* Cortes grande */}
              <p className="text-2xl font-bold text-zinc-800 leading-tight">
                {b.cortes}
                <span className="text-sm font-medium text-zinc-500 ml-1">
                  cortes
                </span>
              </p>

              {/* Métricas compactas */}
              <p className="text-sm text-zinc-600 mt-2">
                Ganó{" "}
                <strong>
                  ${Number(b.ganado || 0).toLocaleString()}
                </strong>{" "}
                · Generó{" "}
                <strong>
                  ${generado.toLocaleString()}
                </strong>
              </p>

              {/* Barra proporcional */}
              <div className="mt-3 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    esTop ? "bg-green-500" : "bg-zinc-500"
                  }`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
