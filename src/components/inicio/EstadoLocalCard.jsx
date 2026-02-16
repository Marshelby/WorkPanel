export default function EstadoLocalCard({ estadoLocal }) {
  if (!estadoLocal) return null;

  const abierto = estadoLocal.estado_local === "ABIERTO";

  const mensaje =
    estadoLocal.mensaje_local ||
    (abierto
      ? "El local se encuentra operando dentro del horario configurado."
      : "El local está cerrado según el horario base configurado.");

  const hoverGlow = abierto
    ? "hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.45)]"
    : "hover:border-red-400/60 hover:shadow-[0_0_40px_rgba(239,68,68,0.45)]";

  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl p-8
        border border-white/10
        bg-gradient-to-br from-zinc-900 to-zinc-800
        shadow-2xl
        transition-all duration-300 ease-out
        hover:bg-white/5
        ${hoverGlow}
      `}
    >
      {/* Glow dinámico base */}
      <div
        className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none ${
          abierto ? "bg-emerald-500" : "bg-red-500"
        }`}
      />

      {/* Glow extra suave al hover */}
      <div
        className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl ${
          abierto ? "bg-emerald-500/5" : "bg-red-500/5"
        }`}
      />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6 relative">
        <div
          className={`w-4 h-4 rounded-full ${
            abierto ? "bg-emerald-400 animate-pulse" : "bg-red-400 animate-pulse"
          }`}
        />
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
          Estado del local
        </p>
      </div>

      {/* Estado principal */}
      <h2
        className={`text-4xl md:text-5xl font-black tracking-tight transition-all duration-300 ${
          abierto
            ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.7)]"
            : "text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]"
        }`}
      >
        {abierto ? "LOCAL ABIERTO" : "LOCAL CERRADO"}
      </h2>

      {/* Mensaje */}
      <p className="mt-6 text-lg text-zinc-300 max-w-3xl leading-relaxed">
        {mensaje}
      </p>

      {/* Línea inferior */}
      <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
