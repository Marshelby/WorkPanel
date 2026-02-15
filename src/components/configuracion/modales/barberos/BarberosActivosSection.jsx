import { useState, useEffect } from "react";

export default function BarberosActivosSection({
  barberos = [],
  loadingId,
  onRequestAccion,
}) {
  const [editandoId, setEditandoId] = useState(null);
  const [porcentajeLocal, setPorcentajeLocal] = useState("");

  if (!barberos.length) return null;

  const abrirEditor = (barbero) => {
    setEditandoId(barbero.id);
    setPorcentajeLocal(barbero.porcentaje_ganancia);
  };

  const cerrarEditor = () => {
    setEditandoId(null);
    setPorcentajeLocal("");
  };

  return (
    <div className="space-y-4 mb-6">
      {barberos.map((b) => {
        const estaEditando = editandoId === b.id;

        return (
          <div
            key={b.id}
            className="border rounded-xl px-4 py-4 transition hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-zinc-900">
                  {b.nombre}
                </p>
                <p className="text-sm text-zinc-500">
                  Comisión: {b.porcentaje_ganancia}%{" "}
                  {b.telefono && ` • ${b.telefono}`}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={loadingId}
                  onClick={() => abrirEditor(b)}
                  className="text-xs px-3 py-1 rounded-lg bg-zinc-100 hover:bg-black hover:text-white transition disabled:opacity-40"
                >
                  Cambiar %
                </button>

                <button
                  disabled={loadingId}
                  onClick={() => {
                    cerrarEditor();
                    onRequestAccion({
                      tipo: "desactivar",
                      barbero: b,
                    });
                  }}
                  className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition disabled:opacity-40"
                >
                  Desactivar
                </button>
              </div>
            </div>

            {/* EDITOR */}
            {estaEditando && (
              <div className="mt-4 space-y-3">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={porcentajeLocal}
                  onChange={(e) =>
                    setPorcentajeLocal(e.target.value.slice(0, 3))
                  }
                  className="w-full px-4 py-2 border rounded-lg border-zinc-300"
                />

                <div className="flex gap-3">
                  <button
                    disabled={loadingId === b.id}
                    onClick={() => {
                      onRequestAccion({
                        tipo: "cambiar_porcentaje",
                        barbero: b,
                        nuevoPorcentaje: porcentajeLocal,
                      });
                      cerrarEditor(); // 🔥 cierre automático
                    }}
                    className="text-xs px-4 py-2 bg-black text-white rounded-lg disabled:opacity-40"
                  >
                    Confirmar cambio
                  </button>

                  <button
                    onClick={cerrarEditor}
                    className="text-xs px-4 py-2 border rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
