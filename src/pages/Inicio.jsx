import React from "react";
import { useWork } from "../context/WorkContext";

// Componentes
import ConfiguracionHeader from "../components/configuracion/ConfiguracionHeader";
import InformacionEmpresa from "../components/configuracion/InformacionEmpresa";

export default function Configuracion() {

  const { empresa, loading } = useWork();

  if (loading) {
    return (
      <div className="text-sm text-zinc-500">
        Cargando configuración...
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="text-sm text-red-500">
        No se encontró empresa asociada al usuario.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <ConfiguracionHeader
        nombreEmpresa={empresa?.nombre_empresa}
      />

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* INFORMACIÓN EMPRESA */}
        <InformacionEmpresa
          empresaId={empresa.id}
        />

      </div>

    </div>
  );
}
