export default function HistorialVentas({
  historial,
  anularVenta,
  loading,
}) {
  return (
    <div className="space-y-6">

      <h3 className="text-lg font-semibold text-zinc-900">
        Historial de ventas
      </h3>

      {historial.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No hay ventas registradas aún.
        </p>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="text-left text-zinc-500 border-b border-zinc-200">
                <th className="py-3">Fecha</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Cant.</th>
                <th>Total</th>
                <th>Método</th>
                <th className="text-right">Acción</th>
              </tr>
            </thead>

            <tbody>
              {historial.map((v) => (
                <tr
                  key={v.venta_id}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition"
                >
                  <td className="py-3 text-zinc-600">
                    {new Date(v.created_at).toLocaleDateString("es-CL")}{" "}
                    {new Date(v.created_at).toLocaleTimeString("es-CL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="font-medium text-zinc-900">
                    {v.producto}
                  </td>

                  <td className="text-zinc-600">
                    {v.categoria}
                  </td>

                  <td className="text-zinc-600">
                    {v.cantidad}
                  </td>

                  <td className="font-semibold text-zinc-900">
                    ${Number(v.total_venta).toLocaleString("es-CL")}
                  </td>

                  <td className="text-zinc-500">
                    {v.metodo_pago}
                  </td>

                  <td className="text-right">
                    <button
                      onClick={() => anularVenta(v.venta_id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition"
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
