import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function useInfoNegocio({ barberiaId, onSuccess }) {
  const [pendingField, setPendingField] = useState(null);
  const [pendingValue, setPendingValue] = useState("");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* =========================
     Solicitar guardado
  ========================= */

  const requestSave = (field, value) => {
    if (!barberiaId) return;

    setPendingField(field);
    setPendingValue(value);
    setErrorMsg("");
    setPinModalOpen(true);
  };

  /* =========================
     Confirmar con PIN
  ========================= */

  const confirmSave = async (pin) => {
    if (!barberiaId || !pendingField) return;

    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.rpc("rpc_actualizar_barberia", {
      p_barberia_id: barberiaId,
      p_campo: pendingField,
      p_valor: String(pendingValue),
      p_pin: pin,
    });

    setLoading(false);

    if (error) {
      console.error("Error RPC:", error);
      setErrorMsg(error.message || "Error al actualizar.");
      return;
    }

    // Éxito
    setPinModalOpen(false);
    setPendingField(null);
    setPendingValue("");

    if (onSuccess) {
      onSuccess("Cambio guardado correctamente.");
    }
  };

  return {
    requestSave,
    confirmSave,
    pinModalOpen,
    setPinModalOpen,
    loading,
    errorMsg,
  };
}
