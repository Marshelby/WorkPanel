export default function ResumenGeneralWork({
  resumenDia,
  ingresosMes,
  loading,
}) {
  return (
    <div className="space-y-6">

      {/* VENTAS HOY */}
      <div className="relative rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">

        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-2">
          Ventas hoy
        </p>

        <h3 className="text-3xl font-black text-blue-400">
          {loading
            ? "..."
            : resumenDia.total_ventas}
        </h3>

      </div>

      {/* INGRESOS HOY */}
      <div className="relative rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">

        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-2">
          Ingresos hoy
        </p>

        <h3 className="text-3xl font-black text-emerald-400">
          {loading
            ? "..."
            : `$${resumenDia.total_ingresos.toLocaleString("es-CL")}`}
        </h3>

      </div>

      {/* INGRESOS MES */}
      <div className="relative rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">

        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />

        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-2">
          Ingresos mes
        </p>

        <h3 className="text-3xl font-black text-cyan-400">
          {loading
            ? "..."
            : `$${ingresosMes.toLocaleString("es-CL")}`}
        </h3>

      </div>

    </div>
  );
}
