import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

/* =========================
   HELPERS
========================= */
function normalizarHora(time) {
  if (!time) return null;
  return time.substring(0, 5);
}

export default function HorarioEstablecido({
  barberoId,
  barberiaId,
  fecha,
}) {
  const [horario, setHorario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!barberoId || !barberiaId || !fecha) return;

    const cargarHorario = async () => {
      setCargando(true);

      /* =========================
         1️⃣ HORARIO INDIVIDUAL
      ========================= */
      const { data: horarioGuardado } = await supabase
        .from("horarios_barberos")
        .select("*")
        .eq("barbero_id", barberoId)
        .eq("fecha", fecha)
        .maybeSingle();

      if (horarioGuardado) {
        setHorario({
          presente: horarioGuardado.presente,
          entrada: normalizarHora(horarioGuardado.hora_entrada),
          salidaColacion: normalizarHora(
            horarioGuardado.hora_salida_colacion
          ),
          regresoColacion: normalizarHora(
            horarioGuardado.hora_regreso_colacion
          ),
          salida: normalizarHora(horarioGuardado.hora_salida),
          origen: "individual",
        });

        setCargando(false);
        return;
      }

      /* =========================
         2️⃣ HORARIO LOCAL (BASE O CRONOGRAMA)
      ========================= */
      const { data: horarioLocal } = await supabase
        .from("v_horario_local")
        .select("*")
        .eq("barberia_id", barberiaId)
        .eq("fecha", fecha)
        .single();

      if (!horarioLocal) {
        setHorario(null);
        setCargando(false);
        return;
      }

      if (!horarioLocal.abierto) {
        setHorario({
          presente: false,
          entrada: null,
          salidaColacion: null,
          regresoColacion: null,
          salida: null,
          origen: "cerrado",
        });

        setCargando(false);
        return;
      }

      setHorario({
        presente: true,
        entrada: normalizarHora(horarioLocal.hora_apertura),
        salidaColacion: null,
        regresoColacion: null,
        salida: normalizarHora(horarioLocal.hora_cierre),
        origen: horarioLocal.origen, // "base" o "cronograma"
      });

      setCargando(false);
    };

    cargarHorario();
  }, [barberoId, barberiaId, fecha]);

  /* =========================
     UI
  ========================= */

  if (cargando) {
    return (
      <div className="text-sm text-gray-500">
        Cargando horario...
      </div>
    );
  }

  if (!horario) {
    return (
      <div className="text-sm text-gray-500">
        No hay horario configurado.
      </div>
    );
  }

  if (!horario.presente) {
    return (
      <div className="text-sm font-semibold text-red-600">
        Local cerrado este día.
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-black pb-2 mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide">
          Horario establecido
          {horario.origen === "base" && (
            <span className="ml-2 text-xs text-gray-500">
              (Horario base)
            </span>
          )}
          {horario.origen === "cronograma" && (
            <span className="ml-2 text-xs text-blue-600">
              (Horario especial)
            </span>
          )}
          {horario.origen === "individual" && (
            <span className="ml-2 text-xs text-green-600">
              (Horario individual)
            </span>
          )}
        </h3>
      </div>

      <div className="space-y-6 text-sm font-medium">

        <div className="flex justify-between border-b pb-2">
          <span className="text-green-700">Entrada</span>
          <span>{horario.entrada || "-"}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-yellow-700">
            Salida colación
          </span>
          <span>{horario.salidaColacion || "-"}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-green-700">
            Regreso colación
          </span>
          <span>{horario.regresoColacion || "-"}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-red-700">Salida</span>
          <span>{horario.salida || "-"}</span>
        </div>

      </div>
    </div>
  );
}
