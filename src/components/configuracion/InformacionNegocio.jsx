import React, { useState } from "react";
import InfoNegocioModal from "./modales/InfoNegocioModal";

export default function InformacionNegocio({
  barberiaId,
  nombre = "PeladoClean Barbershop",
  telefono = "+56 9 1234 5678",
  ubicacion = "Quilpué, Chile",
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="
          relative
          bg-white
          border border-zinc-200/70
          rounded-2xl
          p-9
          shadow-sm
          hover:shadow-md
          transition-all duration-200
        "
      >
        {/* HEADER */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              className="
                w-11 h-11
                flex items-center justify-center
                rounded-xl
                bg-zinc-100
                text-xl
              "
            >
              🏢
            </div>

            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Información del negocio
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Datos generales registrados en tu Panel
              </p>
            </div>
          </div>

          {/* BOTÓN SOLICITAR CAMBIO */}
          <button
            onClick={() => setModalOpen(true)}
            className="
              text-sm
              px-4 py-2
              rounded-lg
              border border-zinc-200
              bg-white
              text-zinc-600
              hover:bg-zinc-50
              hover:text-zinc-900
              transition-all
              font-medium
            "
          >
            ✏️ Solicitar cambio
          </button>
        </div>

        {/* GRID INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Nombre empresa
            </div>
            <div className="text-lg font-semibold text-zinc-900 tracking-tight">
              {nombre}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Teléfono administrador
            </div>
            <div className="text-lg font-semibold text-zinc-900 tracking-tight">
              {telefono}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Ubicación
            </div>
            <div className="text-lg font-semibold text-zinc-900 tracking-tight">
              {ubicacion}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
            mt-10 pt-6
            border-t border-zinc-200/60
            text-sm text-zinc-500
          "
        >
          Estos datos son administrados por el sistema.
          <span className="font-medium text-zinc-700 ml-1">
            Si necesitas modificarlos, puedes solicitar un cambio.
          </span>
        </div>
      </div>

      {/* MODAL */}
      <InfoNegocioModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        barberiaId={barberiaId}
        nombreActual={nombre}
        telefonoActual={telefono}
        ubicacionActual={ubicacion}
      />
    </>
  );
}
