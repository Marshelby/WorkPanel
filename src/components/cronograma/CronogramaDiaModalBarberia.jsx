import HorarioEspecialForm from "./HorarioEspecialForm";
import ConfirmarHorarioEspecialModal from "./ConfirmarHorarioEspecialModal";
import {
  useCronogramaDiaBarberia,
  ESTADOS,
  ESTADO_LABEL,
  ESTADO_DESC,
} from "../../hooks/useCronogramaDiaBarberia";

function formatFecha(fecha) {
  const d = new Date(fecha + "T00:00:00");
  return d.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function CronogramaDiaModalBarberia({
  fecha,
  barberiaId,
  cronogramaInicial,
  horariosBase,
  onCancel,
  onSaved,
}) {
  const {
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
  } = useCronogramaDiaBarberia({
    fecha,
    barberiaId,
    cronogramaInicial,
    onSaved,
  });

  const puedeGuardar =
    !loading &&
    (estado !== ESTADOS.HORARIO_ESPECIAL || !errorHorario);

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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-extrabold capitalize">
            {formatFecha(fecha)}
          </h2>
          <span className="px-3 py-1 rounded text-xs bg-gray-200">
            {ESTADO_LABEL[estado]}
          </span>
        </div>

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
