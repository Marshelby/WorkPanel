import React from "react";
import { useBarberia } from "../context/BarberiaContext";

// Componentes
import ConfiguracionHeader from "../components/configuracion/ConfiguracionHeader";
import InformacionNegocio from "../components/configuracion/InformacionNegocio";
import BarberosConfigCard from "../components/configuracion/BarberosConfigCard";
import TiposCortesConfigCard from "../components/configuracion/TiposCortesConfigCard";
import HorarioSemanalCard from "../components/configuracion/HorarioSemanalCard";
import SolicitarCambioCard from "../components/configuracion/SolicitarCambioCard";

export default function Configuracion() {

  const { barberia, loading } = useBarberia();

  if (loading) {
    return (
      <div className="text-sm text-zinc-500">
        Cargando configuración...
      </div>
    );
  }

  if (!barberia) {
    return (
      <div className="text-sm text-red-500">
        No se encontró barbería asociada al usuario.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <ConfiguracionHeader
        nombreEmpresa={barberia.nombre}
        estadoPlan="Plan Activo"
        ultimaActualizacion="13/02/2026"
      />

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        <InformacionNegocio
          nombre={barberia.nombre}
          telefono={barberia.telefono_admin}
          ubicacion={barberia.ubicacion}
        />

        <BarberosConfigCard
          barberiaId={barberia.id}
        />

        <TiposCortesConfigCard
          barberiaId={barberia.id}
        />

        <HorarioSemanalCard
          barberiaId={barberia.id}
        />

      </div>

      {/* CTA FINAL */}
      <SolicitarCambioCard
        nombreEmpresa={barberia.nombre}
        telefonoSoporte="+56900000000"
      />

    </div>
  );
}
