import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useHorarioSemanal } from "../../../hooks/useHorarioSemanal";

const DIAS = [
  "Lunes","Martes","Miércoles",
  "Jueves","Viernes","Sábado","Domingo"
];

const MINUTOS = ["00","15","30","45"];
const HORAS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);

export default function HorarioSemanalModal({
  isOpen,
  onClose,
  barberiaId,
  onUpdated,
}) {

  const {
    actualizarHorario,
    mensaje,
    loading,
    limpiarMensaje
  } = useHorarioSemanal(barberiaId);

  const [horarios, setHorarios] = useState([]);
  const [editingDia, setEditingDia] = useState(null);

  const [horaAperturaH, setHoraAperturaH] = useState("");
  const [horaAperturaM, setHoraAperturaM] = useState("");
  const [horaCierreH, setHoraCierreH] = useState("");
  const [horaCierreM, setHoraCierreM] = useState("");

  const [pinAdmin, setPinAdmin] = useState("");

  const [confirmModal, setConfirmModal] = useState(null);
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  /* ========================= ESC ========================= */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* ========================= FETCH ========================= */
  useEffect(() => {
    if (!barberiaId || !isOpen) return;

    const fetchHorarios = async () => {
      const { data } = await supabase
        .from("v_horarios_config")
        .select("*")
        .eq("barberia_id", barberiaId);

      if (data) setHorarios(data);
    };

    fetchHorarios();
  }, [barberiaId, isOpen]);

  const refrescar = async () => {
    const { data } = await supabase
      .from("v_horarios_config")
      .select("*")
      .eq("barberia_id", barberiaId);

    if (data) setHorarios(data);
  };

  const formatearHora = (hora) => {
    if (!hora) return null;
    return hora.slice(0, 5);
  };

  /* ========================= EDITAR ========================= */

  const handleEditar = (diaReal) => {

    const registro = horarios.find(
      (h) => h.dia_semana === diaReal
    );

    if (registro?.hora_apertura) {
      const [h, m] = registro.hora_apertura.slice(0,5).split(":");
      setHoraAperturaH(h);
      setHoraAperturaM(m);
    } else {
      setHoraAperturaH("");
      setHoraAperturaM("");
    }

    if (registro?.hora_cierre) {
      const [h, m] = registro.hora_cierre.slice(0,5).split(":");
      setHoraCierreH(h);
      setHoraCierreM(m);
    } else {
      setHoraCierreH("");
      setHoraCierreM("");
    }

    setEditingDia(diaReal);
    limpiarMensaje();
  };

  const cancelarEdicion = () => {
    setEditingDia(null);
    setHoraAperturaH("");
    setHoraAperturaM("");
    setHoraCierreH("");
    setHoraCierreM("");
  };

  /* ========================= CONFIRMACIONES ========================= */

  const abrirConfirmacionEditar = () => {
    setConfirmModal({
      tipo: "editar",
      diaReal: editingDia
    });
  };

  const abrirConfirmacionCerrar = () => {
    setConfirmModal({
      tipo: "cerrar",
      diaReal: editingDia
    });
  };

  const confirmarAccion = () => {
    setAccionPendiente(confirmModal);
    setConfirmModal(null);
    setPinModalOpen(true);
  };

  const ejecutarAccionFinal = async () => {

    if (!accionPendiente) return;

    let ok = false;

    if (accionPendiente.tipo === "editar") {

      ok = await actualizarHorario({
        diaSemana: accionPendiente.diaReal,
        horaAperturaH,
        horaAperturaM,
        horaCierreH,
        horaCierreM,
        pinAdmin,
        cerrado: false
      });

    }

    if (accionPendiente.tipo === "cerrar") {

      ok = await actualizarHorario({
        diaSemana: accionPendiente.diaReal,
        pinAdmin,
        cerrado: true
      });

    }

    if (ok) {
      cancelarEdicion();
      setPinAdmin("");
      refrescar();
      onUpdated?.();
    }

    setPinModalOpen(false);
    setAccionPendiente(null);
  };

  /* ========================= CERRAR ========================= */

  const handleClose = () => {
    cancelarEdicion();
    setPinAdmin("");
    limpiarMensaje();
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 relative"
        >

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700"
          >
            ✖
          </button>

          <h2 className="text-xl font-semibold mb-6">
            Modificar horario semanal
          </h2>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {DIAS.map((dia, index) => {

              const diaReal = index + 1;

              const registro = horarios.find(
                (h) => h.dia_semana === diaReal
              );

              const apertura = registro
                ? formatearHora(registro.hora_apertura)
                : null;

              const cierre = registro
                ? formatearHora(registro.hora_cierre)
                : null;

              return (
                <div key={diaReal} className="border rounded-xl p-4 bg-zinc-50">

                  <div className="flex justify-between items-center">
                    <div className="font-medium">
                      {dia}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-sm text-zinc-600">
                        {apertura && cierre
                          ? `${apertura} — ${cierre}`
                          : "Cerrado"}
                      </div>

                      <button
                        onClick={() => handleEditar(diaReal)}
                        className="text-xs px-3 py-1 border rounded-md"
                      >
                        Modificar horario
                      </button>
                    </div>
                  </div>

                  {editingDia === diaReal && (
                    <div className="mt-4 space-y-4">

                      <div className="grid grid-cols-2 gap-4">

                        <div>
                          <label className="text-xs">Hora apertura</label>
                          <div className="flex gap-2 mt-1">
                            <select value={horaAperturaH} onChange={(e)=>setHoraAperturaH(e.target.value)} className="border rounded-lg px-3 py-2">
                              <option value="">HH</option>
                              {HORAS.map(h=> <option key={h}>{h}</option>)}
                            </select>

                            <select value={horaAperturaM} onChange={(e)=>setHoraAperturaM(e.target.value)} className="border rounded-lg px-3 py-2">
                              <option value="">MM</option>
                              {MINUTOS.map(m=> <option key={m}>{m}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs">Hora cierre</label>
                          <div className="flex gap-2 mt-1">
                            <select value={horaCierreH} onChange={(e)=>setHoraCierreH(e.target.value)} className="border rounded-lg px-3 py-2">
                              <option value="">HH</option>
                              {HORAS.map(h=> <option key={h}>{h}</option>)}
                            </select>

                            <select value={horaCierreM} onChange={(e)=>setHoraCierreM(e.target.value)} className="border rounded-lg px-3 py-2">
                              <option value="">MM</option>
                              {MINUTOS.map(m=> <option key={m}>{m}</option>)}
                            </select>
                          </div>
                        </div>

                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          onClick={abrirConfirmacionCerrar}
                          className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-md"
                        >
                          Marcar día como cerrado
                        </button>

                        <button
                          onClick={cancelarEdicion}
                          className="text-xs text-zinc-500"
                        >
                          Cancelar edición
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {mensaje && (
            <div className={`mt-4 text-sm font-medium ${
              mensaje.tipo==="success" ? "text-green-600" : "text-red-600"
            }`}>
              {mensaje.texto}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={abrirConfirmacionEditar}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-zinc-900 text-white"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>

        </div>
      </div>

      {/* CONFIRMACION */}
      {confirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-96">

            <h3 className="font-semibold mb-4">
              {confirmModal.tipo === "cerrar"
                ? "¿Seguro quieres dejar este día cerrado?"
                : `¿Seguro quieres aplicar este horario?`
              }
            </h3>

            {confirmModal.tipo === "editar" && (
              <p className="text-sm text-zinc-600 mb-4">
                {DIAS[confirmModal.diaReal - 1]} → {horaAperturaH}:{horaAperturaM} — {horaCierreH}:{horaCierreM}
              </p>
            )}

            <div className="flex justify-between">
              <button
                onClick={()=>setConfirmModal(null)}
                className="text-sm text-zinc-500"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarAccion}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-80">

            <h3 className="font-semibold mb-4">
              Confirmar PIN administrador
            </h3>

            <input
              type="password"
              value={pinAdmin}
              onChange={(e)=>setPinAdmin(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="Ingresa tu PIN"
            />

            <div className="flex justify-between">
              <button
                onClick={()=>setPinModalOpen(false)}
                className="text-sm text-zinc-500"
              >
                Cancelar
              </button>

              <button
                onClick={ejecutarAccionFinal}
                disabled={loading}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm"
              >
                Confirmar
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
}
