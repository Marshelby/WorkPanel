import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function HorariosBarberosPanel() {
  const [horariosFinales, setHorariosFinales] = useState([])
  const [localAbierto, setLocalAbierto] = useState(true)

  useEffect(() => {
    cargarHorarios()
  }, [])

  async function cargarHorarios() {
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

    // Local abierto o cerrado
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
      .select("*")
      .eq("barberia_id", barberiaId)
      .eq("fecha", hoy)

    const mapHorarios = {}
    horariosHoy?.forEach((h) => {
      mapHorarios[h.barbero_id] = h
    })

    const resultado = barberosData.map((b) => {
      const horario = mapHorarios[b.id]

      return {
        id: b.id,
        nombre: b.nombre,
        presente: horario?.presente_final ?? false,
        apertura: horario?.hora_apertura_final ?? null,
        salida: horario?.hora_salida_final ?? null,
        colacionSalida: horario?.hora_salida_colacion ?? null,
        colacionRegreso: horario?.hora_regreso_colacion ?? null,
      }
    })

    setHorariosFinales(resultado)
  }

  const formatearHora = (h) => {
    if (!h) return null
    return h.substring(0, 5)
  }

  return (
    <div className="w-[520px] bg-white border border-zinc-300 rounded-xl shadow-sm p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-zinc-800">
          Horarios de barberos
        </h2>

        <div
          className={`text-xs px-3 py-1 rounded-full font-semibold ${
            localAbierto
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {localAbierto ? "🟢 Local abierto" : "🔴 Local cerrado"}
        </div>
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-3">
        {horariosFinales.map((b) => (
          <div
            key={b.id}
            className="border border-zinc-200 rounded-lg p-4 hover:shadow-sm transition-all bg-zinc-50"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-zinc-800">
                {b.nombre}
              </span>

              <div
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  b.presente
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {b.presente ? "🟢 Presente" : "🔴 Ausente"}
              </div>
            </div>

            {b.presente && b.apertura && b.salida ? (
              <div className="text-sm text-zinc-600 space-y-1">
                <div>
                  {formatearHora(b.apertura)} –{" "}
                  {formatearHora(b.salida)}
                </div>

                {b.colacionSalida && b.colacionRegreso && (
                  <div className="text-xs text-zinc-500">
                    Colación:{" "}
                    {formatearHora(b.colacionSalida)} –{" "}
                    {formatearHora(b.colacionRegreso)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-zinc-500">
                Sin registro para hoy
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
