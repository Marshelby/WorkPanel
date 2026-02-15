import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import HorarioSemanalModal from "./modales/HorarioSemanalModal";

const DIAS = [
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miércoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
  { label: "Sábado", value: 6 },
  { label: "Domingo", value: 7 },
];

export default function HorarioSemanalCard({
  barberiaId,
  nombreBarberia = "",
  telefonoSoporte = "56900000000",
}) {

  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // JS: 0=Domingo ... 6=Sábado
  const hoyJS = new Date().getDay();
  const hoyDB = hoyJS === 0 ? 7 : hoyJS;

  /* =========================
     FUNCIÓN REFRESCAR (CLAVE)
  ========================= */

  const refrescarHorarios = useCallback(async () => {
    if (!barberiaId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("v_horarios_config")
      .select("*")
      .eq("barberia_id", barberiaId);

    if (!error && data) {
      setHorarios(data);
    }

    setLoading(false);

  }, [barberiaId]);

  /* =========================
     CARGA INICIAL
  ========================= */

  useEffect(() => {
    refrescarHorarios();
  }, [refrescarHorarios]);

  const formatearHora = (hora) => {
    if (!hora) return null;
    return hora.slice(0, 5);
  };

  return (
    <>
      <div className="bg-white border border-zinc-200/70 rounded-2xl p-9 shadow-sm hover:shadow-md transition-all duration-200">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-zinc-100 text-xl">
              🕒
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Horario semanal
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Configuración actual de apertura y cierre
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="text-sm px-4 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all font-medium"
          >
            ✏️ Haz click para hacer un cambio
          </button>
        </div>

        {/* CONTENIDO */}
        {loading ? (
          <div className="text-sm text-zinc-500">
            Cargando horarios...
          </div>
        ) : (
          <div className="space-y-4">
            {DIAS.map((dia) => {

              const registro = horarios.find(
                (h) => h.dia_semana === dia.value
              );

              const apertura = registro
                ? formatearHora(registro.hora_apertura)
                : null;

              const cierre = registro
                ? formatearHora(registro.hora_cierre)
                : null;

              const cerrado = !registro || !apertura || !cierre;
              const esHoy = dia.value === hoyDB;

              return (
                <div
                  key={dia.value}
                  className={`
                    flex items-center justify-between
                    px-5 py-4
                    rounded-xl
                    border
                    transition-all
                    ${
                      esHoy
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-md"
                        : "bg-zinc-50 border-zinc-200/60 hover:bg-white"
                    }
                  `}
                >
                  <div
                    className={`font-medium ${
                      esHoy ? "text-white" : "text-zinc-900"
                    }`}
                  >
                    {dia.label}
                  </div>

                  {cerrado ? (
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        esHoy
                          ? "bg-white text-zinc-900"
                          : "bg-zinc-200 text-zinc-600"
                      }`}
                    >
                      Cerrado
                    </div>
                  ) : (
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        esHoy
                          ? "bg-white text-zinc-900"
                          : "bg-zinc-900 text-white"
                      }`}
                    >
                      {apertura} — {cierre}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-200/60 text-sm text-zinc-500">
          Para modificar horarios puedes hacerlo desde el botón superior.
        </div>
      </div>

      {/* MODAL */}
      <HorarioSemanalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        barberiaId={barberiaId}
        onUpdated={refrescarHorarios}   // 🔥 ESTA ES LA CLAVE
      />
    </>
  );
}
