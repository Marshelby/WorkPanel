import { useEffect, useMemo, useState, Fragment } from "react";
import { supabase } from "../../lib/supabase";
import GestionarAgendaBarberoModal from "./GestionarAgendaBarberoModal";
import DetalleReservaModal from "./DetalleReservaModal";

export default function AgendaGrillaBarberos({ barberiaId, fechaISO }) {
  const [barberos, setBarberos] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cerradoTotal, setCerradoTotal] = useState(false);

  const [modalCrear, setModalCrear] = useState(null);
  const [modalReserva, setModalReserva] = useState(null);

  useEffect(() => {
    if (!barberiaId || !fechaISO) return;

    const cargar = async () => {
      setLoading(true);

      // 1️⃣ Barberos activos
      const { data: barberosData } = await supabase
        .from("barberos")
        .select("id, nombre")
        .eq("barberia_id", barberiaId)
        .eq("activo", true)
        .order("nombre");

      // 2️⃣ Ver si cerrado total
      const { data: horario } = await supabase
        .from("v_barberia_horario_efectivo")
        .select("cerrado_total")
        .eq("barberia_id", barberiaId)
        .eq("fecha", fechaISO)
        .maybeSingle();

      if (horario?.cerrado_total) {
        setCerradoTotal(true);
        setLoading(false);
        return;
      }

      setCerradoTotal(false);

      // 3️⃣ Bloques finales (View 3)
      const { data: bloquesData } = await supabase
        .from("v_agenda_bloques_final")
        .select("*")
        .eq("barberia_id", barberiaId)
        .eq("fecha", fechaISO);

      setBarberos(barberosData || []);
      setBloques(bloquesData || []);
      setLoading(false);
    };

    cargar();
  }, [barberiaId, fechaISO]);

  // Horas únicas ordenadas
  const horasUnicas = useMemo(() => {
    const setHoras = new Set(bloques.map((b) => b.hora.slice(0, 5)));
    return Array.from(setHoras).sort();
  }, [bloques]);

  // Mapa por barbero + hora
  const mapaBloques = useMemo(() => {
    const map = {};
    bloques.forEach((b) => {
      map[`${b.barbero_id}_${b.hora.slice(0, 5)}`] = b;
    });
    return map;
  }, [bloques]);

  if (loading) return <p>Cargando agenda…</p>;

  if (cerradoTotal) {
    return (
      <div className="p-6 text-center font-bold text-red-600">
        🚫 Local cerrado este día
      </div>
    );
  }

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
              <th key={b.id} className="p-3 border font-black text-sm">
                {b.nombre}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {horasUnicas.map((hora, idx) => (
            <Fragment key={hora}>
              <tr>
                <td className="p-3 border font-bold text-sm bg-gray-100">
                  ⏰ {hora}
                </td>

                {barberos.map((b) => {
                  const bloque =
                    mapaBloques[`${b.id}_${hora}`];

                  if (!bloque) {
                    return (
                      <td key={b.id} className="p-3 border text-center">
                        -
                      </td>
                    );
                  }

                  const {
                    estado_bloque_final,
                    agenda_id,
                    estado_final,
                  } = bloque;

                  let contenido;
                  let bgColor = "";

                  if (estado_bloque_final === "AUSENTE") {
                    contenido = (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                        Ausente
                      </span>
                    );
                  }

                  else if (estado_bloque_final === "EN_COLACION") {
                    contenido = (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        En colación
                      </span>
                    );
                  }

                  else if (estado_bloque_final === "RESERVADA") {
                    bgColor = "bg-blue-100/70";

                    contenido = (
                      <div className="text-xs font-semibold">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          Reservada
                        </span>

                        {estado_final === "si_vino" && (
                          <div className="mt-1 text-green-600 font-bold">
                            / Si vino
                          </div>
                        )}

                        {estado_final === "no_vino" && (
                          <div className="mt-1 text-red-600 font-bold">
                            / No vino
                          </div>
                        )}

                        {estado_final == null && (
                          <div className="mt-1 text-gray-500 font-semibold">
                            / ¿Asistió?
                          </div>
                        )}
                      </div>
                    );
                  }

                  else {
                    contenido = (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Libre
                      </span>
                    );
                  }

                  return (
                    <td
                      key={b.id}
                      className={`p-3 border text-center cursor-pointer ${bgColor}`}
                      onClick={() => {
                        if (estado_bloque_final !== "DISPONIBLE") {
                          if (agenda_id) setModalReserva(bloque);
                          return;
                        }

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

              {idx !== horasUnicas.length - 1 && (
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
