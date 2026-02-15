import { useState } from "react";
import { supabase } from "../lib/supabase";

export function useHorarioSemanal(barberiaId) {

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const validarHoras = (hA, mA, hC, mC) => {

    if (!hA || !mA || !hC || !mC) {
      return "Debes completar hora apertura y cierre.";
    }

    const apertura = parseInt(hA) * 60 + parseInt(mA);
    const cierre = parseInt(hC) * 60 + parseInt(mC);

    if (apertura >= cierre) {
      return "El horario es inválido. La apertura debe ser menor al cierre.";
    }

    return null;
  };

  const actualizarHorario = async ({
    diaSemana,
    horaAperturaH,
    horaAperturaM,
    horaCierreH,
    horaCierreM,
    pinAdmin,
    cerrado = false,
  }) => {

    if (!pinAdmin) {
      setMensaje({
        tipo: "error",
        texto: "El PIN administrador es obligatorio.",
      });
      return false;
    }

    // =========================
    // SI ES DÍA CERRADO
    // =========================
    if (cerrado) {

      setLoading(true);
      setMensaje(null);

      const { error } = await supabase.rpc(
        "rpc_actualizar_horario_semanal",
        {
          p_barberia_id: barberiaId,
          p_dia_semana: diaSemana,
          p_hora_apertura: null,
          p_hora_cierre: null,
          p_pin_admin: pinAdmin,
          p_cerrado: true,
        }
      );

      setLoading(false);

      if (error) {
        setMensaje({
          tipo: "error",
          texto: error.message || "Error al cerrar el día.",
        });
        return false;
      }

      setMensaje({
        tipo: "success",
        texto: "Día marcado como cerrado correctamente.",
      });

      return true;
    }

    // =========================
    // VALIDACIÓN NORMAL
    // =========================
    const errorValidacion = validarHoras(
      horaAperturaH,
      horaAperturaM,
      horaCierreH,
      horaCierreM
    );

    if (errorValidacion) {
      setMensaje({ tipo: "error", texto: errorValidacion });
      return false;
    }

    const horaApertura = `${horaAperturaH}:${horaAperturaM}`;
    const horaCierre = `${horaCierreH}:${horaCierreM}`;

    setLoading(true);
    setMensaje(null);

    const { error } = await supabase.rpc(
      "rpc_actualizar_horario_semanal",
      {
        p_barberia_id: barberiaId,
        p_dia_semana: diaSemana,
        p_hora_apertura: horaApertura,
        p_hora_cierre: horaCierre,
        p_pin_admin: pinAdmin,
        p_cerrado: false,
      }
    );

    setLoading(false);

    if (error) {
      setMensaje({
        tipo: "error",
        texto: error.message || "Error al actualizar el horario.",
      });
      return false;
    }

    setMensaje({
      tipo: "success",
      texto: "Horario actualizado correctamente.",
    });

    return true;
  };

  const limpiarMensaje = () => {
    setMensaje(null);
  };

  return {
    actualizarHorario,
    mensaje,
    loading,
    limpiarMensaje,
  };
}
