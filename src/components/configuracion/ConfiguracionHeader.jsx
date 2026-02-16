import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import PlanBasicoInfo from "./planes/PlanBasicoInfo";
import PlanPremiumInfo from "./planes/PlanPremiumInfo";
import PlanProfesionalInfo from "./planes/PlanProfesionalInfo";

export default function ConfiguracionHeader({
  nombreEmpresa = "",
  plan = "",
  estadoPlan = "Activo",
  fechaPago,
  telefonoSoporte = "+56989843031",
}) {
  const [planSeleccionado, setPlanSeleccionado] = useState(null);

  /* =============================
     NORMALIZADOR REAL
  ==============================*/
  const normalizarPlan = (valor) => {
    if (!valor) return "";

    const limpio = valor
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    if (limpio === "basic" || limpio === "basico") return "basico";
    if (limpio === "premium") return "premium";
    if (limpio === "profesional" || limpio === "pro") return "profesional";

    return limpio;
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
     ESCAPE
  ==============================*/
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setPlanSeleccionado(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* =============================
     MODAL PORTAL
  ==============================*/
  const renderModal = () => {
    if (!planSeleccionado) return null;

    const cerrar = () => setPlanSeleccionado(null);

    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">
        <div className="absolute inset-0" onClick={cerrar} />

        <div className="relative bg-white w-[780px] max-w-[95%] rounded-2xl shadow-2xl p-10 max-h-[85vh] overflow-y-auto">
          <button
            onClick={cerrar}
            className="absolute top-5 right-6 text-zinc-400 hover:text-black text-xl transition-colors"
          >
            ✕
          </button>

          {planSeleccionado === "basico" && (
            <PlanBasicoInfo
              nombreEmpresa={nombreEmpresa}
              planActual={planNormalizado}
              telefonoSoporte={telefonoSoporte}
            />
          )}

          {planSeleccionado === "premium" && (
            <PlanPremiumInfo
              nombreEmpresa={nombreEmpresa}
              planActual={planNormalizado}
              telefonoSoporte={telefonoSoporte}
            />
          )}

          {planSeleccionado === "profesional" && (
            <PlanProfesionalInfo
              nombreEmpresa={nombreEmpresa}
              planActual={planNormalizado}
              telefonoSoporte={telefonoSoporte}
            />
          )}
        </div>
      </div>,
      document.body
    );
  };

  /* =============================
     PLAN CARD
  ==============================*/
  const renderPlan = (tipo, label) => {
    const activo = planNormalizado === tipo;

    return (
      <div
        onClick={() => setPlanSeleccionado(tipo)}
        className={`
          relative cursor-pointer border rounded-xl px-6 py-5 flex items-center justify-between
          transition-all duration-300 transform
          hover:scale-105 hover:shadow-2xl
          ${
            activo
              ? "ring-2 ring-black shadow-xl scale-105"
              : "opacity-80 hover:opacity-100"
          }
        `}
      >
        <div className="flex items-center gap-4 font-semibold text-lg">
          {tipo === "profesional" ? (
            <span className="text-xl">👑</span>
          ) : (
            <span
              className={`w-4 h-4 rounded-full ${
                tipo === "premium"
                  ? "bg-blue-500"
                  : "bg-green-500"
              }`}
            />
          )}
          {label}
        </div>

        {tipo === "profesional" && (
          <span className="text-xs bg-black text-white px-3 py-1 rounded-full shadow-md">
            RECOMENDADO
          </span>
        )}

        {activo && (
          <span className="absolute top-2 right-3 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
            ACTUAL
          </span>
        )}
      </div>
    );
  };

  /* =============================
     HEADER
  ==============================*/
  return (
    <>
      <div className="rounded-2xl border border-zinc-200 bg-white p-12 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-16">

          <div className="space-y-8 max-w-3xl">
            <h1 className="text-4xl font-bold text-zinc-900">
              Configuración
            </h1>

            <p className="text-lg text-zinc-700">
              Desde aquí puedes administrar tu barbería y gestionar tu plan.
            </p>

            <div className="text-base text-zinc-600 space-y-3">
              <div>
                📅 La fecha de pago está establecida para los{" "}
                <span className="font-semibold text-black text-lg">
                  {fechaPago ?? "-"}
                </span>{" "}
                de cada mes.
              </div>

              <div>
                📲 Para solicitar un cambio de plan contáctanos al:{" "}
                <span className="font-semibold text-black text-lg">
                  {telefonoSoporte}
                </span>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-200">
              <div className="text-3xl font-extrabold text-black">
                {nombreEmpresa}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 min-w-[360px]">

            <div>
              <div className="text-sm uppercase text-zinc-400 mb-3 tracking-wider">
                Estado del plan
              </div>

              <div className="px-6 py-4 rounded-full bg-green-50 border border-green-200 text-green-700 font-semibold shadow-sm text-lg">
                Plan {estadoPlan}
              </div>
            </div>

            <div>
              <div className="text-sm uppercase text-zinc-400 mb-3 tracking-wider">
                Tipo de plan
              </div>

              <div className="text-sm text-zinc-500 mb-6">
                Haz click en el plan para verlo detalladamente.
              </div>

              <div className="flex flex-col gap-6">
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
