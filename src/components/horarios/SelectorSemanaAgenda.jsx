import { useEffect, useMemo, useState } from "react";

const toISO = (d) => d.toLocaleDateString("sv-SE");

/* Lunes real */
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  if (day !== 1) d.setDate(d.getDate() - day + 1);
  d.setHours(0,0,0,0);
  return d;
}

function formatMes(d) {
  return d.toLocaleDateString("es-CL", { month: "short" });
}

export default function SelectorSemanaAgenda({
  onSelectSemana,
}) {
  const hoy = new Date();
  const [fechaBase, setFechaBase] = useState(getMonday(hoy));
  const [animando, setAnimando] = useState(false);

  /* Semana completa real */
  const semana = useMemo(() => {
    const lunes = getMonday(fechaBase);
    const dias = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(lunes);
      d.setDate(lunes.getDate() + i);
      dias.push(d);
    }

    return dias;
  }, [fechaBase]);

  /* Enviar semana automáticamente cuando cambie */
  useEffect(() => {
    if (!semana.length) return;

    onSelectSemana({
      inicio: toISO(semana[0]),
      fin: toISO(semana[6]),
    });
  }, [semana, onSelectSemana]);

  /* Texto rango */
  const rangoTexto = useMemo(() => {
    const inicio = semana[0];
    const fin = semana[6];

    const mesInicio = formatMes(inicio);
    const mesFin = formatMes(fin);

    if (inicio.getMonth() === fin.getMonth()) {
      return `${inicio.getDate()} - ${fin.getDate()} ${mesFin}`;
    }

    return `${inicio.getDate()} ${mesInicio} - ${fin.getDate()} ${mesFin}`;
  }, [semana]);

  const cambiarSemana = (direccion) => {
    setAnimando(true);

    setTimeout(() => {
      const nueva = new Date(fechaBase);
      nueva.setDate(fechaBase.getDate() + direccion * 7);
      setFechaBase(nueva);
      setAnimando(false);
    }, 150);
  };

  return (
    <div className="mt-6 mb-10 flex flex-col items-center">

      {/* HEADER SEMANA */}
      <div className="flex items-center gap-6 mb-4">

        <button
          onClick={() => cambiarSemana(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-300 hover:bg-zinc-100 transition"
        >
          ◀
        </button>

        <div
          className={`
            text-2xl font-extrabold tracking-tight transition-all duration-200
            ${animando ? "opacity-40 scale-95" : "opacity-100 scale-100"}
          `}
        >
          {rangoTexto}
        </div>

        <button
          onClick={() => cambiarSemana(1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-300 hover:bg-zinc-100 transition"
        >
          ▶
        </button>
      </div>

      {/* Línea decorativa premium */}
      <div className="w-32 h-[3px] bg-gradient-to-r from-black to-zinc-400 rounded-full" />

    </div>
  );
}
