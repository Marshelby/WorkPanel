import React from "react";

export default function SolicitarCambioCard({
  nombreEmpresa = "Barbería Ejemplo",
  telefonoSoporte = "+56900000000",
}) {
  const mensaje = `Hola, quiero solicitar una modificación en la configuración de mi BarberPanel.\nEmpresa: ${nombreEmpresa}`;

  const urlWhatsApp = `https://wa.me/${telefonoSoporte.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(mensaje)}`;

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
      
      <h2 className="text-lg font-semibold mb-4 tracking-tight">
        🛠 Solicitar modificación
      </h2>

      <p className="text-sm text-zinc-600 leading-relaxed">
        Si necesitas realizar algún cambio estructural en tu Panel
        (barberos, precios, horarios o configuración interna),
        puedes solicitarlo directamente a nuestro equipo.
      </p>

      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="text-xs text-zinc-400">
          Nuestro equipo verificará la solicitud y actualizará tu Panel
          para mantener la integridad del sistema.
        </div>

        <a
          href={urlWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center gap-2
            px-5 py-2.5
            rounded-lg
            bg-zinc-900
            text-white
            text-sm
            font-medium
            transition-all duration-200
            hover:bg-black
          "
        >
          💬 Contactar soporte
        </a>

      </div>
    </div>
  );
}
