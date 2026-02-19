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

  const normalizarPlan = (valor) => {
    if (!valor) return "basico";
    return valor.toLowerCase().trim();
  };

  const planNormalizado = normalizarPlan(plan);

  useEffect(() => {
    document.body.style.overflow = planSeleccionado ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [planSeleccionado]);

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

        <div className="relative bg-[#111827] border border-white/10 w-[600px] max-w-[95%] rounded-2xl shadow-2xl p-10 text-zinc-100">
          <button
            onClick={cerrar}
            className="absolute top-5 right-6 text-zinc-400 hover:text-white text-xl"
          >
            ✕
          </button>

          <h2 className="text-2xl font-semibold mb-4 tracking-tight">
            Plan {planSeleccionado}
          </h2>

          <p className="text-zinc-400">
            Para cambiar tu plan comunícate con soporte al{" "}
            <span className="text-emerald-400 font-semibold">
              {telefonoSoporte}
            </span>
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
          relative cursor-pointer rounded-xl px-6 py-4 flex items-center justify-between
          transition-all duration-300
          border backdrop-blur-xl
          ${
            activo
              ? "bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10 scale-[1.03]"
              : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
          }
        `}
      >
        <div className="font-semibold text-lg tracking-tight">
          {label}
        </div>

        {activo && (
          <span className="absolute top-2 right-3 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full">
            ACTUAL
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-xl">

        <div className="flex flex-col lg:flex-row justify-between gap-16">

          {/* IZQUIERDA */}
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-100">
              Configuración
            </h1>

            <p className="text-lg text-zinc-400">
              Administra tu empresa y controla tu plan de forma profesional.
            </p>

            <div className="text-base text-zinc-400 space-y-2">
              <div>
                📅 Fecha de pago:{" "}
                <span className="font-semibold text-zinc-200">
                  {fechaPago ?? "-"} de cada mes
                </span>
              </div>

              <div>
                📲 Soporte:{" "}
                <span className="font-semibold text-emerald-400">
                  {telefonoSoporte}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {nombreEmpresa}
              </div>
            </div>
          </div>

          {/* DERECHA */}
          <div className="flex flex-col gap-8 min-w-[320px]">

            <div>
              <div className="text-xs uppercase text-zinc-500 mb-3 tracking-wider">
                Estado del plan
              </div>

              <div className="px-5 py-3 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-lg backdrop-blur">
                {estadoPlan}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase text-zinc-500 mb-3 tracking-wider">
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
