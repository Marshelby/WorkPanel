export default function BarberoCard({
  barbero,
  stats,
  onClick,
}) {
  const {
    total_hoy = 0,
    cortes_hoy = 0,
    ganancia_mes = 0,
    cortes_mes = 0,
  } = stats || {};

  return (
    <div
      onClick={onClick}
      className="
        group
        cursor-pointer
        rounded-3xl
        bg-gradient-to-br from-zinc-800 to-zinc-900
        p-8
        text-white
        shadow-xl
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:shadow-2xl
      "
    >
      {/* Nombre */}
      <h2 className="text-5xl font-extrabold text-center mb-8 tracking-wide">
        {barbero.nombre}
      </h2>

      {/* Caja central dinero */}
      <div
        className="
          bg-gradient-to-br from-black to-zinc-900
          rounded-2xl
          py-8
          px-6
          text-center
          mb-6
          shadow-inner
        "
      >
        <p className="text-4xl font-extrabold tracking-tight">
          ${Number(total_hoy).toLocaleString("es-CL")}
        </p>

        <p className="text-sm text-zinc-400 mt-2">
          {cortes_hoy} {cortes_hoy === 1 ? "corte" : "cortes"} hoy
        </p>
      </div>

      {/* Mes */}
      <p className="text-sm text-zinc-400">
        Este mes:{" "}
        <span className="font-semibold text-white">
          ${Number(ganancia_mes).toLocaleString("es-CL")}
        </span>{" "}
        · {cortes_mes} {cortes_mes === 1 ? "corte" : "cortes"}
      </p>

      {/* Footer elegante */}
      <div className="mt-6 text-center">
        <span className="text-xs text-zinc-500 group-hover:text-white transition-colors duration-300">
          Ver detalles →
        </span>
      </div>
    </div>
  );
}
