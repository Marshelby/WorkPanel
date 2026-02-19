export default function HistorialVentas({
  historial,
  anularVenta,
  loading,
}) {
  return (
    <div className="space-y-8">

      <h3 className="text-xl font-semibold tracking-tight text-zinc-100">
        Historial de ventas
      </h3>

      {historial.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-zinc-500 backdrop-blur">
          No hay ventas registradas aún.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">

          <table className="w-full text-sm">

            <thead>
              <tr className="text-left text-zinc-500 border-b border-white/10">
                <th className="py-4 px-4">Fecha</th>
                <th className="px-4">Producto</th>
                <th className="px-4">Categoría</th>
                <th className="px-4">Cant.</th>
                <th className="px-4">Total</th>
                <th className="px-4">Método</th>
                <th className="text-right px-4">Acción</th>
              </tr>
            </thead>

            <tbody>
              {historial.map((v) => (
                <tr
                  key={v.venta_id}
                  className="border-b border-white/5 hover:bg-white/5 transition-all duration-200"
                >
                  <td className="py-4 px-4 text-zinc-400 whitespace-nowrap">
                    {new Date(v.created_at).toLocaleDateString("es-CL")}{" "}
                    {new Date(v.created_at).toLocaleTimeString("es-CL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="px-4 font-medium text-zinc-100">
                    {v.producto}
                  </td>

                  <td className="px-4 text-zinc-400">
                    {v.categoria}
                  </td>

                  <td className="px-4 text-zinc-300">
                    {v.cantidad}
                  </td>

                  <td className="px-4 font-semibold text-emerald-400">
                    ${Number(v.total_venta).toLocaleString("es-CL")}
                  </td>

                  <td className="px-4">
                    <MetodoBadge metodo={v.metodo_pago} />
                  </td>

                  <td className="px-4 text-right">
                    <button
                      onClick={() => anularVenta(v.venta_id)}
                      disabled={loading}
                      className="text-red-400 hover:text-red-500 text-sm font-medium transition"
                    >
                      Anular
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}


/* 🔥 Badge moderno por método de pago */
function MetodoBadge({ metodo }) {
  const estilos = {
    EFECTIVO: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    TRANSFERENCIA: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    DEBITO: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    CREDITO: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  };

  const estilo = estilos[metodo] || "bg-white/10 text-zinc-400 border-white/10";

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full border backdrop-blur ${estilo}`}
    >
      {metodo}
    </span>
  );
}
