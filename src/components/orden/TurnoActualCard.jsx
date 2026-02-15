import { useRef, useState } from "react"

function MiniCard({ title, name, innerRef, hideText }) {
  return (
    <div className="w-[150px] h-[90px] border border-zinc-300 bg-white rounded-lg shadow-sm flex items-center justify-center text-center relative z-10">
      <div>
        <div className="text-[11px] text-zinc-500 tracking-wide">
          {title}
        </div>
        <div
          ref={innerRef}
          className={[
            "text-sm font-semibold text-zinc-800 mt-1 transition-opacity duration-150",
            hideText ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
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
  onRetroceder, // <- pásalo desde el padre
  bloqueado = false,
}) {
  const refs = {
    h1: useRef(null),
    h2: useRef(null),
    actual: useRef(null),
    sig: useRef(null),
    luego: useRef(null),
  }

  const DURATION = 1000

  const [clones, setClones] = useState([])
  const [animando, setAnimando] = useState(false)

  const getElements = () => [
    refs.h1.current,
    refs.h2.current,
    refs.actual.current,
    refs.sig.current,
    refs.luego.current,
  ]

  const capturePositions = () => {
    const elements = getElements()
    return elements.map((el) => {
      const rect = el.getBoundingClientRect()
      return {
        text: el.innerText,
        left: rect.left,
        top: rect.top,
        width: rect.width,
      }
    })
  }

  const startAnimation = (dir /* "left" | "right" */) => {
    if (animando) return

    const positions = capturePositions()
    if (positions.length !== 5) return

    const step = positions[1].left - positions[0].left // distancia entre casillas

    // clones parten donde están los textos reales
    const startClones = positions.map((p, i) => ({ ...p, id: i }))
    setClones(startClones)
    setAnimando(true)

    // mover a targets
    requestAnimationFrame(() => {
      setClones((prev) =>
        prev.map((c, i) => {
          // Siguiente: todos corren 1 a la izquierda
          if (dir === "left") {
            if (i === 0) {
              return { ...c, left: positions[0].left - step }
            }
            return {
              ...c,
              left: positions[i - 1].left,
              top: positions[i - 1].top,
            }
          }

          // Anterior: todos corren 1 a la derecha
          if (i === 4) {
            return { ...c, left: positions[4].left + step }
          }
          return {
            ...c,
            left: positions[i + 1].left,
            top: positions[i + 1].top,
          }
        })
      )
    })

    setTimeout(() => {
      setClones([])
      setAnimando(false)
    }, DURATION)
  }

  const handleNext = () => {
    if (bloqueado || !turnoActual || animando) return
    startAnimation("left")
    setTimeout(() => {
      onAtendio?.()
    }, DURATION)
  }

  const handlePrev = () => {
    if (bloqueado || !onRetroceder || animando) return
    startAnimation("right")
    setTimeout(() => {
      onRetroceder?.()
    }, DURATION)
  }

  const sinTurno = !turnoActual
  const esPresente = turnoActual?.estado === "presente"

  return (
    <div className="relative flex justify-center items-center gap-8 mb-8">
      {/* Línea conectora central */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-200 -translate-y-1/2 z-0" />

      {/* Historial */}
      <div className="flex gap-4">
        <MiniCard
          title="Ya atendió"
          name={historial[0]?.nombre}
          innerRef={refs.h1}
          hideText={animando}
        />
        <MiniCard
          title="Ya atendió"
          name={historial[1]?.nombre}
          innerRef={refs.h2}
          hideText={animando}
        />
      </div>

      {/* Turno actual */}
      <div className="w-[320px] h-[230px] border border-zinc-300 bg-white rounded-xl shadow-md flex flex-col items-center justify-center relative overflow-hidden z-10">
        {bloqueado && (
          <div className="absolute top-4 right-4 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
            🔒 Local cerrado
          </div>
        )}

        <div className="text-xs text-zinc-500 tracking-widest mb-2">
          TURNO ACTUAL
        </div>

        <div
          ref={refs.actual}
          className={[
            "text-4xl font-bold mb-5 transition-opacity duration-150",
            esPresente ? "text-green-700" : "text-zinc-400",
            animando ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          {sinTurno ? "—" : turnoActual.nombre}
        </div>

        <button
          onClick={handleNext}
          disabled={bloqueado || sinTurno || animando}
          className="px-8 py-2 bg-green-700 hover:bg-green-800 transition-all duration-200 text-white text-sm font-semibold rounded-lg shadow disabled:opacity-40"
        >
          Siguiente
        </button>

        {/* ANTERIOR: abajo, subrayado, sin cuerpo */}
        <button
          onClick={handlePrev}
          disabled={bloqueado || !onRetroceder || animando}
          className="mt-3 text-xs text-zinc-500 hover:underline disabled:opacity-40"
        >
          Anterior
        </button>

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
          innerRef={refs.sig}
          hideText={animando}
        />
        <MiniCard
          title="Luego"
          name={luego?.nombre}
          innerRef={refs.luego}
          hideText={animando}
        />
      </div>

      {/* Clones animados (solo texto) */}
      {clones.map((c) => (
        <div
          key={c.id}
          className="fixed font-semibold text-zinc-800 pointer-events-none transition-all duration-1000"
          style={{
            left: c.left,
            top: c.top,
            width: c.width,
          }}
        >
          {c.text}
        </div>
      ))}
    </div>
  )
}
