import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

/* =========================
   HELPERS
========================= */

function normalizarHora(time) {
  if (!time) return "";
  return time.substring(0, 5);
}

function horaToMin(h) {
  if (!h) return null;
  const [hh, mm] = h.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return hh * 60 + mm;
}

function minToHHMM(min) {
  const hh = String(Math.floor(min / 60)).padStart(2, "0");
  const mm = String(min % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function buildBloques(apertura, cierre, bloqueMin) {
  const a = horaToMin(apertura);
  const c = horaToMin(cierre);
  if (a == null || c == null) return [];

  const lista = [];
  let actual = a;

  while (actual <= c) {
    lista.push(minToHHMM(actual));
    actual += bloqueMin;
  }

  if (!lista.includes(cierre)) {
    lista.push(cierre);
  }

  return lista;
}

/* =========================
   HOOK
========================= */

export function useHorarioBarbero({
  barbero,
  fecha,
  bloqueado = false,
}) {
  const barberoId = barbero?.id;
  const barberiaId = barbero?.barberia_id;

  const [presente, setPresente] = useState(true);
  const [estadoGuardado, setEstadoGuardado] = useState(true);

  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalidaColacion, setHoraSalidaColacion] = useState("");
  const [horaRegresoColacion, setHoraRegresoColacion] = useState("");
  const [horaSalida, setHoraSalida] = useState("");

  const [horasDisponiblesHH, setHorasDisponiblesHH] = useState([]);

  const [limiteApertura, setLimiteApertura] = useState("");
  const [limiteCierre, setLimiteCierre] = useState("");
  const [bloqueAgenda, setBloqueAgenda] = useState(60);

  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [errorGeneral, setErrorGeneral] = useState("");
  const [errorColacion, setErrorColacion] = useState("");

  useEffect(() => {
    // 🔥 NUNCA salimos del hook
    // Solo reseteamos si no hay datos

    if (!barberoId || !barberiaId || !fecha || bloqueado) {
      setHorasDisponiblesHH([]);
      return;
    }

    const cargarDatos = async () => {
      setErrorGeneral("");
      setErrorColacion("");

      // 1️⃣ Bloques agenda
      const { data: barberiaData } = await supabase
        .from("barberias")
        .select("bloques_agenda")
        .eq("id", barberiaId)
        .maybeSingle();

      const bloqueMin = barberiaData?.bloques_agenda || 60;
      setBloqueAgenda(bloqueMin);

      // 2️⃣ Horario efectivo
      const { data: base } = await supabase
        .from("v_horario_local")
        .select("*")
        .eq("barberia_id", barberiaId)
        .eq("fecha", fecha)
        .maybeSingle();

      if (!base || !base.abierto) {
        setHorasDisponiblesHH([]);
        return;
      }

      const apertura = normalizarHora(base.hora_apertura);
      const cierre = normalizarHora(base.hora_cierre);

      setLimiteApertura(apertura);
      setLimiteCierre(cierre);

      const bloques = buildBloques(apertura, cierre, bloqueMin);
      setHorasDisponiblesHH(bloques);

      // 3️⃣ Leer guardado
      const { data: guardado } = await supabase
        .from("horarios_barberos")
        .select("*")
        .eq("barbero_id", barberoId)
        .eq("fecha", fecha)
        .maybeSingle();

      if (guardado) {
        setEstadoGuardado(guardado.presente);
        setPresente(guardado.presente);

        if (guardado.presente) {
          setHoraEntrada(normalizarHora(guardado.hora_entrada));
          setHoraSalidaColacion(normalizarHora(guardado.hora_salida_colacion));
          setHoraRegresoColacion(normalizarHora(guardado.hora_regreso_colacion));
          setHoraSalida(normalizarHora(guardado.hora_salida));
        } else {
          setHoraEntrada("");
          setHoraSalida("");
          setHoraSalidaColacion("");
          setHoraRegresoColacion("");
        }
      } else {
        setHoraEntrada(apertura);
        setHoraSalida(cierre);
      }
    };

    cargarDatos();
  }, [barberoId, barberiaId, fecha, bloqueado]);

  const esBloqueValido = (hhmm) => {
    if (!hhmm) return true;
    return horasDisponiblesHH.includes(hhmm);
  };

  const validarHorarios = () => {
    setErrorGeneral("");
    setErrorColacion("");

    if (!presente) return true;

    const entrada = horaToMin(horaEntrada);
    const salida = horaToMin(horaSalida);

    if (entrada == null || salida == null || entrada >= salida) {
      setErrorGeneral("Horario inválido");
      return false;
    }

    if (!esBloqueValido(horaEntrada) || !esBloqueValido(horaSalida)) {
      setErrorGeneral(
        `Las horas deben coincidir con bloques de ${bloqueAgenda} minutos`
      );
      return false;
    }

    if (horaSalidaColacion || horaRegresoColacion) {
      if (!horaSalidaColacion || !horaRegresoColacion) {
        setErrorColacion("Debe completar este campo");
        return false;
      }

      if (
        !esBloqueValido(horaSalidaColacion) ||
        !esBloqueValido(horaRegresoColacion)
      ) {
        setErrorGeneral(
          `Las horas deben coincidir con bloques de ${bloqueAgenda} minutos`
        );
        return false;
      }
    }

    return true;
  };

  const handleGuardar = async () => {
    if (bloqueado) return false;
    if (!validarHorarios()) return false;

    try {
      setLoading(true);

      const { error } = await supabase.rpc(
        "rpc_guardar_horario_barbero",
        {
          p_barberia_id: barberiaId,
          p_barbero_id: barberoId,
          p_fecha: fecha,
          p_presente: presente,
          p_hora_entrada: presente ? horaEntrada : null,
          p_hora_salida_colacion: presente ? horaSalidaColacion || null : null,
          p_hora_regreso_colacion: presente ? horaRegresoColacion || null : null,
          p_hora_salida: presente ? horaSalida : null,
        }
      );

      if (error) throw error;

      setEstadoGuardado(presente);
      setReloadKey((prev) => prev + 1);

      return true;
    } catch (err) {
      setErrorGeneral(err?.message || "Error al guardar");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    presente,
    setPresente,
    estadoGuardado,

    horaEntrada,
    setHoraEntrada,
    horaSalidaColacion,
    setHoraSalidaColacion,
    horaRegresoColacion,
    setHoraRegresoColacion,
    horaSalida,
    setHoraSalida,

    horasDisponiblesHH,

    errorGeneral,
    errorColacion,

    loading,
    reloadKey,

    handleGuardar,
  };
}
