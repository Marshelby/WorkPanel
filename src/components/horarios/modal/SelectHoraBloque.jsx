import { useMemo } from "react";

/* =========================
   HELPERS
========================= */

function horaToMin(h) {
  if (!h) return null;
  const [hh, mm] = h.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return hh * 60 + mm;
}

function minToHora(min) {
  const hh = Math.floor(min / 60);
  const mm = min % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/* =========================
   COMPONENTE
========================= */

export default function SelectHoraBloque({
  label,
  value,
  onChange,
  apertura,
  cierre,
  bloqueAgenda = 60,
  color = "green",
  error,
  permitirVacio = false,
}) {

  const opciones = useMemo(() => {
    const minApertura = horaToMin(apertura);
    const minCierre = horaToMin(cierre);

    if (minApertura == null || minCierre == null) return [];

    const lista = [];
    let actual = minApertura;

    // 🔥 Generar bloques normales
    while (actual <= minCierre) {
      lista.push(minToHora(actual));
      actual += bloqueAgenda;
    }

    // 🔥 Asegurar que el cierre SIEMPRE esté presente
    const cierreHHMM = minToHora(minCierre);
    if (!lista.includes(cierreHHMM)) {
      lista.push(cierreHHMM);
    }

    // Ordenar por seguridad
    lista.sort((a, b) => horaToMin(a) - horaToMin(b));

    return lista;
  }, [apertura, cierre, bloqueAgenda]);

  return (
    <div>
      <label className="block mb-2">
        <span
          className={`px-2 py-1 rounded text-sm font-medium bg-${color}-100 text-${color}-700`}
        >
          {label}
        </span>
      </label>

      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="border border-black rounded-lg px-3 py-2 bg-white w-full"
      >
        {permitirVacio && <option value="">—</option>}

        {!permitirVacio && <option value="">Seleccionar</option>}

        {opciones.map((hora) => (
          <option key={hora} value={hora}>
            {hora}
          </option>
        ))}
      </select>

      {error && (
        <div className="text-red-600 text-sm mt-1">
          {error}
        </div>
      )}
    </div>
  );
}
