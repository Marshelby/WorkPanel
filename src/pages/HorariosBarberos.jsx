import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import SelectorDiaHorarios from "../components/horarios/SelectorDiaHorarios";
import ModalHorarioBarbero from "../components/horarios/ModalHorarioBarbero";

/* ISO estable */
const toISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function HorariosBarberos() {
  const hoy = new Date();

  const [barberos, setBarberos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(toISO(hoy));
  const [barberiaId, setBarberiaId] = useState(null);
  const [diaCerrado, setDiaCerrado] = useState(false);
  const [loadingCierre, setLoadingCierre] = useState(false);

  /* =========================
     CARGAR BARBEROS
  ========================= */
  useEffect(() => {
    const cargarBarberos = async () => {
      const { data, error } = await supabase
        .from("barberos")
        .select("id, nombre, barberia_id")
        .order("nombre");

      if (!error && data?.length) {
        setBarberos(data);
        setBarberiaId(data[0].barberia_id);
      }
    };

    cargarBarberos();
  }, []);

  /* =========================
     VERIFICAR SI DÍA CERRADO
  ========================= */
  useEffect(() => {
    if (!barberiaId || !fechaSeleccionada) return;

    const verificarCierre = async () => {
      setLoadingCierre(true);

      const { data, error } = await supabase
        .from("v_cronograma_selector")
        .select("local_cerrado")
        .eq("barberia_id", barberiaId)
        .eq("fecha", fechaSeleccionada)
        .maybeSingle();

      if (error) {
        console.error("Error verificando cierre:", error);
        setDiaCerrado(false);
      } else {
        setDiaCerrado(!!data?.local_cerrado);
      }

      setLoadingCierre(false);
    };

    verificarCierre();
  }, [barberiaId, fechaSeleccionada]);

  return (
    <div className="p-8">

      {/* =========================
          HEADER CENTRALIZADO
      ========================= */}
      <div className="text-center mb-10">

        <h1 className="text-5xl font-extrabold tracking-tight">
          Horarios de barberos
        </h1>

        <p className="text-gray-600 text-lg mt-3">
          Estos horarios aparecen en la página pública de agendas
        </p>

      </div>

      {/* SELECTOR */}
      <SelectorDiaHorarios
        barberiaId={barberiaId}
        fechaSeleccionada={fechaSeleccionada}
        onSelect={setFechaSeleccionada}
      />

      {/* MENSAJE GLOBAL DE CIERRE */}
      {diaCerrado && (
        <div className="text-center mt-6 mb-4">
          <div className="text-red-600 font-bold tracking-wide text-lg">
            LOCAL CERRADO POR CRONOGRAMA
          </div>
        </div>
      )}

      {/* GRID BARBEROS */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 transition-all duration-300 ${
          diaCerrado ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {barberos.map((b) => (
          <ModalHorarioBarbero
            key={b.id}
            barbero={b}
            fecha={fechaSeleccionada}
            modoIntegrado={true}
            bloqueado={diaCerrado}
          />
        ))}
      </div>

      {loadingCierre && (
        <div className="text-center text-gray-400 mt-6 text-sm">
          Verificando estado del cronograma...
        </div>
      )}

    </div>
  );
}
