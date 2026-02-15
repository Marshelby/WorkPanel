import { useState } from "react";
import { supabase } from "../lib/supabase";

export function useTiposCorte(barberiaId, onSuccess) {

  const [loading, setLoading] = useState(false);

  const validarPin = async (pinIngresado) => {
    const { data, error } = await supabase
      .from("barberias")
      .select("pin_administrador")
      .eq("id", barberiaId)
      .single();

    if (error || !data) {
      throw new Error("Error validando PIN");
    }

    if (data.pin_administrador !== pinIngresado) {
      throw new Error("PIN incorrecto");
    }

    return true;
  };

  const crearCorte = async ({ nombre, precio, pin }) => {
    try {
      setLoading(true);

      await validarPin(pin);

      const { error } = await supabase.rpc(
        "rpc_crear_tipo_corte",
        {
          p_barberia_id: barberiaId,
          p_nombre: nombre,
          p_precio: Number(precio)
        }
      );

      if (error) throw error;

      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  const editarCorte = async ({ corteId, nombre, precio, pin }) => {
    try {
      setLoading(true);

      await validarPin(pin);

      const { error } = await supabase.rpc(
        "rpc_editar_tipo_corte",
        {
          p_barberia_id: barberiaId,
          p_corte_id: corteId,
          p_nombre: nombre,
          p_precio: Number(precio)
        }
      );

      if (error) throw error;

      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  const desactivarCorte = async ({ corteId, pin }) => {
    try {
      setLoading(true);

      await validarPin(pin);

      const { error } = await supabase.rpc(
        "rpc_desactivar_tipo_corte",
        {
          p_barberia_id: barberiaId,
          p_corte_id: corteId
        }
      );

      if (error) throw error;

      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    crearCorte,
    editarCorte,
    desactivarCorte
  };
}
