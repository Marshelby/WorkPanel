import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function ModalEliminarCorte({
  corteId,
  onClose,
  onActualizado,
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     Cerrar con ESC
  ========================= */
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  async function confirmar() {
    setError("");

    if (!pin) {
      setError("Debe ingresar el PIN.");
      return;
    }

    setLoading(true);

    const { error: rpcError } = await supabase.rpc(
      "rpc_eliminar_corte",
      {
        p_corte_id: corteId,
        p_pin: pin,
      }
    );

    if (rpcError) {
      setError(rpcError.message);
      setLoading(false);
      return;
    }

    if (onActualizado) onActualizado();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}   /* CLICK FUERA */
    >
      <div
        className="bg-white p-6 rounded w-[320px] border border-black"
        onClick={(e) => e.stopPropagation()}  /* EVITA cerrar si clic dentro */
      >
        <h3 className="font-semibold mb-4 text-center">
          Confirmar eliminación
        </h3>

        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full border border-black p-2 rounded mb-3"
          autoFocus
        />

        {error && (
          <div className="text-red-600 text-sm mb-3">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-black px-4 py-1 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={confirmar}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
