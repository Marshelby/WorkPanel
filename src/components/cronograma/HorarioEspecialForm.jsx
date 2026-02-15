import { useMemo } from "react";

export default function HorarioEspecialForm({
  value,
  onChange,
  horariosBase = [],
}) {
  // Maneja horas y minutos
  const haH = value?.haH ?? "";
  const haM = value?.haM ?? "00";

  const hcH = value?.hcH ?? "";
  const hcM = value?.hcM ?? "00";

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

  const minutosOpciones = ["00", "15", "30", "45"];

  const setHora = (key, val) => {
    onChange({
      ...(value || {}),
      [key]: val || "",
    });
  };

  return (
    <div className="mb-5 bg-zinc-50 p-4 rounded-lg border border-black">
      <p className="font-semibold mb-3">Horario especial de atención</p>

      <div className="grid grid-cols-2 gap-6">
        {/* APERTURA */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Hora de apertura
          </label>

          <div className="flex gap-2">
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

            <select
              value={haM}
              onChange={(e) => setHora("haM", e.target.value)}
              className="border border-black p-2 rounded w-full bg-white"
            >
              {minutosOpciones.map((mm) => (
                <option key={mm} value={mm}>
                  {mm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CIERRE */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Hora de cierre
          </label>

          <div className="flex gap-2">
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

            <select
              value={hcM}
              onChange={(e) => setHora("hcM", e.target.value)}
              className="border border-black p-2 rounded w-full bg-white"
            >
              {minutosOpciones.map((mm) => (
                <option key={mm} value={mm}>
                  {mm}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-700">
        <span className="font-semibold">Horario definido:</span>{" "}
        {haH && hcH ? `${haH}:${haM} – ${hcH}:${hcM}` : "—"}
      </p>
    </div>
  );
}
