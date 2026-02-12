import { useEffect, useMemo, useState, Fragment } from "react";
import { supabase } from "../../lib/supabase";
import GestionarAgendaBarberoModal from "./GestionarAgendaBarberoModal";
import DetalleReservaModal from "./DetalleReservaModal";

export default function AgendaGrillaBarberos({ barberiaId, fechaISO }) {
  const [barberos, setBarberos] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [hoverHora, setHoverHora] = useState(null);
  const [hoverBarbero, setHoverBarbero] = useState(null);

  const [modalCrear, setModalCrear] = useState(null);
  const [modalReserva, setModalReserva] = useState(null);

  useEffect(() => {
    if (!barberiaId || !fechaISO) return;

    const cargar = async () => {
      setLoading(true);

      const { data: barberosData } = await supabase
        .from("barberos")
        .select("id, nombre")
        .eq("barberia_id", barberiaId)
        .eq("activo", true)
        .order("nombre");

      const jsDay = new Date(`${fechaISO}T00:00:00`).getDay();
      const diaSemana = jsDay === 0 ? 7 : jsDay;

      const { data: horario } = await supabase
        .from("barberia_horario_semanal")
        .select("hora_apertura, hora_cierre")
        .eq("barberia_id", barberiaId)
        .eq("dia_semana", diaSemana)
        .eq("activo", true)
        .maybeSingle();

      let bloquesGenerados = [];

      if (horario?.hora_apertura && horario?.hora_cierre) {
        let h = horario.hora_apertura.slice(0, 5);
        const cierre = horario.hora_cierre.slice(0, 5);

        while (h < cierre) {
          bloquesGenerados.push(h);
          const [hh, mm] = h.split(":").map(Number);
          const next = new Date(0, 0, 0, hh, mm + 60);
          h = next.toTimeString().slice(0, 5);
        }
      }

      const { data: reservasData } = await supabase
        .from("agendas")
        .select("*")
        .eq("barberia_id", barberiaId)
        .eq("fecha", fechaISO);

      setBarberos(barberosData || []);
      setBloques(bloquesGenerados);
      setReservas(reservasData || []);
      setLoading(false);
    };

    cargar();
  }, [barberiaId, fechaISO]);

  const mapaReservas = useMemo(() => {
    const map = {};
    reservas.forEach((r) => {
      map[`${r.barbero_id}_${r.hora.slice(0, 5)}`] = r;
    });
    return map;
  }, [reservas]);

  if (loading) return <p>Cargando agenda…</p>;

  return (
    <>
      <table className="w-full table-fixed border-2 border-gray-300 rounded-lg overflow-hidden">

        <colgroup>
          <col className="w-[90px]" />
          {barberos.map((b) => (
            <col key={b.id} />
          ))}
        </colgroup>

        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border font-black text-sm">Hora</th>
            {barberos.map((b) => (
              <th
                key={b.id}
                className={`p-3 border font-black text-sm transition-all duration-200 ${
                  hoverBarbero === b.id ? "bg-blue-100 shadow-inner" : ""
                }`}
              >
                {b.nombre}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {bloques.map((hora, idx) => (
            <Fragment key={hora}>
              <tr>
                <td
                  className={`p-3 border font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                    hoverHora === hora
                      ? "bg-blue-100 shadow-inner"
                      : "bg-gray-100"
                  }`}
                >
                  ⏰ {hora}
                </td>

                {barberos.map((b) => {
                  const reserva = mapaReservas[`${b.id}_${hora}`];

                  let contenido;

                  if (!reserva) {
                    contenido = (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Libre
                      </span>
                    );
                  } else {
                    if (reserva.estado_final === "si_vino") {
                      contenido = (
                        <div className="text-xs font-semibold">
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                            Reservada
                          </span>
                          <div className="mt-1 text-green-600 font-bold">
                            / Si vino
                          </div>
                        </div>
                      );
                    } else if (reserva.estado_final === "no_vino") {
                      contenido = (
                        <div className="text-xs font-semibold">
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                            Reservada
                          </span>
                          <div className="mt-1 text-red-600 font-bold">
                            / No vino
                          </div>
                        </div>
                      );
                    } else {
                      contenido = (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          Reservada
                        </span>
                      );
                    }
                  }

                  const isHovered =
                    hoverHora === hora || hoverBarbero === b.id;

                  return (
                    <td
                      key={b.id}
                      className={`p-3 border text-center cursor-pointer transition-all duration-200 relative ${
  isHovered
    ? "bg-blue-50"
    : reserva
      ? "bg-blue-100/70"
      : ""
}`}
onMouseEnter={() => {
  setHoverHora(hora);
  setHoverBarbero(b.id);
}}
onMouseLeave={() => {
  setHoverHora(null);
  setHoverBarbero(null);
}}
onClick={() => {
  if (reserva) setModalReserva(reserva);
  else
    setModalCrear({
      barbero_id: b.id,
      hora,
      fecha: fechaISO,
    });
}}
                    >
                      {contenido}
                    </td>
                  );
                })}
              </tr>

              {idx !== bloques.length - 1 && (
                <tr aria-hidden="true">
                  <td colSpan={barberos.length + 1} className="p-0 border-0">
                    <div className="h-2 bg-gray-300/70" />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>

      <GestionarAgendaBarberoModal
        visible={!!modalCrear}
        contexto={modalCrear}
        onClose={() => setModalCrear(null)}
      />

      <DetalleReservaModal
        visible={!!modalReserva}
        reserva={modalReserva}
        onClose={() => setModalReserva(null)}
      />
    </>
  );
}
