import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DetalleReservaModal({
  visible,
  reserva,
  onClose,
}) {
  const [estadoFinal, setEstadoFinal] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmandoBorrar, setConfirmandoBorrar] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!visible || !reserva) return null;

  const handleGuardar = async () => {
    if (!estadoFinal) return;

    setLoading(true);

    const { error } = await supabase.rpc("rpc_gestionar_reserva", {
      p_agenda_id: reserva.id,
      p_accion: "estado_final",
      p_estado_final: estadoFinal,
    });

    setLoading(false);

    if (!error) {
      onClose();
      window.location.reload();
    }
  };

  const confirmarBorrado = async () => {
    setLoading(true);

    const { error } = await supabase.rpc("rpc_gestionar_reserva", {
      p_agenda_id: reserva.id,
      p_accion: "borrar",
    });

    setLoading(false);

    if (!error) {
      onClose();
      window.location.reload();
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-blue-900 to-blue-800 text-white 
                     w-[520px] max-w-[95vw] rounded-2xl 
                     shadow-[0_25px_60px_rgba(0,0,0,0.4)] 
                     border border-blue-700"
        >
          {/* HEADER */}
          <div className="px-6 py-5 border-b border-blue-700 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">
                Detalle de Reserva
              </h2>

              <p className="text-base text-blue-200 mt-2 font-semibold">
                {reserva.fecha} · {reserva.hora.slice(0, 5)}
              </p>

              <p className="text-base font-semibold text-blue-100 mt-1">
                💈 Barbero: {reserva.barbero_nombre || "-"}
              </p>
            </div>

            <button
              onClick={() => setConfirmandoBorrar(true)}
              className="text-red-400 hover:text-red-300 text-sm font-semibold transition"
            >
              🗑 Borrar
            </button>
          </div>

          {/* CONTENIDO */}
          <div className="px-6 py-6 space-y-6">

            {/* NOMBRE CLIENTE */}
            <div className="space-y-2">
              <span className="inline-block bg-white text-blue-900 px-3 py-1 rounded-full text-xs font-semibold">
                Nombre cliente
              </span>

              <div className="w-full bg-white border border-blue-600 rounded-full px-6 py-3 text-sm font-semibold text-black">
                {reserva.nombre_cliente}
              </div>
            </div>

            {/* TELÉFONO */}
            <div className="space-y-2">
              <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Teléfono
              </span>

              <div className="w-full bg-white border border-blue-600 rounded-full px-6 py-3 text-sm font-semibold text-black">
                {reserva.telefono_cliente}
              </div>
            </div>

            {/* SERVICIO */}
            <div className="space-y-2">
              <span className="inline-block bg-white text-blue-900 px-3 py-1 rounded-full text-xs font-semibold">
                Servicio
              </span>

              <div className="w-full bg-white border border-blue-600 rounded-full px-6 py-3 text-sm font-semibold text-black">
                {reserva.servicio}
              </div>
            </div>

            {/* ESTADO */}
            <div className="border-t border-blue-700 pt-6">
              <p className="text-base font-semibold mb-4">
                ¿Vino el cliente?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setEstadoFinal("si_vino")}
                  className={`flex-1 py-3 rounded-full text-sm font-semibold transition ${
                    estadoFinal === "si_vino"
                      ? "bg-green-500 text-white"
                      : "bg-green-900/40 text-green-300 hover:bg-green-700"
                  }`}
                >
                  ✅ Sí vino
                </button>

                <button
                  onClick={() => setEstadoFinal("no_vino")}
                  className={`flex-1 py-3 rounded-full text-sm font-semibold transition ${
                    estadoFinal === "no_vino"
                      ? "bg-red-500 text-white"
                      : "bg-red-900/40 text-red-300 hover:bg-red-700"
                  }`}
                >
                  ❌ No vino
                </button>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-blue-700 flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-white rounded-full hover:bg-white hover:text-blue-900 transition"
            >
              Cerrar
            </button>

            <button
              onClick={handleGuardar}
              disabled={!estadoFinal || loading}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition transform ${
                estadoFinal
                  ? "bg-white text-blue-900 hover:bg-blue-100 hover:scale-105 active:scale-95"
                  : "bg-blue-700 text-blue-300 cursor-not-allowed"
              }`}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL CONFIRMAR BORRADO */}
      {confirmandoBorrar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[60]">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white 
                          w-[400px] rounded-2xl 
                          shadow-[0_25px_60px_rgba(0,0,0,0.4)] 
                          border border-blue-700 p-6 space-y-6">

            <h3 className="text-lg font-bold text-center">
              ¿Estás seguro de borrar la agenda?
            </h3>

            <p className="text-sm text-blue-200 text-center">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex gap-4 pt-2">
              <button
                onClick={confirmarBorrado}
                className="flex-1 py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Sí, borrar
              </button>

              <button
                onClick={() => setConfirmandoBorrar(false)}
                className="flex-1 py-3 rounded-full border border-white font-semibold hover:bg-white hover:text-blue-900 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
