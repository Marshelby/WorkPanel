export default function ResumenVentas({ resumen }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {/* TOTAL DÍA */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
          Ventas del día
        </p>
        <h2 className="text-2xl font-bold text-zinc-900">
          ${resumen.totalDia.toLocaleString("es-CL")}
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          {resumen.ventasDia} ventas registradas
        </p>
      </div>

      {/* TOTAL MES */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
          Ventas del mes
        </p>
        <h2 className="text-2xl font-bold text-zinc-900">
          ${resumen.totalMes.toLocaleString("es-CL")}
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          {resumen.ventasMes} ventas registradas
        </p>
      </div>

      {/* PROMEDIO DÍA */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
          Ticket promedio día
        </p>
        <h2 className="text-2xl font-bold text-zinc-900">
          $
          {resumen.ventasDia > 0
            ? Math.round(resumen.totalDia / resumen.ventasDia).toLocaleString("es-CL")
            : 0}
        </h2>
      </div>

      {/* PROMEDIO MES */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
          Ticket promedio mes
        </p>
        <h2 className="text-2xl font-bold text-zinc-900">
          $
          {resumen.ventasMes > 0
            ? Math.round(resumen.totalMes / resumen.ventasMes).toLocaleString("es-CL")
            : 0}
        </h2>
      </div>

    </div>
  );
}
