import { useMemo } from "react";

export default function HorarioEspecialForm({
  value,
  onChange,
  horariosBase = [],
}) {
  // Solo maneja horas (HH)
  const haH = value?.haH ?? "";
  const hcH = value?.hcH ?? "";

  const horasOpciones = useMemo(() => {
    const set = new Set();

    (horariosBase || []).forEach((h) => {
      if (!h?.hora) return;
      const hh = String(h.hora).slice(0, 2);
      if (/^\d{2}$/.test(hh)) set.add(hh);
    });

    if (set.size === 0) {
      return Array.from({ length: 24 }, (_, i) =>
        String(i).padStart(2, "0")
      );
    }

    return Array.from(set).sort((a, b) => Number(a) - Number(b));
  }, [horariosBase]);

  const setHora = (key, hh) => {
    onChange({
      ...(value || {}),
      [key]: hh || "",
    });
  };

  return (
    <div className="mb-5 bg-zinc-50 p-4 rounded-lg border border-black">
      <p className="font-semibold mb-3">Horario especial de atención</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">
            Hora de apertura
          </label>
          <select
            value={haH}
            onChange={(e) => setHora("haH", e.target.value)}
            className="border border-black p-2 rounded w-full bg-white"
          >
            <option value="">HH</option>
            {horasOpciones.map((hh) => (
              <option key={hh} value={hh}>
                {hh}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            Hora de cierre
          </label>
          <select
            value={hcH}
            onChange={(e) => setHora("hcH", e.target.value)}
            className="border border-black p-2 rounded w-full bg-white"
          >
            <option value="">HH</option>
            {horasOpciones.map((hh) => (
              <option key={hh} value={hh}>
                {hh}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-700">
        <span className="font-semibold">Horario definido:</span>{" "}
        {haH && hcH ? `${haH}:00 – ${hcH}:00` : "—"}
      </p>
    </div>
  );
}
