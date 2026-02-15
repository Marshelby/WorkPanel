import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

export const ESTADOS = {
  NORMAL: "NORMAL",
  CERRADO: "CERRADO",
  HORARIO_ESPECIAL: "HORARIO_ESPECIAL",
};

export const ESTADO_LABEL = {
  NORMAL: "Normal",
  CERRADO: "Cierre total",
  HORARIO_ESPECIAL: "Horario especial",
};

export const ESTADO_DESC = {
  NORMAL: "Día normal según horarios base",
  CERRADO: "La barbería permanece cerrada todo el día",
  HORARIO_ESPECIAL: "Horario distinto al habitual",
};

function horaValida(haH, hcH) {
  if (!haH || !hcH) return false;
  return Number(hcH) > Number(haH);
}

export function useCronogramaDiaBarberia({
  fecha,
  barberiaId,
  cronogramaInicial,
  onSaved,
}) {
  const containerRef = useRef(null);

  const existeCronograma = useMemo(() => {
    if (!cronogramaInicial) return false;
    return (
      cronogramaInicial.local_cerrado || cronogramaInicial.horario_especial
    );
  }, [cronogramaInicial]);

  const [estado, setEstado] = useState(ESTADOS.NORMAL);
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorHorario, setErrorHorario] = useState("");
  const [errorRPC, setErrorRPC] = useState("");
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const [confirmarGuardarHorarioEspecial, setConfirmarGuardarHorarioEspecial] =
    useState(false);

  const [horarioEspecial, setHorarioEspecial] = useState({
    haH: "",
    haM: "00",
    hcH: "",
    hcM: "00",
  });

  useEffect(() => {
    setConfirmarBorrado(false);
    setConfirmarGuardarHorarioEspecial(false);
    setErrorRPC("");
    setErrorHorario("");

    if (!cronogramaInicial) {
      setEstado(ESTADOS.NORMAL);
      setMotivo("");
      setHorarioEspecial({ haH: "", haM: "00", hcH: "", hcM: "00" });
      return;
    }

    if (cronogramaInicial.local_cerrado) setEstado(ESTADOS.CERRADO);
    else if (cronogramaInicial.horario_especial) setEstado(ESTADOS.HORARIO_ESPECIAL);
    else setEstado(ESTADOS.NORMAL);

    setMotivo(cronogramaInicial.motivo || "");
  }, [cronogramaInicial]);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [estado]);

  useEffect(() => {
    setErrorHorario("");

    if (estado !== ESTADOS.HORARIO_ESPECIAL) return;

    const { haH, hcH } = horarioEspecial;

    if (!haH || !hcH) {
      setErrorHorario("Debes definir hora de apertura y cierre.");
      return;
    }

    if (!horaValida(haH, hcH)) {
      setErrorHorario("La hora de cierre debe ser posterior a la hora de apertura.");
    }
  }, [estado, horarioEspecial]);

  async function handleGuardar(force = false) {
    if (!barberiaId || !fecha) return;
    if (errorHorario) return;

    if (
      estado === ESTADOS.HORARIO_ESPECIAL &&
      !force &&
      !confirmarGuardarHorarioEspecial
    ) {
      setConfirmarGuardarHorarioEspecial(true);
      return;
    }

    setLoading(true);
    setErrorRPC("");

    const { error } = await supabase.rpc("rpc_upsert_cronograma_barberia_dia", {
      p_barberia_id: barberiaId,
      p_fecha: fecha,
      p_local_cerrado: estado === ESTADOS.CERRADO,
      p_horario_especial: estado === ESTADOS.HORARIO_ESPECIAL,
      p_hora_apertura:
        estado === ESTADOS.HORARIO_ESPECIAL
          ? `${horarioEspecial.haH}:${horarioEspecial.haM}:00`
          : null,
      p_hora_cierre:
        estado === ESTADOS.HORARIO_ESPECIAL
          ? `${horarioEspecial.hcH}:${horarioEspecial.hcM}:00`
          : null,
      p_motivo: motivo?.trim() || null,
    });

    setLoading(false);

    if (error) {
      setErrorRPC(error.message || "No se pudo guardar el cronograma.");
      return;
    }

    onSaved?.();
  }

  async function handleBorrar() {
    setLoading(true);
    setErrorRPC("");

    const { error } = await supabase.rpc("rpc_upsert_cronograma_barberia_dia", {
      p_barberia_id: barberiaId,
      p_fecha: fecha,
      p_local_cerrado: false,
      p_horario_especial: false,
      p_hora_apertura: null,
      p_hora_cierre: null,
      p_motivo: null,
    });

    setLoading(false);

    if (error) {
      setErrorRPC(error.message || "No se pudo borrar el cronograma.");
      return;
    }

    setConfirmarBorrado(false);
    onSaved?.();
  }

  return {
    containerRef,
    existeCronograma,
    estado,
    setEstado,
    motivo,
    setMotivo,
    horarioEspecial,
    setHorarioEspecial,
    errorHorario,
    errorRPC,
    loading,
    confirmarBorrado,
    setConfirmarBorrado,
    confirmarGuardarHorarioEspecial,
    setConfirmarGuardarHorarioEspecial,
    handleGuardar,
    handleBorrar,
  };
}
