import React, { useMemo, useState } from "react";

export default function InfoNegocioModal({
  isOpen,
  onClose,
  barberiaId,
  nombreActual,
  telefonoActual,
  ubicacionActual,
}) {
  // ✅ HOOKS SIEMPRE ARRIBA (SIN IF ANTES)
  const [campo, setCampo] = useState(null);
  const [valorNuevo, setValorNuevo] = useState("");
  const [mostrarPlantilla, setMostrarPlantilla] = useState(false);

  // ✅ MEMOS ARRIBA TAMBIÉN
  const etiquetaCampo = useMemo(() => {
    if (campo === "nombre") return "Nombre del negocio";
    if (campo === "telefono") return "Teléfono administrador";
    if (campo === "ubicacion") return "Ubicación del local";
    return "";
  }, [campo]);

  const valorActual = useMemo(() => {
    if (campo === "nombre") return nombreActual;
    if (campo === "telefono") return telefonoActual;
    if (campo === "ubicacion") return ubicacionActual;
    return "";
  }, [campo, nombreActual, telefonoActual, ubicacionActual]);

  const plantilla = useMemo(() => {
    if (!campo || !valorNuevo) return "";

    return `
SOLICITUD DE CAMBIO - INFORMACIÓN NEGOCIO

Barberia ID: ${barberiaId}
Módulo: INFORMACION
Campo a modificar: ${etiquetaCampo}

Valor actual:
${valorActual}

Nuevo valor solicitado:
${valorNuevo}

Fecha solicitud: ${new Date().toLocaleString()}
Estado: Pendiente
    `.trim();
  }, [campo, valorNuevo, barberiaId, etiquetaCampo, valorActual]);

  // ✅ AHORA SÍ EL RETURN CONDICIONAL
  if (!isOpen) return null;

  const reset = () => {
    setCampo(null);
    setValorNuevo("");
    setMostrarPlantilla(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const copiarPlantilla = async () => {
    try {
      await navigator.clipboard.writeText(plantilla);
      alert("Plantilla copiada");
    } catch {
      alert("No se pudo copiar");
    }
  };

  const enviarWhatsApp = () => {
    const numeroSoporte = "56900000000";
    const mensaje = encodeURIComponent(plantilla);
    window.open(`https://wa.me/${numeroSoporte}?text=${mensaje}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 relative">

        {/* Cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700"
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold text-zinc-900 mb-2">
          Modificar Información del Negocio
        </h2>

        <p className="text-sm text-zinc-500 mb-6">
          ¿Qué dato deseas modificar?
        </p>

        {/* Selección campo */}
        {!campo && (
          <div className="grid gap-3 mb-6">
            <button
              onClick={() => setCampo("nombre")}
              className="py-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 font-medium transition"
            >
              🏢 Cambiar nombre del negocio
            </button>

            <button
              onClick={() => setCampo("telefono")}
              className="py-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 font-medium transition"
            >
              📞 Cambiar teléfono administrador
            </button>

            <button
              onClick={() => setCampo("ubicacion")}
              className="py-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 font-medium transition"
            >
              📍 Cambiar ubicación
            </button>
          </div>
        )}

        {/* Formulario */}
        {campo && !mostrarPlantilla && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-600">
                {etiquetaCampo}
              </label>

              <div className="text-xs text-zinc-400 mb-2">
                Valor actual: {valorActual}
              </div>

              <input
                type="text"
                value={valorNuevo}
                onChange={(e) => setValorNuevo(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300"
              />
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCampo(null)}
                className="text-sm text-zinc-500 hover:text-zinc-800"
              >
                ← Volver
              </button>

              <button
                onClick={() => setMostrarPlantilla(true)}
                disabled={!valorNuevo}
                className="px-5 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-black transition disabled:opacity-50"
              >
                Crear solicitud
              </button>
            </div>
          </div>
        )}

        {/* Plantilla */}
        {mostrarPlantilla && (
          <div className="space-y-4">
            <div className="text-sm font-medium text-zinc-700">
              Plantilla generada
            </div>

            <textarea
              readOnly
              value={plantilla}
              className="w-full h-48 p-4 border border-zinc-200 rounded-xl text-sm bg-zinc-50"
            />

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setMostrarPlantilla(false)}
                className="text-sm text-zinc-500 hover:text-zinc-800"
              >
                ← Editar
              </button>

              <div className="flex gap-3">
                <button
                  onClick={copiarPlantilla}
                  className="px-4 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-sm font-medium"
                >
                  📋 Copiar
                </button>

                <button
                  onClick={enviarWhatsApp}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                >
                  💬 WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
