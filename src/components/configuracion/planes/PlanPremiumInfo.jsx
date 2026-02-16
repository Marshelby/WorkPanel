import React from "react";

export default function PlanPremiumInfo({
  nombreEmpresa = "",
  planActual = "",
  telefonoSoporte = "+56989843031",
}) {
  const esPlanActual = (planActual || "").toLowerCase().trim() === "premium";

  const mensajeWhatsApp = `Hola, quiero actualizar la barbería "${nombreEmpresa}" al Plan Premium. Me gustaría recibir más información para activarlo.`;

  const linkWhatsApp = `https://wa.me/${telefonoSoporte.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(mensajeWhatsApp)}`;

  return (
    <div className="max-h-[75vh] overflow-y-auto pr-2">
      <div className="space-y-8">
        {/* Título */}
        <div>
          <h2 className="text-3xl font-bold text-blue-600">🔵 Plan Premium</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Inteligencia estratégica aplicada a tu barbería.
          </p>
        </div>

        {/* Descripción principal */}
        <div className="text-zinc-700 leading-relaxed text-lg">
          El Plan Premium es el paso natural después del Plan Básico. Mientras
          el Básico almacena y organiza los datos, el Premium los interpreta y
          los convierte en estrategias accionables para hacer crecer tu negocio.
        </div>

        {/* Bloque tecnológico */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="font-semibold text-blue-700 mb-3">
            🧠 Motor de análisis inteligente
          </h3>

          <p className="text-zinc-700 leading-relaxed">
            El sistema analiza automáticamente el comportamiento de clientes,
            horarios más rentables, barberos con mayor rendimiento y patrones de
            ingresos.
          </p>
        </div>

        {/* Incluye */}
        <div>
          <h3 className="font-semibold text-zinc-900 mb-4 text-lg">
            Este plan incluye:
          </h3>

          <ul className="space-y-4 text-zinc-700">
            <li className="flex gap-3">
              <span>✔</span>
              <span>Todo lo incluido en el Plan Básico.</span>
            </li>

            <li className="flex gap-3">
              <span>✔</span>
              <span>Reportes avanzados semanales y mensuales.</span>
            </li>

            <li className="flex gap-3">
              <span>✔</span>
              <span>Interpretación estratégica automática de los datos.</span>
            </li>

            <li className="flex gap-3">
              <span>✔</span>
              <span>
                Detección de horarios con baja ocupación para crear promociones
                inteligentes.
              </span>
            </li>

            <li className="flex gap-3">
              <span>✔</span>
              <span>
                Generación de ideas de contenido y marketing basadas en datos
                reales.
              </span>
            </li>
          </ul>
        </div>

        {/* Ejemplo concreto */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
          <h4 className="font-semibold text-zinc-900 mb-3">
            📊 Ejemplo real de lo que hace el Premium:
          </h4>

          <p className="text-zinc-700 leading-relaxed">
            Si el sistema detecta que los martes entre 14:00 y 17:00 hay baja
            ocupación, generará automáticamente una idea como:
          </p>

          <div className="mt-4 p-4 bg-white border rounded-lg text-sm text-zinc-700 shadow-sm">
            "Promoción Martes Power: 15% de descuento entre 14:00 y 17:00.
            Publicar en Instagram con enfoque en estudiantes o trabajadores con
            horario flexible."
          </div>

          <p className="text-sm text-zinc-600 mt-4">
            Estas ideas se generan utilizando exclusivamente los datos reales de
            tu barbería.
          </p>
        </div>

        {/* Cierre (INTACTO) */}
        <div className="pt-6 border-t border-zinc-200 text-sm text-zinc-600">
          El Plan Premium convierte los datos en crecimiento. Sin estrategia,
          los datos no valen nada. Este plan es el que realmente hace que el
          Plan Básico cobre sentido.
        </div>

        {/* SOLO AÑADIDO: Botón WhatsApp o estado actual */}
        {!esPlanActual ? (
          <div className="flex justify-end">
            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
            >
              Solicitar activación del Plan Premium
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
    </div>
  );
}
