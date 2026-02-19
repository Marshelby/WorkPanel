export default function EstadoEmpresaCard({ estadoEmpresa }) {
  const estado = estadoEmpresa?.estado || "OPERATIVO";
  const mensaje =
    estadoEmpresa?.mensaje || "Sistema funcionando correctamente";

  const esOperativo = estado === "OPERATIVO";

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

      {/* Glow dinámico */}
      <div
        className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[120px] pointer-events-none ${
          esOperativo
            ? "bg-emerald-500/20"
            : "bg-red-500/20"
        }`}
      />

      {/* Header pequeño */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-3 h-3 rounded-full animate-pulse ${
            esOperativo ? "bg-emerald-400" : "bg-red-400"
          }`}
        />
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Estado del sistema
        </p>
      </div>

      {/* Estado grande */}
      <h2
        className={`text-4xl font-black tracking-tight ${
          esOperativo
            ? "text-emerald-400"
            : "text-red-400"
        }`}
      >
        {estado}
      </h2>

      {/* Mensaje */}
      <p className="mt-4 text-zinc-400 max-w-3xl">
        {mensaje}
      </p>

      {/* Línea decorativa */}
      <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Indicadores rápidos */}
      <div className="mt-6 flex flex-wrap gap-6 text-sm">

        <div className="flex flex-col">
          <span className="text-zinc-500 text-xs uppercase tracking-wider">
            Modo
          </span>
          <span className="text-zinc-200 font-medium">
            Producción
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-zinc-500 text-xs uppercase tracking-wider">
            Última actualización
          </span>
          <span className="text-zinc-200 font-medium">
            En tiempo real
          </span>
        </div>

      </div>
    </div>
  );
}
