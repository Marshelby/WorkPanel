import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const DIAS = [
  "LUNES",
  "MARTES",
  "MIÉRCOLES",
  "JUEVES",
  "VIERNES",
  "SÁBADO",
  "DOMINGO",
];

const DIAS_CORTO = ["Lu","Ma","Mi","Ju","Vi","Sa","Do"];

/* EXACTAMENTE el mismo formato que tu selector que sí funciona */
const toISO = (d) => d.toLocaleDateString("sv-SE");

const startOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const endOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);

export default function SelectorDiaAgenda({
  barberiaId,
  fechaSeleccionada,
  onSelect,
}) {
  const hoy = new Date();
  const hoyISO = toISO(hoy);

  const [mesActual, setMesActual] = useState(startOfMonth(hoy));
  const [cronogramaMes, setCronogramaMes] = useState([]);

  /* =========================
     CARGA CRONOGRAMA (TABLA REAL)
  ========================= */
  useEffect(() => {
    if (!barberiaId) return;

    const cargar = async () => {
      const inicio = toISO(startOfMonth(mesActual));
      const fin = toISO(endOfMonth(mesActual));

      const { data, error } = await supabase
        .from("cronograma_barberia")
        .select("fecha, local_cerrado, horario_especial")
        .eq("barberia_id", barberiaId)
        .gte("fecha", inicio)
        .lte("fecha", fin);

      if (error) {
        console.error("Error cargando cronograma:", error);
        setCronogramaMes([]);
        return;
      }

      setCronogramaMes(data || []);
    };

    cargar();
  }, [barberiaId, mesActual]);

  /* MISMO MAPEO QUE TU SELECTOR QUE FUNCIONA */
  const cronogramaMap = useMemo(() => {
    const map = {};
    cronogramaMes.forEach((d) => {
      map[d.fecha] = d;
    });
    return map;
  }, [cronogramaMes]);

  /* =========================
     GENERACIÓN DE DÍAS (MISMA LÓGICA ORIGINAL)
  ========================= */
  const diasDelMes = useMemo(() => {
    const inicio = startOfMonth(mesActual);
    const fin = endOfMonth(mesActual);

    const dias = [];
    for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
      dias.push(new Date(d));
    }

    return dias;
  }, [mesActual]);

  const mesVisible = mesActual.toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
  });

  const estadoSeleccionado = fechaSeleccionada
    ? cronogramaMap[fechaSeleccionada]
    : null;

  const estaCerrado = !!estadoSeleccionado?.local_cerrado;

  const fechaFormateada = useMemo(() => {
    if (!fechaSeleccionada) return null;

    const d = new Date(fechaSeleccionada + "T00:00:00");

    const nombreDia = DIAS[(d.getDay() + 6) % 7];
    const numero = d.getDate();
    const mes = d.toLocaleDateString("es-CL", { month: "long" });
    const year = d.getFullYear();

    return `${nombreDia} ${numero} DE ${mes.toUpperCase()} ${year}`;
  }, [fechaSeleccionada]);

  const seleccionarDia = (iso) => {
    onSelect(iso);

    setTimeout(() => {
      document
        .getElementById("agenda-grilla")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <div className="mt-4 mb-6 flex flex-col items-center">

      {/* HEADER MES */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() =>
            setMesActual(
              new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1)
            )
          }
        >
          ◀
        </button>

        <div className="font-bold capitalize text-lg">
          {mesVisible}
        </div>

        <button
          onClick={() =>
            setMesActual(
              new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1)
            )
          }
        >
          ▶
        </button>
      </div>

      {/* GRID DÍAS */}
      <div
        className="grid gap-2 grid-rows-2 auto-cols-fr max-w-[1000px] grid-flow-row"
        style={{
          gridTemplateColumns: `repeat(${Math.ceil(
            diasDelMes.length / 2
          )}, minmax(56px, 1fr))`,
        }}
      >
        {diasDelMes.map((d) => {
          const iso = toISO(d);
          const activo = iso === fechaSeleccionada;
          const esPasado = iso < hoyISO;

          const estado = cronogramaMap[iso];
          const cerrado = !!estado?.local_cerrado;
          const especial = !!estado?.horario_especial;

          return (
            <button
              key={iso}
              onClick={() => seleccionarDia(iso)}
              className={`
                px-2 py-2 rounded-lg border text-center relative
                transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-md
                ${activo ? "bg-black text-white" : "bg-white"}
                ${esPasado ? "opacity-60" : ""}
                ${cerrado ? "border-red-500 bg-red-50" : ""}
                ${especial ? "border-yellow-500 bg-yellow-50" : ""}
              `}
            >
              <div className="text-sm font-semibold">
                {DIAS_CORTO[(d.getDay() + 6) % 7]}
              </div>

              <div className="text-xs">{d.getDate()}</div>

              {cerrado && (
                <span className="absolute top-1 right-1 text-[9px] bg-red-600 text-white px-1 rounded">
                  C
                </span>
              )}

              {especial && !cerrado && (
                <span className="absolute top-1 right-1 text-[9px] bg-yellow-400 text-black px-1 rounded">
                  E
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* MENSAJE DÍA SELECCIONADO */}
      {fechaFormateada && (
        <div className="mt-6 mb-4 text-center">
          <p className="text-gray-500 text-sm">
            Estás viendo el día
          </p>

          <p className="text-xl font-bold text-black tracking-wide mt-1">
            {fechaFormateada}
          </p>

          {estaCerrado && (
            <div className="mt-3 text-red-600 font-bold text-sm tracking-wide">
              LOCAL CERRADO POR CRONOGRAMA
            </div>
          )}
        </div>
      )}
    </div>
  );
}
