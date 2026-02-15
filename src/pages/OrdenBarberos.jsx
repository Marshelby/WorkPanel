import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

import TurnoActualCard from "../components/orden/TurnoActualCard"
import ConfigurarOrdenBarberos from "../components/orden/ConfigurarOrdenBarberos"
import HorariosBarberosPanel from "../components/orden/HorariosBarberosPanel"

export default function OrdenBarberos() {
  const [barberos, setBarberos] = useState([])
  const [ordenIds, setOrdenIds] = useState([])
  const [indiceActual, setIndiceActual] = useState(0)
  const [historial, setHistorial] = useState([null, null])
  const [localAbierto, setLocalAbierto] = useState(true)

  // 🔥 Día actual Chile blindado
  const hoyChile = useMemo(() => {
    return new Intl.DateTimeFormat("es-CL", {
      timeZone: "America/Santiago",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date())
  }, [])

  useEffect(() => {
    cargarTodo()
  }, [])

  async function cargarTodo() {
    const hoy = new Date().toISOString().split("T")[0]

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id
    if (!userId) return

    const { data: barberiaData } = await supabase
      .from("barberias")
      .select("id")
      .eq("owner_user_id", userId)
      .single()

    if (!barberiaData) return

    const barberiaId = barberiaData.id

    const { data: localData } = await supabase
      .from("v_horario_local")
      .select("abierto")
      .eq("barberia_id", barberiaId)
      .eq("fecha", hoy)
      .maybeSingle()

    setLocalAbierto(localData?.abierto ?? false)

    const { data: barberosData } = await supabase
      .from("v_barberos")
      .select("id, nombre")
      .eq("barberia_id", barberiaId)
      .order("nombre")

    if (!barberosData) return

    const { data: horariosHoy } = await supabase
      .from("v_horario_barberos")
      .select("barbero_id, presente_final")
      .eq("barberia_id", barberiaId)
      .eq("fecha", hoy)

    const mapPresencia = {}

    horariosHoy?.forEach((h) => {
      if (h.presente_final === true) {
        mapPresencia[h.barbero_id] = "presente"
      }
    })

    const listaFinal = barberosData.map((b) => ({
      id: b.id,
      nombre: b.nombre,
      estado:
        mapPresencia[b.id] === "presente"
          ? "presente"
          : "ausente",
    }))

    setBarberos(listaFinal)
    setOrdenIds(listaFinal.map((b) => b.id))
  }

  const presentes = useMemo(() => {
    return ordenIds
      .map((id) => barberos.find((b) => b.id === id))
      .filter((b) => b && b.estado === "presente")
  }, [ordenIds, barberos])

  const turnoActual = presentes[indiceActual]

  const siguiente =
    presentes.length > 0
      ? presentes[(indiceActual + 1) % presentes.length]
      : null

  const luego =
    presentes.length > 0
      ? presentes[(indiceActual + 2) % presentes.length]
      : null

  const handleAtendio = () => {
    if (!turnoActual || presentes.length === 0 || !localAbierto)
      return

    setHistorial((prev) => {
      const next = [...prev.slice(-1), turnoActual]
      while (next.length < 2) next.unshift(null)
      return next
    })

    setIndiceActual((i) => (i + 1) % presentes.length)
  }

  const handleRetroceder = () => {
    if (presentes.length === 0 || !localAbierto) return

    setIndiceActual((i) =>
      i === 0 ? presentes.length - 1 : i - 1
    )

    setHistorial((prev) => {
      const [h1] = prev
      return [null, h1]
    })
  }

  const moveInOrder = (id, dir) => {
    setOrdenIds((prev) => {
      const idx = prev.indexOf(id)
      const next = dir === "up" ? idx - 1 : idx + 1

      if (idx < 0 || next < 0 || next >= prev.length)
        return prev

      const copy = [...prev]
      ;[copy[idx], copy[next]] = [copy[next], copy[idx]]
      return copy
    })
  }

  return (
    <div className="p-5">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-xl font-semibold">
          Orden de barberos
        </h1>

        <div className="text-right text-sm text-zinc-500 capitalize">
          {hoyChile}
        </div>
      </div>

      {!localAbierto && (
        <div className="mb-6 bg-red-100 text-red-700 border border-red-300 px-4 py-3 font-semibold">
          🔴 El local está cerrado hoy
        </div>
      )}

      <TurnoActualCard
        turnoActual={turnoActual}
        siguiente={siguiente}
        luego={luego}
        historial={historial}
        onAtendio={handleAtendio}
        onRetroceder={handleRetroceder}
        bloqueado={!localAbierto}
      />

      <div className="flex justify-center gap-6">
        <ConfigurarOrdenBarberos
          activos={barberos}
          ordenIds={ordenIds}
          onMove={moveInOrder}
        />

        <HorariosBarberosPanel />
      </div>
    </div>
  )
}
