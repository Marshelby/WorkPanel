import { useEffect, useState } from "react";

/* 🔥 Animación tipo ruleta */
function useAnimatedNumber(value, duration = 1200) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (value - start) * easeOut);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return displayValue;
}

export default function ResumenVentas({ resumen }) {
  const promedioDia =
    resumen.ventasDia > 0
      ? Math.round(resumen.totalDia / resumen.ventasDia)
      : 0;

  const promedioMes =
    resumen.ventasMes > 0
      ? Math.round(resumen.totalMes / resumen.ventasMes)
      : 0;

  const totalDiaAnim = useAnimatedNumber(resumen.totalDia || 0);
  const totalMesAnim = useAnimatedNumber(resumen.totalMes || 0);
  const promedioDiaAnim = useAnimatedNumber(promedioDia);
  const promedioMesAnim = useAnimatedNumber(promedioMes);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 animate-fade-in-up">

      <CardKPI
        titulo="Ventas del día"
        valor={`$${totalDiaAnim.toLocaleString("es-CL")}`}
        subtitulo={`${resumen.ventasDia} ventas registradas`}
        color="emerald"
      />

      <CardKPI
        titulo="Ventas del mes"
        valor={`$${totalMesAnim.toLocaleString("es-CL")}`}
        subtitulo={`${resumen.ventasMes} ventas registradas`}
        color="blue"
      />

      <CardKPI
        titulo="Ticket promedio día"
        valor={`$${promedioDiaAnim.toLocaleString("es-CL")}`}
        color="purple"
      />

      <CardKPI
        titulo="Ticket promedio mes"
        valor={`$${promedioMesAnim.toLocaleString("es-CL")}`}
        color="cyan"
      />

    </div>
  );
}


/* 🔥 Card KPI Ultra Pro */
function CardKPI({ titulo, valor, subtitulo, color }) {
  const colores = {
    emerald:
      "from-emerald-500/25 to-emerald-500/5 text-emerald-400 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.4)]",
    blue:
      "from-blue-500/25 to-blue-500/5 text-blue-400 border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.4)]",
    purple:
      "from-purple-500/25 to-purple-500/5 text-purple-400 border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.4)]",
    cyan:
      "from-cyan-500/25 to-cyan-500/5 text-cyan-400 border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.4)]",
  };

  const estilo = colores[color] || colores.blue;

  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl p-6 border backdrop-blur-xl
        bg-gradient-to-br ${estilo}
        transition-all duration-500
        hover:scale-[1.04]
        hover:shadow-[0_0_70px_rgba(255,255,255,0.08)]
        group
      `}
    >
      {/* Glow breathing */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-700 bg-white/5" />

      <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-4">
        {titulo}
      </p>

      <h2 className="text-3xl font-bold tracking-tight transition-all duration-300">
        {valor}
      </h2>

      {subtitulo && (
        <p className="text-sm text-zinc-400 mt-4">
          {subtitulo}
        </p>
      )}
    </div>
  );
}