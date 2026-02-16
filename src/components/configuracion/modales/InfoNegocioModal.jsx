import React from "react";
import EditableFieldRow from "./informacion/EditableFieldRow";
import PinAdminModal from "./informacion/PinAdminModal";
import useInfoNegocio from "../../../hooks/useInfoNegocio";

export default function InfoNegocioModal({
  isOpen,
  onClose,
  barberiaId,
  dataActual,
  onSuccess,
}) {
  const {
    requestSave,
    confirmSave,
    pinModalOpen,
    setPinModalOpen,
  } = useInfoNegocio({ barberiaId, onSuccess });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white w-full max-w-2xl rounded-2xl p-10 shadow-xl animate-fadeIn relative">

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-700 transition"
          >
            ✖
          </button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900">
              Editar información del negocio
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Puedes modificar los datos actuales. Se requerirá PIN administrador.
            </p>
          </div>

          {/* CAMPOS EDITABLES */}
          <EditableFieldRow
            label="Nombre empresa"
            fieldKey="nombre"
            value={dataActual?.nombre}
            onSaveRequest={requestSave}
          />

          <EditableFieldRow
            label="Teléfono administrador"
            fieldKey="whatsapp_principal"
            value={dataActual?.whatsapp_principal}
            onSaveRequest={requestSave}
          />

          <EditableFieldRow
            label="Bloques agenda (min)"
            fieldKey="bloques_agenda"
            value={dataActual?.bloques_agenda}
            onSaveRequest={requestSave}
          />

          <EditableFieldRow
            label="Ubicación"
            fieldKey="ubicacion"
            value={dataActual?.ubicacion}
            onSaveRequest={requestSave}
          />

        </div>
      </div>

      <PinAdminModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onConfirm={confirmSave}
      />
    </>
  );
}
