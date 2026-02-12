export default function DetalleBarberoDia({
  cortes = [],
  totalPeriodo = {
    total_cortes: 0,
    total_precio: 0,
    total_barbero: 0,
  },
  formatHoraCL,
}) {
  const totalCortes = totalPeriodo.total_cortes || 0;
  const totalPrecio = totalPeriodo.total_precio || 0;
  const totalBarbero = totalPeriodo.total_barbero || 0;

  return (
    <div className="bg-white border border-black p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold pb-3 border-b border-black mb-6">
        Cortes de hoy
      </h2>

      {/* Totales */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border rounded-xl p-4 bg-zinc-50">
          <p className="text-xs text-gray-500">Cortes</p>
          <p className="font-bold text-lg">{totalCortes}</p>
        </div>

        <div className="border rounded-xl p-4 bg-zinc-50">
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-bold text-lg text-green-600 tabular-nums">
            ${Number(totalPrecio).toLocaleString("es-CL")}
          </p>
        </div>

        <div className="border rounded-xl p-4 bg-zinc-50">
          <p className="text-xs text-gray-500">Barbero</p>
          <p className="font-bold text-lg text-blue-600 tabular-nums">
            ${Number(totalBarbero).toLocaleString("es-CL")}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="max-h-[420px] overflow-y-auto pr-1">

        {/* HEADER */}
        <div className="grid grid-cols-6 text-sm font-semibold border-b border-black pb-2 mb-2">
          <div className="w-[90px]">Hora</div>
          <div>Corte</div>
          <div>Cliente</div>
          <div>Teléfono</div>
          <div className="text-right w-[110px]">Precio</div>
          <div className="text-right w-[110px]">Barbero</div>
        </div>

        {cortes.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-6 text-sm py-3 border-b border-black/20 items-center hover:bg-zinc-50 transition"
          >
            <div className="w-[90px]">
              {formatHoraCL(c.created_at)}
            </div>

            <div className="truncate">
              {c.tipo_corte_nombre}
            </div>

            <div className="truncate">
              {c.nombre_cliente || "-"}
            </div>

            <div className="truncate">
              {c.telefono_cliente || "-"}
            </div>

            <div className="text-right font-medium w-[110px] tabular-nums">
              ${Number(c.precio).toLocaleString("es-CL")}
            </div>

            <div className="text-right w-[110px] tabular-nums text-blue-600">
              ${Number(c.monto_barbero).toLocaleString("es-CL")}
            </div>
          </div>
        ))}

        {cortes.length === 0 && (
          <div className="text-center text-sm text-zinc-500 py-8">
            No hay cortes registrados hoy.
          </div>
        )}
      </div>
    </div>
  );
}
