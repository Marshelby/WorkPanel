import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function ConfiguracionHeader({
  nombreEmpresa = "",
  plan = "basico",
  estadoPlan = "Activo",
  fechaPago,
  telefonoSoporte = "+56989843031",
}) {
  const [planSeleccionado, setPlanSeleccionado] = useState(null);

  /* =============================
     NORMALIZADOR
  ==============================*/
  const normalizarPlan = (valor) => {
    if (!valor) return "basico";
    return valor.toLowerCase().trim();
  };

  const planNormalizado = normalizarPlan(plan);

  /* =============================
     BLOQUEAR SCROLL
  ==============================*/
  useEffect(() => {
    document.body.style.overflow = planSeleccionado ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [planSeleccionado]);

  /* =============================
     ESC
  ==============================*/
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setPlanSeleccionado(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const cerrar = () => setPlanSeleccionado(null);

  const renderModal = () => {
    if (!planSeleccionado) return null;

    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">
        <div className="absolute inset-0" onClick={cerrar} />

        <div className="relative bg-white w-[600px] max-w-[95%] rounded-2xl shadow-2xl p-10">
          <button
            onClick={cerrar}
            className="absolute top-5 right-6 text-zinc-400 hover:text-black text-xl"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-4">
            Plan {planSeleccionado}
          </h2>

          <p className="text-zinc-600">
            Para cambiar tu plan comunícate con soporte al {telefonoSoporte}.
          </p>
        </div>
      </div>,
      document.body
    );
  };

  const renderPlan = (tipo, label) => {
    const activo = planNormalizado === tipo;

    return (
      <div
        onClick={() => setPlanSeleccionado(tipo)}
        className={`
          relative cursor-pointer border rounded-xl px-6 py-4 flex items-center justify-between
          transition-all duration-300 hover:scale-105
          ${
            activo
              ? "ring-2 ring-black shadow-xl scale-105"
              : "opacity-80 hover:opacity-100"
          }
        `}
      >
        <div className="font-semibold text-lg">{label}</div>

        {activo && (
          <span className="absolute top-2 right-3 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
            ACTUAL
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-12">

          {/* IZQUIERDA */}
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-4xl font-bold text-zinc-900">
              Configuración
            </h1>

            <p className="text-lg text-zinc-700">
              Desde aquí puedes administrar tu empresa y gestionar tu plan.
            </p>

            <div className="text-base text-zinc-600 space-y-2">
              <div>
                📅 Fecha de pago:{" "}
                <span className="font-semibold text-black">
                  {fechaPago ?? "-"} de cada mes
                </span>
              </div>

              <div>
                📲 Soporte:{" "}
                <span className="font-semibold text-black">
                  {telefonoSoporte}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200">
              <div className="text-3xl font-extrabold text-black">
                {nombreEmpresa}
              </div>
            </div>
          </div>

          {/* DERECHA */}
          <div className="flex flex-col gap-6 min-w-[320px]">

            <div>
              <div className="text-sm uppercase text-zinc-400 mb-2 tracking-wider">
                Estado del plan
              </div>

              <div className="px-5 py-3 rounded-full bg-green-50 border border-green-200 text-green-700 font-semibold text-lg">
                {estadoPlan}
              </div>
            </div>

            <div>
              <div className="text-sm uppercase text-zinc-400 mb-2 tracking-wider">
                Tipo de plan
              </div>

              <div className="flex flex-col gap-4">
                {renderPlan("basico", "Básico")}
                {renderPlan("premium", "Premium")}
                {renderPlan("profesional", "Profesional")}
              </div>
            </div>

          </div>
        </div>
      </div>

      {renderModal()}
    </>
  );
}
