import React from "react";

export default function ConfiguracionHeader({
  nombreEmpresa = "Nombre barbería",
  estadoPlan = "Plan Activo",
  ultimaActualizacion = "13/02/2026",
}) {
  return (
    <div
      className="
        relative
        rounded-2xl
        border border-zinc-200/60
        bg-gradient-to-br from-white to-zinc-50
        p-9
        shadow-sm
      "
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
        
        {/* IZQUIERDA */}
        <div className="space-y-6 max-w-3xl">
          
          {/* Título */}
          <div className="flex items-center gap-4">
            <div
              className="
                w-12 h-12
                flex items-center justify-center
                rounded-xl
                bg-white
                shadow-md
                border border-zinc-200
                text-xl
              "
            >
              ⚙️
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                Configuración
              </h1>

              <p className="text-base font-medium text-zinc-600 mt-1">
                Administra la estructura y ajustes principales de tu barbería
              </p>
            </div>
          </div>

          {/* Descripción principal mejorada */}
          <p className="text-base font-medium text-zinc-700 leading-relaxed">
            Desde aquí puedes agregar o quitar barberos, precios, horarios y
            configuraciones estructurales del sistema. Cualquier modificación
            que quieras hacer debes pedirla al soporte para que sea aplicada.
          </p>

          {/* Info inferior */}
          <div
            className="
              flex flex-wrap items-center gap-5
              text-sm
              text-zinc-500
              pt-5
              border-t border-zinc-200/70
            "
          >
            <div>
              Última actualización:
              <span className="ml-2 font-semibold text-zinc-700">
                {ultimaActualizacion}
              </span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-zinc-300"></div>

            <div className="font-semibold text-zinc-600 tracking-wide">
              {nombreEmpresa}
            </div>
          </div>
        </div>

        {/* DERECHA */}
        <div className="flex flex-col items-start lg:items-end gap-4 min-w-[220px]">
          <div className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
            Estado del plan
          </div>

          <div
            className="
              flex items-center gap-3
              px-6 py-3
              rounded-full
              bg-green-50
              border border-green-200
              text-green-800
              text-base
              font-semibold
              shadow-sm
            "
          >
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            {estadoPlan}
          </div>
        </div>

      </div>
    </div>
  );
}
