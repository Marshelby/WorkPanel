import React from "react";
import { useBarberia } from "../context/BarberiaContext";

// Componentes
import ConfiguracionHeader from "../components/configuracion/ConfiguracionHeader";
import InformacionNegocio from "../components/configuracion/InformacionNegocio";
import BarberosConfigCard from "../components/configuracion/BarberosConfigCard";
import TiposCortesConfigCard from "../components/configuracion/TiposCortesConfigCard";
import HorarioSemanalCard from "../components/configuracion/HorarioSemanalCard";

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
        nombreEmpresa={barberia?.nombre}
        plan={barberia?.plan}
        estadoPlan="Activo"
        fechaPago={barberia?.fecha_pago}
      />

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* INFORMACIÓN NEGOCIO */}
        <InformacionNegocio
          barberiaId={barberia.id}
        />

        {/* BARBEROS */}
        <BarberosConfigCard
          barberiaId={barberia.id}
        />

        {/* TIPOS DE CORTES */}
        <TiposCortesConfigCard
          barberiaId={barberia.id}
        />

        {/* HORARIO SEMANAL */}
        <HorarioSemanalCard
          barberiaId={barberia.id}
        />

      </div>

    </div>
  );
}
