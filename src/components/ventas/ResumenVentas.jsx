export default function ResumenVentas({ resumen }) {
  const promedioDia =
    resumen.ventasDia > 0
      ? Math.round(resumen.totalDia / resumen.ventasDia)
      : 0;

  const promedioMes =
    resumen.ventasMes > 0
      ? Math.round(resumen.totalMes / resumen.ventasMes)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

      {/* VENTAS DÍA */}
      <CardKPI
        titulo="Ventas del día"
        valor={`$${resumen.totalDia.toLocaleString("es-CL")}`}
        subtitulo={`${resumen.ventasDia} ventas registradas`}
        color="emerald"
      />

      {/* VENTAS MES */}
      <CardKPI
        titulo="Ventas del mes"
        valor={`$${resumen.totalMes.toLocaleString("es-CL")}`}
        subtitulo={`${resumen.ventasMes} ventas registradas`}
        color="blue"
      />

      {/* PROMEDIO DÍA */}
      <CardKPI
        titulo="Ticket promedio día"
        valor={`$${promedioDia.toLocaleString("es-CL")}`}
        color="purple"
      />

      {/* PROMEDIO MES */}
      <CardKPI
        titulo="Ticket promedio mes"
        valor={`$${promedioMes.toLocaleString("es-CL")}`}
        color="cyan"
      />

    </div>
  );
}


/* 🔥 Card reutilizable */
function CardKPI({ titulo, valor, subtitulo, color }) {
  const colores = {
    emerald:
      "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10",
    blue:
      "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20 shadow-blue-500/10",
    purple:
      "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/20 shadow-purple-500/10",
    cyan:
      "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20 shadow-cyan-500/10",
  };

  const estilo = colores[color] || colores.blue;

  return (
    <div
      className={`
        relative rounded-2xl p-6 border backdrop-blur-xl
        bg-gradient-to-br ${estilo}
        shadow-xl transition-all duration-300 hover:scale-[1.03]
      `}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-3">
        {titulo}
      </p>

      <h2 className="text-3xl font-bold tracking-tight">
        {valor}
      </h2>

      {subtitulo && (
        <p className="text-sm text-zinc-400 mt-3">
          {subtitulo}
        </p>
      )}
    </div>
  );
}
