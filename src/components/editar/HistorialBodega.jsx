import React from "react";

export default function HistorialBodega({
  registros = [],
  loading = false,
}) {
  const formatMoney = (value) =>
    new Intl.NumberFormat("es-CL").format(value || 0);

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    const d = new Date(fecha);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
  };

  const normalizarTipo = (tipo) => {
    switch (tipo) {
      case "INGRESO":
        return {
          label: "Ingreso",
          badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
          signo: "+",
        };
      case "VENTA":
        return {
          label: "Venta",
          badge: "bg-red-500/20 text-red-400 border border-red-500/30",
          signo: "-",
        };
      case "AJUSTE_POS":
        return {
          label: "Suma",
          badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
          signo: "+",
        };
      case "AJUSTE_NEG":
        return {
          label: "Resta",
          badge: "bg-red-500/20 text-red-400 border border-red-500/30",
          signo: "-",
        };
      default:
        return {
          label: tipo,
          badge: "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30",
          signo: "",
        };
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-8
                 border border-blue-400/15
                 bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80
                 backdrop-blur-xl
                 shadow-[0_0_60px_rgba(59,130,246,0.15)]
                 transition-all duration-300
                 hover:shadow-[0_0_80px_rgba(59,130,246,0.25)]"
    >
      {/* Glow decorativo */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-500/10 blur-[140px] rounded-full pointer-events-none" />

      <h2
        className="text-xl font-bold mb-8 tracking-tight
                   bg-gradient-to-r from-blue-300 to-cyan-400
                   bg-clip-text text-transparent"
      >
        📋 Historial de movimientos
      </h2>

      {loading && (
        <p className="text-sm text-zinc-400">
          Cargando historial...
        </p>
      )}

      {!loading && registros.length === 0 && (
        <p className="text-sm text-zinc-400">
          No hay movimientos aún.
        </p>
      )}

      {!loading && registros.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="min-w-[1250px] w-full text-sm">

            <thead className="bg-white/5 backdrop-blur sticky top-0 z-10">
              <tr className="text-zinc-400 uppercase text-xs tracking-[0.15em] border-b border-white/5">
                <th className="py-4 px-4 text-left">Fecha</th>
                <th className="px-4 text-left">Tipo</th>
                <th className="px-4 text-left">Producto</th>
                <th className="px-4 text-left">Categoría</th>
                <th className="px-4 text-center">Cant.</th>
                <th className="px-4 text-right">P. Compra</th>
                <th className="px-4 text-right">P. Venta</th>
                <th className="px-4 text-right">Total Compra</th>
                <th className="px-4 text-right">Total Venta</th>
                <th className="px-4 text-right">Utilidad</th>
                <th className="px-4 text-left">Motivo</th>
              </tr>
            </thead>

            <tbody>
              {registros.map((item) => {
                const tipo = normalizarTipo(item.tipo);
                const cantidad = Number(item.cantidad) || 0;

                const cantidadMostrada =
                  tipo.signo === "-"
                    ? `-${cantidad}`
                    : `+${cantidad}`;

                const cantidadColor =
                  tipo.signo === "+"
                    ? "text-emerald-400"
                    : "text-red-400";

                return (
                  <tr
                    key={item.movimiento_id}
                    className="border-b border-white/5
                               hover:bg-white/5
                               transition-all duration-200"
                  >
                    <td className="py-4 px-4 text-zinc-400 text-xs">
                      {formatFecha(item.fecha_movimiento)}
                    </td>

                    <td className="px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${tipo.badge}`}
                      >
                        {tipo.label}
                      </span>
                    </td>

                    <td className="px-4 font-semibold text-zinc-100">
                      {item.producto}
                    </td>

                    <td className="px-4 text-zinc-400">
                      {item.categoria}
                    </td>

                    <td
                      className={`px-4 text-center font-semibold ${cantidadColor}`}
                    >
                      {cantidadMostrada}
                    </td>

                    <td className="px-4 text-right text-zinc-300">
                      ${formatMoney(item.precio_compra_unitario)}
                    </td>

                    <td className="px-4 text-right text-zinc-300">
                      ${formatMoney(item.precio_venta_unitario)}
                    </td>

                    <td className="px-4 text-right text-yellow-400 font-semibold">
                      ${formatMoney(item.total_compra)}
                    </td>

                    <td className="px-4 text-right text-emerald-400 font-semibold">
                      ${formatMoney(item.total_venta)}
                    </td>

                    <td
                      className={`px-4 text-right font-bold ${
                        item.utilidad_movimiento >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      ${formatMoney(item.utilidad_movimiento)}
                    </td>

                    <td className="px-4 text-zinc-400 text-xs break-words">
                      {item.motivo || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}