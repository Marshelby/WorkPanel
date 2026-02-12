import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import HorarioEspecialForm from "./HorarioEspecialForm";
import ConfirmarHorarioEspecialModal from "./ConfirmarHorarioEspecialModal";

/* =========================
   ESTADOS
========================= */
const ESTADOS = {
  NORMAL: "NORMAL",
  CERRADO: "CERRADO",
  HORARIO_ESPECIAL: "HORARIO_ESPECIAL",
};

const ESTADO_LABEL = {
  NORMAL: "Normal",
  CERRADO: "Cierre total",
  HORARIO_ESPECIAL: "Horario especial",
};

const ESTADO_DESC = {
  NORMAL: "Día normal según horarios base",
  CERRADO: "La barbería permanece cerrada todo el día",
  HORARIO_ESPECIAL: "Horario distinto al habitual",
};

/* =========================
   HELPERS
========================= */
function formatFecha(fecha) {
  const d = new Date(fecha + "T00:00:00");
  return d.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function horaValida(haH, hcH) {
  if (!haH || !hcH) return false;
  return Number(hcH) > Number(haH);
}

/* =========================
   COMPONENTE
========================= */
export default function CronogramaDiaModalBarberia({
  fecha,
  barberiaId,
  cronogramaInicial,
  horariosBase,
  onCancel,
  onSaved,
}) {
  const containerRef = useRef(null);

  const existeCronograma = useMemo(() => {
    if (!cronogramaInicial) return false;
    return (
      cronogramaInicial.local_cerrado ||
      cronogramaInicial.horario_especial
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

  /* =========================
     INIT
  ========================= */
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

    if (cronogramaInicial.local_cerrado) {
      setEstado(ESTADOS.CERRADO);
    } else if (cronogramaInicial.horario_especial) {
      setEstado(ESTADOS.HORARIO_ESPECIAL);
    }

    setMotivo(cronogramaInicial.motivo || "");
  }, [cronogramaInicial]);

  /* =========================
     SCROLL AUTOMÁTICO
  ========================= */
  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [estado]);

  /* =========================
     VALIDACIÓN HORARIO ESPECIAL
  ========================= */
  useEffect(() => {
    setErrorHorario("");

    if (estado !== ESTADOS.HORARIO_ESPECIAL) return;

    const { haH, hcH } = horarioEspecial;

    if (!haH || !hcH) {
      setErrorHorario("Debes definir hora de apertura y cierre.");
      return;
    }

    if (!horaValida(haH, hcH)) {
      setErrorHorario(
        "La hora de cierre debe ser posterior a la hora de apertura."
      );
    }
  }, [estado, horarioEspecial]);

  const puedeGuardar =
    !loading &&
    (estado !== ESTADOS.HORARIO_ESPECIAL || !errorHorario);

  /* =========================
     GUARDAR
  ========================= */
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

    const { error } = await supabase.rpc(
      "rpc_upsert_cronograma_barberia_dia",
      {
        p_barberia_id: barberiaId,
        p_fecha: fecha,
        p_local_cerrado: estado === ESTADOS.CERRADO,
        p_horario_especial: estado === ESTADOS.HORARIO_ESPECIAL,
        p_hora_apertura:
          estado === ESTADOS.HORARIO_ESPECIAL
            ? `${horarioEspecial.haH}:00:00`
            : null,
        p_hora_cierre:
          estado === ESTADOS.HORARIO_ESPECIAL
            ? `${horarioEspecial.hcH}:00:00`
            : null,
        p_motivo: motivo?.trim() || null,
      }
    );

    setLoading(false);

    if (error) {
      setErrorRPC(error.message || "No se pudo guardar el cronograma.");
      return;
    }

    onSaved?.();
  }

  /* =========================
     BORRAR
  ========================= */
  async function handleBorrar() {
    setLoading(true);
    setErrorRPC("");

    const { error } = await supabase.rpc(
      "rpc_upsert_cronograma_barberia_dia",
      {
        p_barberia_id: barberiaId,
        p_fecha: fecha,
        p_local_cerrado: false,
        p_horario_especial: false,
        p_hora_apertura: null,
        p_hora_cierre: null,
        p_motivo: null,
      }
    );

    setLoading(false);

    if (error) {
      setErrorRPC(error.message || "No se pudo borrar el cronograma.");
      return;
    }

    setConfirmarBorrado(false);
    onSaved?.();
  }

  /* =========================
     CLASES DINÁMICAS
  ========================= */
  const getCardBaseStyle = (e) => {
    if (e === ESTADOS.CERRADO)
      return "border-red-200 bg-red-50 text-red-700";
    if (e === ESTADOS.HORARIO_ESPECIAL)
      return "border-yellow-200 bg-yellow-50 text-yellow-800";
    return "border-gray-300 bg-gray-50 text-gray-700";
  };

  const getCardActiveStyle = (e) => {
    if (e === ESTADOS.CERRADO)
      return "border-red-500 bg-red-100";
    if (e === ESTADOS.HORARIO_ESPECIAL)
      return "border-yellow-400 bg-yellow-100";
    return "border-gray-400 bg-gray-100";
  };

  return (
    <>
      <div
        ref={containerRef}
        className="rounded-xl border p-6 bg-white border-gray-200"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-extrabold capitalize">
            {formatFecha(fecha)}
          </h2>
          <span className="px-3 py-1 rounded text-xs bg-gray-200">
            {ESTADO_LABEL[estado]}
          </span>
        </div>

        {/* SELECTOR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {Object.values(ESTADOS).map((e) => (
            <button
              key={e}
              onClick={() => setEstado(e)}
              className={`border rounded-lg p-3 text-left transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md ${
                estado === e
                  ? getCardActiveStyle(e)
                  : getCardBaseStyle(e)
              }`}
            >
              <p className="font-semibold">{ESTADO_LABEL[e]}</p>
              <p className="text-xs opacity-80">{ESTADO_DESC[e]}</p>
            </button>
          ))}
        </div>

        {/* FORM HORARIO ESPECIAL */}
        {estado === ESTADOS.HORARIO_ESPECIAL && (
          <>
            <HorarioEspecialForm
              value={horarioEspecial}
              onChange={setHorarioEspecial}
              horariosBase={horariosBase}
            />
            {errorHorario && (
              <p className="text-sm text-red-700 font-semibold mt-2">
                ⚠️ {errorHorario}
              </p>
            )}
          </>
        )}

        {/* MOTIVO */}
        {estado !== ESTADOS.NORMAL && (
          <textarea
            className="w-full border rounded p-2 mt-3"
            rows={2}
            placeholder="Motivo (opcional)"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        )}

        {errorRPC && (
          <p className="text-red-700 text-sm mt-2">⚠️ {errorRPC}</p>
        )}

        {/* FOOTER */}
        <div className="flex items-center justify-between mt-6">
          {existeCronograma && (
  <>
    {!confirmarBorrado ? (
      <button
        onClick={() => setConfirmarBorrado(true)}
        disabled={loading}
        className="text-sm text-red-700 hover:underline"
      >
        🗑️ Borrar cronograma
      </button>
    ) : (
      <div className="flex items-center gap-3 text-sm">
        <span>
          ¿Seguro de borrar el cronograma del día{" "}
          <strong>{formatFecha(fecha)}</strong>?
        </span>
        <button
          onClick={() => setConfirmarBorrado(false)}
          className="px-3 py-1 border rounded"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          onClick={handleBorrar}
          className="px-3 py-1 bg-red-600 text-white rounded"
          disabled={loading}
        >
          Sí, borrar
        </button>
      </div>
    )}
  </>
)}


          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 border rounded"
              disabled={loading}
            >
              Cerrar
            </button>
            <button
              onClick={() => handleGuardar(false)}
              disabled={!puedeGuardar}
              className="px-4 py-2 rounded font-semibold bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>

      <ConfirmarHorarioEspecialModal
        open={confirmarGuardarHorarioEspecial}
        loading={loading}
        onCancel={() => setConfirmarGuardarHorarioEspecial(false)}
        onConfirm={() => handleGuardar(true)}
      />
    </>
  );
}

