import React from "react";

export default function PlanProfesionalInfo({
  nombreEmpresa = "",
  planActual = "",
}) {

  const numeroSoporte = "56989843031";

  const mensaje = `Te hablo desde BarberPanel. Soy el administrador de la barbería "${nombreEmpresa}" y quiero cambiar mi plan a "Plan Profesional".`;

  const urlWhatsapp = `https://wa.me/${numeroSoporte}?text=${encodeURIComponent(mensaje)}`;

  const esPlanActual = planActual === "profesional";

  return (
    <div className="space-y-10">

      <div className="relative space-y-10">

        {/* Badge superior */}
        <div
          className={`absolute top-0 right-0 text-xs px-3 py-1 rounded-full shadow-md ${
            esPlanActual
              ? "bg-green-600 text-white"
              : "bg-black text-yellow-400"
          }`}
        >
          {esPlanActual ? "PLAN ACTUAL" : "PLAN AVANZADO"}
        </div>

        {/* Título */}
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 bg-clip-text text-transparent">
            👑 Plan Profesional
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Automatización total, ejecución inteligente y posicionamiento avanzado.
          </p>
        </div>

        {/* Separador */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        {/* Descripción */}
        <div className="text-zinc-700 leading-relaxed text-lg">
          El Plan Profesional incluye todo lo del Plan Premium,
          pero da el salto definitivo: no solo interpreta los datos,
          sino que ejecuta automáticamente las estrategias detectadas
          para acelerar el crecimiento de tu barbería.
        </div>

        {/* Lista tecnológica */}
        <div>
          <h3 className="font-semibold text-zinc-900 mb-4 text-lg">
            Este plan incluye:
          </h3>

          <ul className="space-y-5 text-zinc-700">

            <li className="flex gap-3">
              <span>⚡</span>
              <span>Todo lo incluido en el Plan Premium.</span>
            </li>

            <li className="flex gap-3">
              <span>🤖</span>
              <span>Generación automática de contenido promocional.</span>
            </li>

            <li className="flex gap-3">
              <span>🎨</span>
              <span>Creación de imágenes personalizadas para la empresa.</span>
            </li>

            <li className="flex gap-3">
              <span>🎬</span>
              <span>Generación de videos promocionales automáticos.</span>
            </li>

            <li className="flex gap-3">
              <span>🚀</span>
              <span>
                Ejecución automática de las estrategias detectadas por el sistema.
              </span>
            </li>

            <li className="flex gap-3">
              <span>📲</span>
              <span>
                Envío directo al número del administrador para validación previa.
              </span>
            </li>

          </ul>
        </div>

        {/* Ejemplo comparativo Premium vs Pro */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">

          <h4 className="font-semibold text-zinc-900 mb-3">
            📊 Ejemplo real:
          </h4>

          <p className="text-zinc-700 leading-relaxed mb-4">
            Si el Plan Premium detecta que puedes hacer un sorteo
            exclusivo para clientes del mes, te entregará la idea estratégica.
          </p>

          <p className="text-zinc-700 leading-relaxed">
            El Plan Profesional va más allá:
          </p>

          <div className="mt-4 p-4 bg-white border rounded-lg text-sm text-zinc-700 shadow-sm">
            Genera automáticamente el video promocional,
            crea las imágenes del sorteo, selecciona al ganador
            de forma aleatoria y ejecuta el proceso completo.
          </div>

        </div>

        {/* Bloque oscuro automatización */}
        <div className="bg-black text-white rounded-xl p-6 shadow-xl">
          <h4 className="font-bold mb-3 text-yellow-400">
            🚀 Modo Automatizado
          </h4>

          <p className="text-sm text-zinc-300 leading-relaxed">
            El sistema detecta oportunidades de crecimiento,
            genera automáticamente contenido visual y estratégico,
            ejecuta la acción y lo envía listo para aprobación.
            Tu barbería comienza a operar con inteligencia automatizada.
          </p>
        </div>

        {/* Avatar Digital */}
        <div className="bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-100 border border-yellow-300 rounded-xl p-6 shadow-inner">

          <h4 className="font-bold text-yellow-700 text-lg mb-3">
            🎭 Avatar Digital Empresarial
          </h4>

          <p className="text-zinc-700 leading-relaxed">
            Integra un avatar digital que represente la identidad
            de tu barbería. Puede ser la clonación visual de alguien
            de la empresa o una identidad creada desde cero.
          </p>

          <p className="text-sm text-zinc-600 mt-4">
            La creación del avatar tiene un costo adicional único
            y forma parte del posicionamiento estratégico de marca.
          </p>

        </div>

        {/* Separador final */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        {/* Cierre */}
        <div className="text-sm text-zinc-600">
          El Plan Profesional no solo analiza tu barbería…
          la transforma en una máquina de crecimiento automatizado.
        </div>

        {/* BOTÓN SOLO SI NO ES PLAN ACTUAL */}
        {!esPlanActual && (
          <div className="pt-4">
            <a
              href={urlWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center bg-black text-yellow-400 font-semibold px-6 py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Solicitar Plan Profesional
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
