import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import BarberosModal from "./modales/BarberosModal";

export default function BarberosConfigCard({ barberiaId }) {
  const [barberos, setBarberos] = useState([]);
  const [barberosOff, setBarberosOff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  /* =========================
     FETCH BARBEROS
  ========================= */

  const fetchBarberos = async () => {
    if (!barberiaId) return;

    setLoading(true);

    const { data: activos, error: errorActivos } = await supabase
      .from("v_barberos")
      .select("*")
      .eq("barberia_id", barberiaId)
      .eq("activo", true)
      .order("nombre", { ascending: true });

    const { data: inactivos, error: errorInactivos } = await supabase
      .from("v_barberos_off")
      .select("*")
      .eq("barberia_id", barberiaId)
      .order("nombre", { ascending: true });

    if (errorActivos || errorInactivos) {
      console.error("Error cargando barberos:", errorActivos || errorInactivos);
      setBarberos([]);
      setBarberosOff([]);
    } else {
      setBarberos(activos || []);
      setBarberosOff(inactivos || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBarberos();
  }, [barberiaId]);

  /* =========================
     ÚLTIMA ACTUALIZACIÓN
  ========================= */

  const formatFecha = (fecha) => {
    if (!fecha) return null;
    return new Date(fecha).toLocaleString("es-CL");
  };

  const obtenerUltimaActualizacion = () => {
    const todos = [...barberos, ...barberosOff];
    if (!todos.length) return null;

    const fechas = todos
      .map((b) => b.updated_at)
      .filter(Boolean)
      .map((f) => new Date(f).getTime());

    if (!fechas.length) return null;

    return new Date(Math.max(...fechas));
  };

  const ultimaActualizacion = obtenerUltimaActualizacion();

  /* =========================
     TOAST SUCCESS GLOBAL
  ========================= */

  const mostrarSuccess = (mensaje) => {
    setSuccessMsg(mensaje);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const handleSuccess = async (mensaje = "Cambio realizado correctamente.") => {
    await fetchBarberos();
    mostrarSuccess(mensaje);
  };

  return (
    <>
      <div className="relative bg-white border border-zinc-200/70 rounded-2xl p-9 shadow-sm hover:shadow-md transition-all duration-200">
        
        {/* TOAST */}
        {successMsg && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
            {successMsg}
          </div>
        )}

        {/* HEADER */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-zinc-100 text-xl">
              💈
            </div>

            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Barberos
              </h2>

              {/* 👇 SOLO ESTO SE AGREGÓ */}
              {ultimaActualizacion && (
                <p className="text-sm text-zinc-500 mt-1">
                  Última modificación:{" "}
                  <span className="font-medium text-zinc-700">
                    {formatFecha(ultimaActualizacion)}
                  </span>
                </p>
              )}

              {!ultimaActualizacion && (
                <p className="text-sm text-zinc-500 mt-1">
                  Barberos activos registrados en tu Panel
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="text-sm px-4 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-black hover:text-white transition-all font-medium"
          >
            ✏️ Haz click para hacer un cambio
          </button>
        </div>

        {/* CONTENIDO */}
        {loading ? (
          <div className="text-sm text-zinc-500">
            Cargando barberos...
          </div>
        ) : barberos.length === 0 ? (
          <div className="text-sm text-zinc-500">
            No hay barberos registrados.
          </div>
        ) : (
          <div className="space-y-4">
            {barberos.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-200/60 hover:bg-white hover:shadow-md transition"
              >
                <div className="font-medium text-zinc-900">
                  {b.nombre}
                </div>

                <div className="px-3 py-1 rounded-full bg-zinc-900 text-white text-sm font-semibold">
                  {b.porcentaje_ganancia}%
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-zinc-200/60 text-sm text-zinc-500">
          Las comisiones actuales están configuradas por el sistema.
        </div>
      </div>

      <BarberosModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        barberos={barberos}
        barberosOff={barberosOff}
        barberiaId={barberiaId}
        onSuccess={handleSuccess}
      />
    </>
  );
}
