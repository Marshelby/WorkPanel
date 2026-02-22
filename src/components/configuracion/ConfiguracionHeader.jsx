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

        <div className="relative bg-[#0b1a2e] border border-blue-400/20 w-[600px] max-w-[95%] rounded-2xl shadow-[0_0_60px_rgba(59,130,246,0.25)] p-10 text-zinc-100">
          <button
            onClick={cerrar}
            className="absolute top-5 right-6 text-zinc-400 hover:text-white text-xl"
          >
            ✕
          </button>

          <h2 className="text-2xl font-semibold mb-4 tracking-tight text-blue-300">
            Plan {planSeleccionado}
          </h2>

          <p className="text-zinc-400">
            Para cambiar tu plan comunícate con soporte al{" "}
            <span className="text-cyan-400 font-semibold">
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
              ? "bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/10 scale-[1.03]"
              : "bg-white/5 border-white/10 hover:border-blue-400/30 hover:bg-white/10"
          }
        `}
      >
        <div className="font-semibold text-lg tracking-tight">
          {label}
        </div>

        {activo && (
          <span className="absolute top-2 right-3 text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded-full">
            ACTUAL
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="rounded-2xl border border-blue-400/15 bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 backdrop-blur-xl p-10 shadow-[0_0_60px_rgba(59,130,246,0.15)]">

        <div className="flex flex-col lg:flex-row justify-between gap-16">

          {/* IZQUIERDA */}
          <div className="space-y-8 max-w-3xl">

            {/* NUEVO TÍTULO (ANTES SUBTÍTULO) */}
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">
              Administra tu empresa y controla tu plan de forma profesional.
            </h1>

            <div className="text-base text-zinc-400 space-y-3">
              <div>
                📅 Fecha de pago:{" "}
                <span className="font-semibold text-zinc-200">
                  {fechaPago ?? "-"} de cada mes
                </span>
              </div>

              <div>
                📲 Soporte:{" "}
                <span className="font-semibold text-cyan-400">
                  {telefonoSoporte}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-blue-400/10">
              <div className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
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

              <div className="px-5 py-3 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold text-lg backdrop-blur shadow-[0_0_20px_rgba(59,130,246,0.25)]">
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