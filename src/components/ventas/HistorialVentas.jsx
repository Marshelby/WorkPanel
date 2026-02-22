export default function HistorialVentas({
  historial,
  anularVenta,
  loading,
}) {
  return (
    <div className="space-y-8">

      <h3 className="text-xl font-semibold tracking-tight text-white">
        Historial de ventas
      </h3>

      {historial.length === 0 ? (
        <div className="rounded-3xl p-8 border border-blue-500/20 
                        bg-gradient-to-br from-zinc-900 to-zinc-800
                        shadow-[0_0_40px_rgba(59,130,246,0.15)]
                        text-sm text-zinc-500 backdrop-blur-xl">
          No hay ventas registradas aún.
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 
                        bg-gradient-to-br from-zinc-900 to-zinc-800
                        shadow-[0_0_60px_rgba(59,130,246,0.12)]
                        backdrop-blur-xl">

          {/* Glow layer */}
          <div className="absolute inset-0 bg-blue-500/5 opacity-30 pointer-events-none" />

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="text-left text-zinc-500 border-b border-zinc-800 uppercase tracking-[0.2em] text-xs">
                  <th className="py-5 px-6">Fecha</th>
                  <th className="px-6">Producto</th>
                  <th className="px-6">Categoría</th>
                  <th className="px-6">Cant.</th>
                  <th className="px-6">Total</th>
                  <th className="px-6">Método</th>
                  <th className="text-right px-6">Acción</th>
                </tr>
              </thead>

              <tbody>
                {historial.map((v) => (
                  <tr
                    key={v.venta_id}
                    className="border-b border-zinc-800 
                               hover:bg-white/5 
                               transition-all duration-300"
                  >
                    <td className="py-5 px-6 text-zinc-400 whitespace-nowrap">
                      {new Date(v.created_at).toLocaleDateString("es-CL")}{" "}
                      {new Date(v.created_at).toLocaleTimeString("es-CL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="px-6 font-semibold text-white">
                      {v.producto}
                    </td>

                    <td className="px-6 text-zinc-400">
                      {v.categoria}
                    </td>

                    <td className="px-6 text-zinc-300 font-medium">
                      {v.cantidad}
                    </td>

                    <td className="px-6 font-bold text-emerald-400">
                      ${Number(v.total_venta).toLocaleString("es-CL")}
                    </td>

                    <td className="px-6">
                      <MetodoBadge metodo={v.metodo_pago} />
                    </td>

                    <td className="px-6 text-right">
                      <button
                        onClick={() => anularVenta(v.venta_id)}
                        disabled={loading}
                        className="text-red-400 hover:text-red-500 text-sm font-medium
                                   transition-all duration-200
                                   hover:scale-105"
                      >
                        Anular
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </div>
      )}

    </div>
  );
}


/* 🔥 Badge moderno mejorado */
function MetodoBadge({ metodo }) {
  const estilos = {
    EFECTIVO:
      "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    TRANSFERENCIA:
      "bg-blue-500/15 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    DEBITO:
      "bg-yellow-500/15 text-yellow-400 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)]",
    CREDITO:
      "bg-purple-500/15 text-purple-400 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
  };

  const estilo =
    estilos[metodo] ||
    "bg-white/10 text-zinc-400 border-white/10";

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full border backdrop-blur transition-all duration-300 ${estilo}`}
    >
      {metodo}
    </span>
  );
}