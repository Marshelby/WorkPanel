import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import HorarioEstablecido from "./modal/HorarioEstablecido";

/* =========================
   HELPERS
========================= */

function normalizarHora(time) {
  if (!time) return "";
  return time.substring(0, 5);
}

function generarHoras(apertura, cierre) {
  if (!apertura || !cierre) return [];

  const inicio = parseInt(apertura.split(":")[0], 10);
  const fin = parseInt(cierre.split(":")[0], 10);

  const horas = [];
  for (let h = inicio; h <= fin; h++) {
    horas.push(`${String(h).padStart(2, "0")}:00`);
  }

  return horas;
}

function horaToNumber(h) {
  if (!h) return null;
  const [hh, mm] = h.split(":");
  return parseInt(hh) * 60 + parseInt(mm);
}

export default function ModalHorarioBarbero({
  barbero,
  fecha,
  modoIntegrado = false,
  bloqueado = false, // 🔥 NUEVO
}) {
  const [presente, setPresente] = useState(true);
  const [estadoGuardado, setEstadoGuardado] = useState(true);

  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalidaColacion, setHoraSalidaColacion] = useState("");
  const [horaRegresoColacion, setHoraRegresoColacion] = useState("");
  const [horaSalida, setHoraSalida] = useState("");

  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [errorGeneral, setErrorGeneral] = useState("");
  const [errorColacion, setErrorColacion] = useState("");

  /* =========================
     CARGA INICIAL
  ========================= */
  useEffect(() => {
    if (!barbero?.barberia_id || !fecha || bloqueado) {
      setHorasDisponibles([]);
      return;
    }

    const cargarDatos = async () => {

      /* 1️⃣ LEER HORARIO LOCAL */
      const { data: base } = await supabase
        .from("v_horario_local")
        .select("*")
        .eq("barberia_id", barbero.barberia_id)
        .eq("fecha", fecha)
        .maybeSingle();

      if (base && base.abierto) {
        const apertura = normalizarHora(base.hora_apertura);
        const cierre = normalizarHora(base.hora_cierre);

        setHorasDisponibles(generarHoras(apertura, cierre));
        setHoraEntrada(apertura);
        setHoraSalida(cierre);
      } else {
        setHorasDisponibles([]);
      }

      /* 2️⃣ CARGAR HORARIO INDIVIDUAL */
      const { data: guardado } = await supabase
        .from("horarios_barberos")
        .select("*")
        .eq("barbero_id", barbero.id)
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
        }
      }
    };

    cargarDatos();
  }, [barbero?.id, barbero?.barberia_id, fecha, bloqueado]);

  /* =========================
     VALIDACIÓN
  ========================= */

  const validarHorarios = () => {
    setErrorGeneral("");
    setErrorColacion("");

    if (!presente) return true;

    const entrada = horaToNumber(horaEntrada);
    const salida = horaToNumber(horaSalida);
    const salidaCol = horaToNumber(horaSalidaColacion);
    const regresoCol = horaToNumber(horaRegresoColacion);

    if (entrada >= salida) {
      setErrorGeneral("Horario inválido");
      return false;
    }

    if (salidaCol || regresoCol) {
      if (!salidaCol || !regresoCol) {
        setErrorColacion("Debe completar este campo");
        return false;
      }

      if (
        salidaCol <= entrada ||
        regresoCol <= salidaCol ||
        regresoCol >= salida
      ) {
        setErrorGeneral("Horario inválido");
        return false;
      }
    }

    return true;
  };

  /* =========================
     GUARDAR
  ========================= */

  const handleGuardar = async () => {
    if (bloqueado) return;
    if (!validarHorarios()) return;

    try {
      setLoading(true);

      const { error } = await supabase.rpc(
        "rpc_guardar_horario_barbero",
        {
          p_barberia_id: barbero.barberia_id,
          p_barbero_id: barbero.id,
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

    } catch (err) {
      console.error(err.message);
      setErrorGeneral("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const estadoValue = presente ? "presente" : "ausente";

  return (
    <div
      className={`bg-white rounded-xl border border-black p-6 transition-all duration-300 ${
        modoIntegrado ? "" : "w-[720px]"
      } ${bloqueado ? "opacity-70" : ""}`}
    >
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{barbero.nombre}</h2>
          <div className="text-sm text-gray-500 mt-1">
            Fecha: {fecha}
          </div>
        </div>

        <div
          className={`px-4 py-1 rounded-full text-sm font-semibold ${
            estadoGuardado
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {estadoGuardado ? "Presente" : "Ausente"}
        </div>
      </div>

      {/* MENSAJE BLOQUEO */}
      {bloqueado && (
        <div className="mb-4 text-red-600 font-semibold text-sm">
          Local cerrado este día.
        </div>
      )}

      {/* ESTADO */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-1 block">
          Estado del barbero
        </label>

        <select
          value={estadoValue}
          onChange={(e) => setPresente(e.target.value === "presente")}
          disabled={bloqueado}
          className={`w-full py-2 px-4 rounded-lg font-semibold border border-black text-white transition-all duration-200 ${
            presente ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <option value="presente">Presente</option>
          <option value="ausente">Ausente</option>
        </select>
      </div>

      <div
        className={`grid grid-cols-2 gap-10 ${
          !presente || bloqueado ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="space-y-6">

          <SelectCampo
            label="Entrada"
            value={horaEntrada}
            onChange={setHoraEntrada}
            horas={horasDisponibles}
            color="green"
          />

          <SelectCampo
            label="Salida colación"
            value={horaSalidaColacion}
            onChange={setHoraSalidaColacion}
            horas={horasDisponibles}
            color="yellow"
            error={errorColacion}
          />

          <SelectCampo
            label="Regreso colación"
            value={horaRegresoColacion}
            onChange={setHoraRegresoColacion}
            horas={horasDisponibles}
            color="green"
            error={errorColacion}
          />

          <SelectCampo
            label="Salida"
            value={horaSalida}
            onChange={setHoraSalida}
            horas={horasDisponibles}
            color="red"
          />

        </div>

        <HorarioEstablecido
          key={reloadKey}
          barberoId={barbero.id}
          barberiaId={barbero.barberia_id}
          fecha={fecha}
        />
      </div>

      {errorGeneral && (
        <div className="mt-6 text-red-600 font-semibold">
          {errorGeneral}
        </div>
      )}

      <button
        onClick={handleGuardar}
        disabled={loading || bloqueado}
        className="w-full bg-black text-white font-semibold py-2 rounded-lg mt-4 transition-all hover:bg-gray-800 disabled:opacity-50"
      >
        {bloqueado
          ? "Día cerrado"
          : loading
          ? "Guardando..."
          : "Guardar horario"}
      </button>
    </div>
  );
}

/* =========================
   SELECT
========================= */

function SelectCampo({
  label,
  value,
  onChange,
  horas,
  color,
  error,
}) {
  return (
    <div>
      <label className="block mb-2">
        <span className={`px-2 py-1 rounded text-sm font-medium bg-${color}-100 text-${color}-700`}>
          {label}
        </span>
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-black rounded-lg px-3 py-2 transition-all duration-200"
      >
        {label.includes("colación") && <option value="">—</option>}
        {horas.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>

      {error && (
        <div className="text-red-600 text-sm mt-1">
          {error}
        </div>
      )}
    </div>
  );
}
