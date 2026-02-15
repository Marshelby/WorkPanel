import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useBarberia } from "../context/BarberiaContext";

import SelectorDiaHorarios from "../components/horarios/SelectorDiaHorarios";
import SelectorSemanaAgenda from "../components/horarios/SelectorSemanaAgenda";
import ModalHorarioBarbero from "../components/horarios/ModalHorarioBarbero";
import HorarioSemanaBarbero from "../components/horarios/HorarioSemanaBarbero";

const toISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function HorariosBarberos() {
  const { barberia, loading } = useBarberia();

  const hoy = new Date();

  const [barberos, setBarberos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(toISO(hoy));
  const [diaCerrado, setDiaCerrado] = useState(false);
  const [loadingCierre, setLoadingCierre] = useState(false);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const weeklyRef = useRef(null);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  /* =========================
     CARGAR BARBEROS (SaaS)
  ========================= */

  useEffect(() => {
    if (!barberia?.id) return;

    const cargarBarberos = async () => {
      const { data, error } = await supabase
        .from("v_barberos")
        .select("id, nombre, barberia_id") // 🔥 NECESARIO
        .eq("barberia_id", barberia.id)
        .order("nombre");

      if (!error) {
        setBarberos(data || []);
      }
    };

    cargarBarberos();
  }, [barberia?.id]);

  /* =========================
     VERIFICAR CRONOGRAMA
  ========================= */

  useEffect(() => {
    if (!barberia?.id || !fechaSeleccionada) return;

    const verificarCierre = async () => {
      setLoadingCierre(true);

      const { data } = await supabase
        .from("v_cronograma_selector")
        .select("local_cerrado")
        .eq("barberia_id", barberia.id)
        .eq("fecha", fechaSeleccionada)
        .maybeSingle();

      setDiaCerrado(!!data?.local_cerrado);
      setLoadingCierre(false);
    };

    verificarCierre();
  }, [barberia?.id, fechaSeleccionada, refreshKey]);

  const irAHorarioSemanal = () => {
    if (weeklyRef.current) {
      weeklyRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (loading) return <p>Cargando barbería...</p>;

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Horarios de barberos
        </h1>
        <p className="text-gray-600 text-lg mt-3">
          Estos horarios aparecen en la página pública de agendas
        </p>
      </div>

      <SelectorDiaHorarios
        barberiaId={barberia?.id}
        fechaSeleccionada={fechaSeleccionada}
        onSelect={setFechaSeleccionada}
      />

      <div className="flex justify-center mt-6">
        <button
          onClick={irAHorarioSemanal}
          className="px-6 py-3 rounded-xl bg-black text-white font-semibold tracking-wide
                     hover:bg-zinc-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          VER HORARIO SEMANAL
        </button>
      </div>

      {diaCerrado && (
        <div className="text-center mt-6 mb-4">
          <div className="text-red-600 font-bold tracking-wide text-lg">
            LOCAL CERRADO POR CRONOGRAMA
          </div>
        </div>
      )}

      {/* VISTA DÍA */}
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
            modoIntegrado
            bloqueado={diaCerrado}
            onHorarioGuardado={triggerRefresh}
          />
        ))}
      </div>

      {loadingCierre && (
        <div className="text-center text-gray-400 mt-6 text-sm">
          Verificando estado del cronograma...
        </div>
      )}

      {/* VISTA SEMANA */}
      <div
        ref={weeklyRef}
        className="mt-24 border-t border-zinc-200 pt-14"
      >
        <div className="text-center mb-12">
          <div className="inline-block px-10 py-6 rounded-3xl bg-white border-2 border-black shadow-lg">
            <h2 className="text-4xl font-extrabold tracking-tight">
              Vista semanal
            </h2>
            <p className="text-gray-500 mt-2">
              Visualización completa de horarios por semana
            </p>
          </div>
        </div>

        <SelectorSemanaAgenda
          onSelectSemana={setSemanaSeleccionada}
        />

        {semanaSeleccionada && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">
            {barberos.map((b) => (
              <HorarioSemanaBarbero
                key={b.id}
                barbero={b}
                semana={semanaSeleccionada}
                barberiaId={barberia?.id}   // 🔥 PASAMOS EL ID REAL
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
