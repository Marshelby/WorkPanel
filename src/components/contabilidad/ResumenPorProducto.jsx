import React from "react";

export default function ResumenPorProducto({
  resumen = [],
  loading = false,
}) {

  const maxVentas =
    resumen.length > 0
      ? Math.max(...resumen.map((p) => Number(p.ventas || 0)))
      : 0;

  if (loading) {
    return (
      <Container>
        <Title />
        <p className="text-zinc-400">Cargando…</p>
      </Container>
    );
  }

  if (!resumen.length) {
    return (
      <Container>
        <Title />
        <p className="text-zinc-400">No hay datos</p>
      </Container>
    );
  }

  return (
    <Container>
      <Title />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {resumen.map((p) => {
          const ventas = Number(p.ventas || 0);
          const compras = Number(p.compras || 0);
          const utilidad = ventas - compras;

          const porcentaje =
            maxVentas > 0 ? (ventas / maxVentas) * 100 : 0;

          const esTop = ventas === maxVentas;

          return (
            <div
              key={p.categoria}
              className={`
                relative rounded-2xl p-5 transition-all duration-300 border
                ${
                  esTop
                    ? "bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }
              `}
            >
              {esTop && (
                <div className="absolute top-4 right-4 text-yellow-400 text-lg">
                  🥇
                </div>
              )}

              <p className="font-semibold text-base mb-2 text-white">
                {p.categoria}
              </p>

              <div className="space-y-1 text-sm">

                <p className="text-zinc-400">
                  Ventas:
                  <span className="text-emerald-400 font-medium ml-1">
                    ${ventas.toLocaleString("es-CL")}
                  </span>
                </p>

                <p className="text-zinc-400">
                  Compras:
                  <span className="text-blue-400 font-medium ml-1">
                    ${compras.toLocaleString("es-CL")}
                  </span>
                </p>

                <p className="text-zinc-400">
                  Utilidad:
                  <span
                    className={`ml-1 font-medium ${
                      utilidad >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    ${utilidad.toLocaleString("es-CL")}
                  </span>
                </p>

              </div>

              {/* Barra proporcional */}
              <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    esTop ? "bg-emerald-400" : "bg-zinc-500"
                  }`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          );
        })}

      </div>
    </Container>
  );
}

/* ========================= */

function Title() {
  return (
    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
      📊 <span>Resumen por categoría</span>
    </h3>
  );
}

function Container({ children }) {
  return (
    <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
      {children}
    </div>
  );
}
