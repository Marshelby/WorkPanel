import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import InfoNegocioModal from "./modales/InfoNegocioModal";

export default function InformacionNegocio({ barberiaId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchBarberia = async () => {
    if (!barberiaId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("v_barberias")
      .select("*")
      .eq("id", barberiaId)
      .maybeSingle();

    if (error) {
      console.error("Error cargando barbería:", error);
      setData(null);
    } else {
      setData(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBarberia();
  }, [barberiaId]);

  const mostrarSuccess = (mensaje) => {
    setSuccessMsg(mensaje);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const handleSuccess = async (mensaje = "Cambio realizado correctamente.") => {
    await fetchBarberia();
    mostrarSuccess(mensaje);
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleString("es-CL");
  };

  if (!data && !loading) return null;

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
        {/* TOAST */}
        {successMsg && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
            {successMsg}
          </div>
        )}

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
              🏢
            </div>

            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Información del negocio
              </h2>

              {/* 👇 SOLO ESTO SE AGREGÓ */}
              <p className="text-sm text-zinc-500 mt-1">
                Última actualización:{" "}
                <span className="font-medium text-zinc-700">
                  {formatFecha(data?.updated_at)}
                </span>
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
            ✏️  Haz click para hacer un cambio
          </button>
        </div>

        {/* GRID INFO (MISMO QUE TENÍAS) */}
        {loading ? (
          <div className="text-sm text-zinc-500">
            Cargando información...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Nombre empresa
              </div>
              <div className="text-lg font-semibold text-zinc-900 tracking-tight">
                {data?.nombre}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Teléfono administrador
              </div>
              <div className="text-lg font-semibold text-zinc-900 tracking-tight">
                {data?.whatsapp_principal}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Plan
              </div>
              <div className="text-lg font-semibold text-zinc-900 tracking-tight capitalize">
                {data?.plan}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Bloques agenda
              </div>
              <div className="text-lg font-semibold text-zinc-900 tracking-tight">
                {data?.bloques_agenda} min
              </div>
            </div>

            <div className="space-y-3 sm:col-span-3">
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Ubicación
              </div>
              <div className="text-lg font-semibold text-zinc-900 tracking-tight">
                {data?.ubicacion}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER (IGUAL) */}
        <div
          className="
            mt-10 pt-6
            border-t border-zinc-200/60
            text-sm text-zinc-500
          "
        >
          Estos datos son administrados por el sistema.
          <span className="font-medium text-zinc-700 ml-1">
            Si necesitas modificarlos, puedes solicitar un cambio.
          </span>
        </div>
      </div>

      {/* MODAL */}
      <InfoNegocioModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        barberiaId={barberiaId}
        dataActual={data}
        onSuccess={handleSuccess}
      />
    </>
  );
}
