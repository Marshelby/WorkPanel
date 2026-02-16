import React from "react";

export default function PlanBasicoInfo({
  nombreEmpresa = "",
  planActual = "",
  telefonoSoporte = "+56989843031",
}) {
  const esPlanActual = (planActual || "").toLowerCase().trim() === "basico";

  const mensajeWhatsApp = `Hola, quiero activar el Plan Básico para la barbería "${nombreEmpresa}". Me gustaría recibir más información para comenzar.`;

  const linkWhatsApp = `https://wa.me/${telefonoSoporte.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(mensajeWhatsApp)}`;

  return (
    <div className="space-y-6">

      {/* Título */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">
          🟢 Plan Básico
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Organización completa y control en tiempo real.
        </p>
      </div>

      {/* Descripción */}
      <div className="text-zinc-700 leading-relaxed">
        El Plan Básico es perfecto para gestionar tu negocio de una forma
        más organizada. Es el plan ideal para el primer mes de uso de
        <span className="font-semibold"> BarberPanel</span>, ya que te permite
        comenzar a recopilar datos reales y ordenar la operación diaria
        de tu barbería.
      </div>

      {/* Incluye */}
      <div>
        <h3 className="font-semibold text-zinc-900 mb-3">
          Este plan incluye:
        </h3>

        <ul className="space-y-3 text-zinc-700">

          <li className="flex gap-3">
            <span>✔</span>
            <span>Acceso completo al Panel Administrativo.</span>
          </li>

          <li className="flex gap-3">
            <span>✔</span>
            <span>Gestión de barberos, horarios y agenda diaria.</span>
          </li>

          <li className="flex gap-3">
            <span>✔</span>
            <span>Registro de cortes y control de ingresos.</span>
          </li>

          <li className="flex gap-3">
            <span>✔</span>
            <span>
              Página pública con visualización en tiempo real de
              disponibilidad de barberos y estado del local.
            </span>
          </li>

          <li className="flex gap-3">
            <span>✔</span>
            <span>
              Visualización pública de valores actualizados para facilitar
              el proceso de agenda y reducir fricción con clientes.
            </span>
          </li>

          <li className="flex gap-3">
            <span>✔</span>
            <span>Acceso a todas las páginas del sistema.</span>
          </li>

          <li className="flex gap-3">
            <span>✔</span>
            <span>Reporte mensual de contabilidad.</span>
          </li>

        </ul>
      </div>

      {/* Cierre */}
      <div className="pt-4 border-t border-zinc-200 text-sm text-zinc-600">
        El Plan Básico entrega estructura, orden y visibilidad en tiempo real.
        Es el punto de partida para profesionalizar tu barbería y comenzar
        a tomar decisiones basadas en información concreta.
      </div>

      {/* Botón / Estado */}
      {!esPlanActual ? (
        <div className="flex justify-end">
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
          >
            Activar Plan Básico
          </a>
        </div>
      ) : (
        <div className="flex justify-end">
          <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            PLAN ACTUAL
          </span>
        </div>
      )}

    </div>
  );
}
