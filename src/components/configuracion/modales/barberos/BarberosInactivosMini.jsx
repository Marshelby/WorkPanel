import { useEffect, useRef, useState } from "react";

export default function BarberosInactivosSection({
  barberosOff = [],
  loadingId,
  onRequestAccion,
}) {
  const [open, setOpen] = useState(false);
  const [accionLocal, setAccionLocal] = useState(null);

  const containerRef = useRef(null);
  const accionRef = useRef(null);

  /* =========================
     SCROLL ACORDEON
  ========================= */

  useEffect(() => {
    if (open && containerRef.current) {
      setTimeout(() => {
        containerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    }
  }, [open]);

  /* =========================
     SCROLL ACCION LOCAL
  ========================= */

  useEffect(() => {
    if (accionLocal && accionRef.current) {
      setTimeout(() => {
        accionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 120);
    }
  }, [accionLocal]);

  /* =========================
     RETURN DESPUÉS DE HOOKS
  ========================= */

  if (!barberosOff.length) return null;

  return (
    <div ref={containerRef} className="mt-8 border-t pt-6">
      {/* HEADER */}
      <button
        onClick={() => {
          setOpen((prev) => !prev);
          setAccionLocal(null);
        }}
        className="w-full flex justify-between items-center text-sm font-semibold text-zinc-600 hover:text-black transition"
      >
        <span>DESACTIVADOS ({barberosOff.length})</span>
        <span
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {/* CONTENIDO ACORDEON */}
      <div
        className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${open ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"}
        `}
      >
        <div className="grid grid-cols-2 gap-3">
          {barberosOff.map((b) => {
            const confirmar = accionLocal?.id === b.id;

            return (
              <div
                key={b.id}
                className="border rounded-lg p-3 bg-zinc-50 text-xs flex flex-col transition-all duration-300 hover:shadow-md"
              >
                {/* INFO */}
                <div>
                  <p className="font-semibold text-zinc-800 truncate">
                    {b.nombre}
                  </p>
                  <p className="text-zinc-500">
                    {b.porcentaje_ganancia}%
                  </p>
                </div>

                {/* BOTONES */}
                {!confirmar && (
                  <div className="flex justify-between gap-2 mt-3">
                    <button
                      disabled={loadingId === b.id}
                      onClick={() =>
                        setAccionLocal({
                          tipo: "activar",
                          id: b.id,
                        })
                      }
                      className="flex-1 py-1 rounded-md bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition-all duration-200 hover:scale-105"
                    >
                      Activar
                    </button>

                    <button
                      disabled={loadingId === b.id}
                      onClick={() =>
                        setAccionLocal({
                          tipo: "eliminar",
                          id: b.id,
                        })
                      }
                      className="flex-1 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition-all duration-200 hover:scale-105"
                    >
                      Eliminar
                    </button>
                  </div>
                )}

                {/* CONFIRMACION */}
                {confirmar && (
                  <div
                    ref={accionRef}
                    className="mt-3 border-t pt-3 animate-slideFade"
                  >
                    {accionLocal.tipo === "activar" ? (
                      <p className="mb-3 text-zinc-700">
                        ¿Deseas reactivar a{" "}
                        <strong>{b.nombre}</strong>?
                      </p>
                    ) : (
                      <p className="mb-3 text-red-600">
                        ¿Eliminar definitivamente a{" "}
                        <strong>{b.nombre}</strong>?
                        <br />
                        <span className="text-[11px]">
                          Esta acción es irreversible.
                        </span>
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        disabled={loadingId === b.id}
                        onClick={() => {
                          onRequestAccion({
                            tipo:
                              accionLocal.tipo === "activar"
                                ? "activar"
                                : "eliminar_definitivo",
                            barbero: b,
                          });

                          setAccionLocal(null);
                        }}
                        className="flex-1 py-1 bg-black text-white rounded-md transition-all duration-200 hover:scale-105"
                      >
                        Confirmar
                      </button>

                      <button
                        onClick={() => setAccionLocal(null)}
                        className="flex-1 py-1 border rounded-md hover:bg-zinc-200 transition-all duration-200"
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
      </div>

      {/* 🔥 ANIMACION PRO */}
      <style>
        {`
          @keyframes slideFade {
            0% {
              opacity: 0;
              transform: translateY(-8px) scale(0.98);
            }
            100% {
              opacity: 1;
              transform: translateY(0px) scale(1);
            }
          }

          .animate-slideFade {
            animation: slideFade 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
