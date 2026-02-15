import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const DIAS_CORTO = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

function normalizarHora(time) {
  if (!time) return null;
  return time.substring(0, 5);
}

export default function HorarioSemanaBarbero({
  barbero,
  semana,
  barberiaId, // ✅ NUEVO: viene del padre
}) {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ CAMBIO: ya no dependemos de barbero.barberia_id
    if (!barbero?.id || !barberiaId || !semana?.inicio || !semana?.fin) return;

    const cargar = async () => {
      setLoading(true);

      const { data: individuales } = await supabase
        .from("horarios_barberos")
        .select("*")
        .eq("barbero_id", barbero.id)
        .gte("fecha", semana.inicio)
        .lte("fecha", semana.fin);

      const { data: locales } = await supabase
        .from("v_horario_local")
        .select("*")
        .eq("barberia_id", barberiaId) // ✅ CAMBIO
        .gte("fecha", semana.inicio)
        .lte("fecha", semana.fin);

      const mapIndividual = {};
      (individuales || []).forEach((d) => {
        mapIndividual[d.fecha] = d;
      });

      const resultado = (locales || []).map((dia) => {
        const ind = mapIndividual[dia.fecha];

        let entrada = null;
        let salida = null;
        let salidaColacion = null;
        let regresoColacion = null;
        let origen = dia.origen;

        if (ind) {
          entrada = normalizarHora(ind.hora_entrada);
          salida = normalizarHora(ind.hora_salida);
          salidaColacion = normalizarHora(ind.hora_salida_colacion);
          regresoColacion = normalizarHora(ind.hora_regreso_colacion);
          origen = "individual";
        } else if (dia.abierto) {
          entrada = normalizarHora(dia.hora_apertura);
          salida = normalizarHora(dia.hora_cierre);
        }

        const cerrado = !entrada || !salida;

        return {
          fecha: dia.fecha,
          presente: !cerrado,
          entrada,
          salida,
          salidaColacion,
          regresoColacion,
          origen: cerrado ? "cerrado" : origen,
        };
      });

      setDatos(resultado);
      setLoading(false);
    };

    cargar();
  }, [barbero?.id, barberiaId, semana?.inicio, semana?.fin]);

  const diasOrdenados = useMemo(() => {
    return [...datos].sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [datos]);

  if (loading) {
    return (
      <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-lg">
        <p className="text-sm text-gray-500">Cargando semana...</p>
      </div>
    );
  }

  return (
    <div
      className="
        bg-white 
        border-2 border-black 
        rounded-3xl 
        p-6 
        shadow-lg 
        hover:shadow-2xl 
        transition-all duration-300
      "
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900">
          {barbero.nombre}
        </h3>

        <span
          className="
            text-xs 
            font-semibold
            px-4 py-1.5
            rounded-full
            border border-zinc-300
            bg-white
            text-zinc-700
            shadow-sm
            ring-1 ring-black/5
          "
        >
          Vista semanal
        </span>
      </div>

      <div className="grid grid-cols-7 gap-4 text-center">
        {diasOrdenados.map((d) => {
          const fechaObj = new Date(d.fecha + "T00:00:00");
          const nombreDia = DIAS_CORTO[(fechaObj.getDay() + 6) % 7];

          return (
            <div key={d.fecha} className="flex flex-col items-center gap-1">
              <div className="text-[11px] uppercase tracking-wide text-zinc-500 font-semibold">
                {nombreDia}
              </div>

              <div className="text-sm font-medium text-zinc-800">
                {fechaObj.getDate()}
              </div>

              {!d.presente ? (
                <Tooltip label="Local cerrado">
                  <div className="text-xs text-red-500 font-semibold mt-2 cursor-default">
                    Cerrado
                  </div>
                </Tooltip>
              ) : (
                <div className="flex flex-col items-center mt-2 w-full">
                  <Tooltip label="Horario entrada">
                    <div className="text-sm font-semibold text-emerald-600">
                      {d.entrada}
                    </div>
                  </Tooltip>
                  <span className="text-[9px] text-zinc-400">Entrada</span>

                  {d.salidaColacion && (
                    <>
                      <div className="w-6 h-[1px] bg-zinc-200 my-1"></div>
                      <Tooltip label="Salida colación">
                        <div className="text-xs text-orange-500 font-medium">
                          {d.salidaColacion}
                        </div>
                      </Tooltip>
                      <span className="text-[9px] text-zinc-400">Salida col.</span>
                    </>
                  )}

                  {d.regresoColacion && (
                    <>
                      <Tooltip label="Regreso colación">
                        <div className="text-xs text-emerald-500 font-medium">
                          {d.regresoColacion}
                        </div>
                      </Tooltip>
                      <span className="text-[9px] text-zinc-400">Regreso</span>
                    </>
                  )}

                  <div className="w-6 h-[1px] bg-zinc-200 my-1"></div>

                  <Tooltip label="Horario salida">
                    <div className="text-sm font-semibold text-red-500">
                      {d.salida}
                    </div>
                  </Tooltip>
                  <span className="text-[9px] text-zinc-400">Salida</span>

                  <div className="text-[10px] mt-1">
                    {d.origen === "base" && (
                      <span className="text-zinc-400">Base</span>
                    )}
                    {d.origen === "cronograma" && (
                      <span className="text-blue-500 font-medium">Especial</span>
                    )}
                    {d.origen === "individual" && (
                      <span className="text-emerald-600 font-medium">Individual</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* TOOLTIP */
function Tooltip({ children, label }) {
  return (
    <div className="relative group inline-block cursor-default">
      {children}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none hidden md:block">
        <div className="bg-black text-white text-[10px] px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
          {label}
        </div>
      </div>
    </div>
  );
}
