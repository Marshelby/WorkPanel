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
          badge: "bg-emerald-500/20 text-emerald-400",
          signo: "+",
        };
      case "VENTA":
        return {
          label: "Venta",
          badge: "bg-red-500/20 text-red-400",
          signo: "-",
        };
      case "AJUSTE_POS":
        return {
          label: "Suma",
          badge: "bg-emerald-500/20 text-emerald-400",
          signo: "+",
        };
      case "AJUSTE_NEG":
        return {
          label: "Resta",
          badge: "bg-red-500/20 text-red-400",
          signo: "-",
        };
      default:
        return {
          label: tipo,
          badge: "bg-zinc-500/20 text-zinc-400",
          signo: "",
        };
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-xl">

      <h2 className="text-lg font-semibold mb-6 text-white">
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
        <div className="overflow-x-auto">
          <table className="min-w-[1250px] w-full text-sm">

            <thead>
              <tr className="border-b border-zinc-700 text-zinc-400 uppercase text-xs tracking-wider">
                <th className="py-3 px-3 text-left">Fecha</th>
                <th className="px-3 text-left">Tipo</th>
                <th className="px-3 text-left">Producto</th>
                <th className="px-3 text-left">Categoría</th>
                <th className="px-3 text-center">Cant.</th>
                <th className="px-3 text-right">P. Compra</th>
                <th className="px-3 text-right">P. Venta</th>
                <th className="px-3 text-right">Total Compra</th>
                <th className="px-3 text-right">Total Venta</th>
                <th className="px-3 text-right">Utilidad</th>
                <th className="px-3 text-left">Motivo</th>
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
                    className="border-b border-zinc-800 hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-3 text-zinc-400 text-xs">
                      {formatFecha(item.fecha_movimiento)}
                    </td>

                    <td className="px-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${tipo.badge}`}>
                        {tipo.label}
                      </span>
                    </td>

                    <td className="px-3 font-semibold text-white">
                      {item.producto}
                    </td>

                    <td className="px-3 text-zinc-400">
                      {item.categoria}
                    </td>

                    <td className={`px-3 text-center font-semibold ${cantidadColor}`}>
                      {cantidadMostrada}
                    </td>

                    <td className="px-3 text-right text-zinc-300">
                      ${formatMoney(item.precio_compra_unitario)}
                    </td>

                    <td className="px-3 text-right text-zinc-300">
                      ${formatMoney(item.precio_venta_unitario)}
                    </td>

                    <td className="px-3 text-right text-yellow-400 font-semibold">
                      ${formatMoney(item.total_compra)}
                    </td>

                    <td className="px-3 text-right text-emerald-400 font-semibold">
                      ${formatMoney(item.total_venta)}
                    </td>

                    <td
                      className={`px-3 text-right font-bold ${
                        item.utilidad_movimiento >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      ${formatMoney(item.utilidad_movimiento)}
                    </td>

                    <td className="px-3 text-zinc-400 text-xs break-words">
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
