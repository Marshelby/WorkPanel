import { useEffect, useMemo, useState } from "react"

export default function ConfigurarOrdenBarberos({
  activos = [],
  ordenIds = [],
  onMove,
}) {
  const [flashId, setFlashId] = useState(null)

  // Ordenar SIEMPRE según ordenIds (si existe)
  const ordered = useMemo(() => {
    if (!ordenIds?.length) return activos

    const map = new Map(activos.map((b) => [b.id, b]))
    return ordenIds.map((id) => map.get(id)).filter(Boolean)
  }, [activos, ordenIds])

  const estadoLabel = (estado) => {
    if (estado !== "ausente") {
      return {
        text: "🟢 Presente",
        cls: "bg-green-100 text-green-700",
      }
    }
    return {
      text: "🔴 Ausente",
      cls: "bg-red-100 text-red-700",
    }
  }

  const handleMove = (id, dir) => {
    if (!onMove) return
    onMove(id, dir)

    // feedback visual del movimiento
    setFlashId(id)
    setTimeout(() => setFlashId(null), 350)
  }

  return (
    <div className="w-[640px] bg-white border border-zinc-300 rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-zinc-800">
          Configurar orden
        </h2>

        <span className="text-xs text-zinc-500">
          Reordena con ↑ ↓
        </span>
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-3">
        {ordered.map((b, idx) => {
          const st = estadoLabel(b.estado)
          const isFlash = flashId === b.id

          return (
            <div
              key={b.id}
              className={[
                "flex items-center justify-between border rounded-lg px-4 py-3 bg-zinc-50 transition-all",
                "border-zinc-200 hover:shadow-sm",
                isFlash ? "ring-2 ring-green-200 shadow-md scale-[1.01]" : "",
              ].join(" ")}
            >
              {/* Izquierda */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-semibold text-zinc-700">
                  {idx + 1}
                </div>

                <div className="font-medium text-zinc-800">
                  {b.nombre}
                </div>
              </div>

              {/* Derecha */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${st.cls}`}
                >
                  {st.text}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleMove(b.id, "up")}
                    disabled={idx === 0}
                    className="w-8 h-8 rounded-md border border-zinc-300 bg-white text-sm hover:bg-zinc-100 transition disabled:opacity-30"
                    title="Subir"
                  >
                    ↑
                  </button>

                  <button
                    onClick={() => handleMove(b.id, "down")}
                    disabled={idx === ordered.length - 1}
                    className="w-8 h-8 rounded-md border border-zinc-300 bg-white text-sm hover:bg-zinc-100 transition disabled:opacity-30"
                    title="Bajar"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
