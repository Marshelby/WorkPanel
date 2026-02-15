import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import CortesModal from "./modales/CortesModal";

export default function TiposCortesConfigCard({
  barberiaId,
}) {
  const [tiposCortes, setTiposCortes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // 🔹 Función reutilizable para refrescar
  const fetchCortes = useCallback(async () => {
    if (!barberiaId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("v_tipos_corte")
      .select("*")
      .eq("barberia_id", barberiaId)
      .order("precio", { ascending: true });

    if (error) {
      console.error("Error cargando tipos de corte:", error);
      setTiposCortes([]);
    } else {
      setTiposCortes(data || []);
    }

    setLoading(false);
  }, [barberiaId]);

  // 🔹 Cargar al montar
  useEffect(() => {
    fetchCortes();
  }, [fetchCortes]);

  return (
    <>
      <div
        className="
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
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-zinc-100 text-xl">
              ✂️
            </div>

            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Tipos de cortes
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Servicios activos configurados en tu barbería
              </p>
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
            ✏️ Haz click para hacer un cambio
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
                  ${Number(corte.precio || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div
          className="
            mt-8 pt-6
            border-t border-zinc-200/60
            text-sm text-zinc-500
          "
        >
          Puedes editar, agregar o desactivar servicios desde el botón superior.
        </div>
      </div>

      {/* MODAL */}
      <CortesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        cortes={tiposCortes}
        barberiaId={barberiaId}
        onUpdated={fetchCortes}   // 🔥 REFRESH AUTOMÁTICO
      />
    </>
  );
}
