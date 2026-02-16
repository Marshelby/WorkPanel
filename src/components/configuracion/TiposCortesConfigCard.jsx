import React, { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import CortesModal from "./modales/CortesModal";

export default function TiposCortesConfigCard({
  barberiaId,
}) {
  const [tiposCortes, setTiposCortes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  /* =========================
     FETCH
  ========================= */

  const fetchCortes = useCallback(async () => {
    if (!barberiaId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("v_tipos_corte")
      .select("*")
      .eq("barberia_id", barberiaId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error cargando tipos de corte:", error);
      setTiposCortes([]);
    } else {
      setTiposCortes(data || []);
    }

    setLoading(false);
  }, [barberiaId]);

  useEffect(() => {
    fetchCortes();
  }, [fetchCortes]);

  /* =========================
     ÚLTIMA ACTUALIZACIÓN
  ========================= */

  const formatFecha = (fecha) => {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleString("es-CL");
  };

  const ultimaActualizacion = useMemo(() => {
    if (!tiposCortes.length) return null;

    const fechas = tiposCortes
      .map((c) => c.updated_at || c.created_at)
      .filter(Boolean)
      .map((f) => new Date(f).getTime());

    if (!fechas.length) return null;

    return new Date(Math.max(...fechas));
  }, [tiposCortes]);

  return (
    <>
      <div
        className="
          relative
          bg-white
          border border-zinc-200/70
          rounded-2xl
          p-9
          shadow-sm
          hover:shadow-md
          transition-all duration-200
        "
      >
        {/* HEADER */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              className="
                w-11 h-11
                flex items-center justify-center
                rounded-xl
                bg-zinc-100
                text-xl
              "
            >
              ✂️
            </div>

            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Tipos de cortes
              </h2>

              {ultimaActualizacion && (
                <p className="text-sm text-zinc-500 mt-1">
                  Última actualización:{" "}
                  <span className="font-medium text-zinc-700">
                    {formatFecha(ultimaActualizacion)}
                  </span>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="
              text-sm
              px-4 py-2
              rounded-lg
              border border-zinc-200
              bg-white
              text-zinc-600
              hover:bg-zinc-50
              hover:text-zinc-900
              transition-all
              font-medium
            "
          >
            ✏️  Haz click para hacer un cambio
          </button>
        </div>

        {/* CONTENIDO */}
        {loading ? (
          <div className="text-sm text-zinc-500">
            Cargando tipos de corte...
          </div>
        ) : tiposCortes.length === 0 ? (
          <div className="text-sm text-zinc-500">
            No hay tipos de corte registrados.
          </div>
        ) : (
          <div className="space-y-4">
            {tiposCortes.map((corte) => (
              <div
                key={corte.id}
                className="
                  flex items-center justify-between
                  px-5 py-4
                  rounded-xl
                  bg-zinc-50
                  border border-zinc-200/60
                  hover:bg-white
                  transition
                "
              >
                <div className="font-medium text-zinc-900">
                  {corte.nombre}
                </div>

                <div
                  className="
                    px-3 py-1
                    rounded-full
                    bg-zinc-900
                    text-white
                    text-sm
                    font-semibold
                  "
                >
                  ${Number(corte.precio || 0).toLocaleString("es-CL")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div
          className="
            mt-10 pt-6
            border-t border-zinc-200/60
            text-sm text-zinc-500
          "
        >
          Estos servicios son administrados por el sistema.
          <span className="font-medium text-zinc-700 ml-1">
            Si necesitas modificarlos, puedes solicitar un cambio.
          </span>
        </div>
      </div>

      {/* MODAL */}
      <CortesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        cortes={tiposCortes}
        barberiaId={barberiaId}
        onUpdated={fetchCortes}
      />
    </>
  );
}
