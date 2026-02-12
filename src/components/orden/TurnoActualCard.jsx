function MiniCard({ title, name }) {
  return (
    <div className="w-[150px] h-[90px] border border-zinc-300 bg-white rounded-lg shadow-sm flex items-center justify-center text-center">
      <div>
        <div className="text-[11px] text-zinc-500 tracking-wide">
          {title}
        </div>
        <div className="text-sm font-semibold text-zinc-800 mt-1">
          {name || "—"}
        </div>
      </div>
    </div>
  )
}

export default function TurnoActualCard({
  turnoActual,
  siguiente,
  luego,
  historial = [null, null],
  onAtendio,
  bloqueado = false,
}) {
  const sinTurno = !turnoActual

  const esPresente = turnoActual?.estado === "presente"

  return (
    <div className="flex justify-center items-center gap-8 mb-8">

      {/* Historial */}
      <div className="flex gap-4">
        <MiniCard
          title="Ya atendió"
          name={historial[0]?.nombre}
        />
        <MiniCard
          title="Ya atendió"
          name={historial[1]?.nombre}
        />
      </div>

      {/* Turno actual */}
      <div className="w-[320px] h-[230px] border border-zinc-300 bg-white rounded-xl shadow-md flex flex-col items-center justify-center relative">

        {bloqueado && (
          <div className="absolute top-4 right-4 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
            🔒 Local cerrado
          </div>
        )}

        <div className="text-xs text-zinc-500 tracking-widest mb-2">
          TURNO ACTUAL
        </div>

        <div
          className={`text-4xl font-bold mb-5 transition-all ${
            esPresente
              ? "text-green-700"
              : "text-zinc-400"
          }`}
        >
          {sinTurno ? "—" : turnoActual.nombre}
        </div>

        <button
          onClick={onAtendio}
          disabled={bloqueado || sinTurno}
          className="px-8 py-2 bg-green-700 hover:bg-green-800 transition-all text-white text-sm font-semibold rounded-lg shadow disabled:opacity-40"
        >
          Atendió
        </button>

        {/* Estado visual tipo badge */}
        {!bloqueado && turnoActual && (
          <div
            className={`mt-5 px-4 py-1 text-xs font-semibold rounded-full ${
              esPresente
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {esPresente ? "🟢 Presente" : "🔴 Ausente"}
          </div>
        )}

        {sinTurno && !bloqueado && (
          <div className="absolute bottom-4 text-xs text-zinc-500">
            No hay barberos presentes
          </div>
        )}
      </div>

      {/* Siguientes */}
      <div className="flex gap-4">
        <MiniCard
          title="Siguiente"
          name={siguiente?.nombre}
        />
        <MiniCard
          title="Luego"
          name={luego?.nombre}
        />
      </div>

    </div>
  )
}
