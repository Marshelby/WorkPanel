import { useState } from "react";
import HorarioEstablecido from "./modal/HorarioEstablecido";
import { useHorarioBarbero } from "../../hooks/useHorarioBarbero";

/* =========================
   MODAL
========================= */

export default function ModalHorarioBarbero({
  barbero,
  fecha,
  modoIntegrado = false,
  bloqueado = false,
  onHorarioGuardado,
}) {

  /* 🔥 SIEMPRE EJECUTAR EL HOOK */
  const {
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
  } = useHorarioBarbero({
    barbero: barbero || {},
    fecha,
    bloqueado,
  });

  const [mostrarExito, setMostrarExito] = useState(false);

  const handleGuardarConRefresh = async () => {
    const ok = await handleGuardar();

    if (ok) {
      setMostrarExito(true);

      if (typeof onHorarioGuardado === "function") {
        onHorarioGuardado();
      }

      setTimeout(() => {
        setMostrarExito(false);
      }, 4000);
    }
  };

  /* 🔥 NO RETURN TEMPRANO */
  const noHayBarbero = !barbero || !barbero.id;

  const estadoValue = presente ? "presente" : "ausente";

  return (
    <div
      className={`bg-white rounded-xl border border-black p-6 transition-all duration-300 ${
        modoIntegrado ? "" : "w-[720px]"
      } ${bloqueado ? "opacity-70" : ""}`}
    >
      {noHayBarbero ? (
        <div className="text-gray-500 text-sm">
          Selecciona un barbero
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">
                {barbero.nombre}
              </h2>
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
              onChange={(e) =>
                setPresente(e.target.value === "presente")
              }
              disabled={bloqueado}
              className={`w-full py-2 px-4 rounded-lg font-semibold border border-black text-white ${
                presente ? "bg-green-600" : "bg-red-600"
              }`}
            >
              <option value="presente">Presente</option>
              <option value="ausente">Ausente</option>
            </select>
          </div>

          {/* HORARIOS */}
          <div
            className={`grid grid-cols-2 gap-10 ${
              !presente || bloqueado
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            <div className="space-y-6">

              <SelectBloque
                label="Entrada"
                value={horaEntrada}
                onChange={setHoraEntrada}
                horas={horasDisponiblesHH}
                color="green"
              />

              <SelectBloque
                label="Salida colación"
                value={horaSalidaColacion}
                onChange={setHoraSalidaColacion}
                horas={horasDisponiblesHH}
                color="yellow"
                error={errorColacion}
                allowEmpty
              />

              <SelectBloque
                label="Regreso colación"
                value={horaRegresoColacion}
                onChange={setHoraRegresoColacion}
                horas={horasDisponiblesHH}
                color="green"
                error={errorColacion}
                allowEmpty
              />

              <SelectBloque
                label="Salida"
                value={horaSalida}
                onChange={setHoraSalida}
                horas={horasDisponiblesHH}
                color="red"
              />

              {errorGeneral === "Horario inválido por cronograma" && (
                <div className="text-red-600 font-semibold">
                  Horario inválido por cronograma
                </div>
              )}
            </div>

            <HorarioEstablecido
              key={reloadKey}
              barberoId={barbero.id}
              barberiaId={barbero.barberia_id}
              fecha={fecha}
            />
          </div>

          {errorGeneral &&
            errorGeneral !==
              "Horario inválido por cronograma" && (
              <div className="mt-6 text-red-600 font-semibold">
                {errorGeneral}
              </div>
            )}

          <button
            onClick={handleGuardarConRefresh}
            disabled={loading || bloqueado}
            className="w-full bg-black text-white font-semibold py-2 rounded-lg mt-4 hover:bg-gray-800 disabled:opacity-50"
          >
            {bloqueado
              ? "Día cerrado"
              : loading
              ? "Guardando..."
              : "Guardar horario"}
          </button>

          {mostrarExito && (
            <div className="mt-4 flex justify-center">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-sm">
                <span className="text-lg animate-bounce">
                  ✔
                </span>
                <span className="font-semibold text-sm">
                  Horario guardado correctamente
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* =========================
   SELECT BLOQUE
========================= */

function SelectBloque({
  label,
  value,
  onChange,
  horas = [],
  color,
  error,
  allowEmpty = false,
}) {
  return (
    <div>
      <label className="block mb-2">
        <span
          className={`px-2 py-1 rounded text-sm font-medium bg-${color}-100 text-${color}-700`}
        >
          {label}
        </span>
      </label>

      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="border border-black rounded-lg px-3 py-2 bg-white w-full"
      >
        {allowEmpty && <option value="">—</option>}
        {!allowEmpty && <option value="">Seleccionar</option>}

        {horas.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
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
