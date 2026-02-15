import { useEffect, useRef, useState } from "react";
import { useBarberosAdmin } from "../../../hooks/useBarberosAdmin";

import BarberosActivosSection from "./barberos/BarberosActivosSection";
import BarberosInactivosSection from "./barberos/BarberosInactivosMini";
import AgregarBarberoSection from "./barberos/AgregarBarberoSection";

export default function BarberosModal({
  isOpen,
  onClose,
  onSuccess,
  barberos = [],
  barberosOff = [],
  barberiaId,
}) {
  const modalRef = useRef(null);

  const {
    pin,
    setPin,
    error,
    loadingId,
    desactivarBarbero,
    cambiarPorcentaje,
    agregarBarbero,
    activarBarbero,
    eliminarBarberoDefinitivo,
    reset,
  } = useBarberosAdmin(barberiaId);

  const [confirmModal, setConfirmModal] = useState(null);
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [ticketVisible, setTicketVisible] = useState(false);

  // 🔥 NUEVO → fuerza remount del componente agregar
  const [agregarResetKey, setAgregarResetKey] = useState(0);

  /* =========================
     CIERRE
  ========================= */

  const handleClose = () => {
    reset();
    setConfirmModal(null);
    setAccionPendiente(null);
    setPinModalOpen(false);
    setTicketVisible(false);
    onClose?.();
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  /* =========================
     FLUJO
  ========================= */

  const handleRequestAccion = (accion) => {
    reset();
    setConfirmModal(accion);
  };

  const confirmarAccion = () => {
    setPin("");
    setAccionPendiente(confirmModal);
    setConfirmModal(null);
    setPinModalOpen(true);
  };

  const ejecutarAccionFinal = async () => {
    if (!accionPendiente) return;

    let ok = false;

    const { tipo, barbero, nuevoPorcentaje, data } = accionPendiente;

    if (tipo === "desactivar") {
      ok = await desactivarBarbero(barbero.id);
    }

    if (tipo === "cambiar_porcentaje") {
      ok = await cambiarPorcentaje(barbero.id, nuevoPorcentaje);
    }

    if (tipo === "agregar") {
      ok = await agregarBarbero({
        nombre: data.nombre,
        telefono: data.telefono,
        porcentaje: data.porcentaje,
      });
    }

    if (tipo === "activar") {
      ok = await activarBarbero(barbero.id);
    }

    if (tipo === "eliminar_definitivo") {
      ok = await eliminarBarberoDefinitivo(barbero.id);
    }

    if (ok) {
      setPin("");
      setAccionPendiente(null);
      setPinModalOpen(false);
      onSuccess?.();

      // 🔥 si fue agregar → cerrar acordeón
      if (tipo === "agregar") {
        setAgregarResetKey((prev) => prev + 1);
      }

      setTicketVisible(true);
      setTimeout(() => {
        setTicketVisible(false);
      }, 5000);
    }
  };

  return (
    <>
      <div
        onMouseDown={handleOutsideClick}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div
          ref={modalRef}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 relative max-h-[85vh] overflow-y-auto"
        >
          {ticketVisible && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
              ✔ Cambio realizado correctamente
            </div>
          )}

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 transition-transform hover:rotate-90"
          >
            ✖
          </button>

          <h2 className="text-xl font-semibold mb-6">
            Gestionar Barberos
          </h2>

          <BarberosActivosSection
            barberos={barberos}
            loadingId={loadingId}
            onRequestAccion={handleRequestAccion}
          />

          {/* 🔥 AHORA se remonta cuando se inserta */}
          <AgregarBarberoSection
            key={agregarResetKey}
            loadingId={loadingId}
            onRequestAccion={handleRequestAccion}
            barberosActivos={barberos}
          />

          <BarberosInactivosSection
            barberosOff={barberosOff}
            loadingId={loadingId}
            onRequestAccion={handleRequestAccion}
          />
        </div>
      </div>

      {/* CONFIRMACIÓN */}
      {confirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="font-semibold mb-4">
              Confirmar acción
            </h3>

            <p className="text-sm mb-4">
              {confirmModal.tipo === "desactivar" &&
                `¿Desactivar a ${confirmModal.barbero.nombre}?`}

              {confirmModal.tipo === "cambiar_porcentaje" &&
                `¿Cambiar comisión de ${confirmModal.barbero.nombre} a ${confirmModal.nuevoPorcentaje}%?`}

              {confirmModal.tipo === "agregar" &&
                `¿Crear barbero ${confirmModal.data.nombre} con ${confirmModal.data.porcentaje}%?`}

              {confirmModal.tipo === "activar" &&
                `¿Reactivar a ${confirmModal.barbero.nombre}?`}

              {confirmModal.tipo === "eliminar_definitivo" &&
                `¿Eliminar definitivamente a ${confirmModal.barbero.nombre}?`}
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setConfirmModal(null)}
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
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg mb-4 ${
                error ? "border-red-500" : "border-zinc-300"
              }`}
              placeholder="Ingresa tu PIN"
            />

            {error && (
              <p className="text-sm text-red-600 mb-3">
                {error}
              </p>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setPin("");
                  setPinModalOpen(false);
                }}
                className="text-sm text-zinc-500"
              >
                Cancelar
              </button>

              <button
                onClick={ejecutarAccionFinal}
                disabled={loadingId}
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
