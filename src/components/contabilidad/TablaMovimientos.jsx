import React from "react";

export default function TablaMovimientos({
  movimientos = [],
  loading = false,
}) {
  if (loading) {
    return (
      <div
        id="tabla-contabilidad"
        className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl scroll-mt-24"
      >
        <p className="text-zinc-400">Cargando…</p>
      </div>
    );
  }

  const getTipoStyles = (origen) => {
    switch (origen) {
      case "VENTA":
        return "text-emerald-400";
      case "INGRESO":
        return "text-blue-400";
      case "AJUSTE_POS":
        return "text-cyan-400";
      case "AJUSTE_NEG":
        return "text-orange-400";
      default:
        return "text-zinc-400";
    }
  };

  const getEstadoBadge = (activo) => {
    if (activo === false) {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
          Anulada
        </span>
      );
    }

    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        Activa
      </span>
    );
  };

  return (
    <div
      id="tabla-contabilidad"
      className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/70 border border-white/10 rounded-2xl scroll-mt-24 backdrop-blur-xl shadow-2xl transition-all duration-300"
    >
      <div className="max-h-[520px] overflow-y-auto">
        <table className="w-full text-sm text-zinc-300">
          {/* HEADER */}
          <thead className="bg-zinc-900/95 backdrop-blur border-b border-white/10 sticky top-0 z-10">
            <tr className="text-xs uppercase tracking-widest text-zinc-400">
              <th className="text-left py-3 px-4">Fecha / Hora</th>
              <th className="text-left py-3 px-4">Tipo</th>
              <th className="text-left py-3 px-4">Producto</th>
              <th className="text-left py-3 px-4">Categoría</th>
              <th className="text-right py-3 px-4">Cantidad</th>
              <th className="text-right py-3 px-4">Total</th>
              <th className="text-right py-3 px-4">Utilidad</th>
              <th className="text-left py-3 px-4">Vendedor</th>
              <th className="text-left py-3 px-4">Pago</th>
              <th className="text-center py-3 px-4">Estado</th>
            </tr>
          </thead>

          <tbody>
            {movimientos.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-12 text-zinc-500">
                  No hay registros
                </td>
              </tr>
            ) : (
              movimientos.map((m, i) => {
                const total =
                  m.origen === "VENTA"
                    ? Number(m.total_venta || 0)
                    : Number(m.total_compra || 0);

                const utilidad = Number(m.utilidad || 0);
                const anulada = m.activo === false;

                return (
                  <tr
                    key={m.id_movimiento}
                    className={`
                      border-t border-white/5 transition-all duration-200
                      ${i % 2 === 0 ? "bg-white/0" : "bg-white/5"}
                      ${anulada ? "opacity-50" : "hover:bg-emerald-500/10"}
                    `}
                  >
                    <td className="py-3 px-4 text-zinc-400">
                      {new Date(m.created_at).toLocaleString("es-CL")}
                    </td>

                    <td
                      className={`py-3 px-4 font-medium ${getTipoStyles(
                        m.origen
                      )}`}
                    >
                      {m.origen}
                    </td>

                    <td className="py-3 px-4 text-white">
                      {m.producto || "-"}
                    </td>

                    <td className="py-3 px-4 text-zinc-400">
                      {m.categoria || "-"}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {Number(m.cantidad || 0)}
                    </td>

                    {/* TOTAL */}
                    <td
                      className={`py-3 px-4 text-right font-semibold ${
                        anulada
                          ? "line-through text-zinc-500"
                          : "text-emerald-400"
                      }`}
                    >
                      ${total.toLocaleString("es-CL")}
                    </td>

                    {/* UTILIDAD */}
                    <td className="py-3 px-4 text-right font-medium">
                      {utilidad >= 0 ? (
                        <span
                          className={
                            anulada
                              ? "line-through text-zinc-500"
                              : "text-emerald-400"
                          }
                        >
                          ${utilidad.toLocaleString("es-CL")}
                        </span>
                      ) : (
                        <span
                          className={
                            anulada
                              ? "line-through text-zinc-500"
                              : "text-red-400"
                          }
                        >
                          -${Math.abs(utilidad).toLocaleString("es-CL")}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-zinc-300">
                      {m.vendedor || "-"}
                    </td>

                    <td className="py-3 px-4 text-zinc-400">
                      {m.metodo_pago || "-"}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {getEstadoBadge(m.activo)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
