import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import BarberoCard from "../components/barberos/BarberoCard";
import DetalleBarberoDia from "../components/barberos/DetalleBarberoDia";
import DetalleBarberoMes from "../components/barberos/DetalleBarberoMes";

/* =========================
   HELPERS
========================= */

function formatHoraCL(dateStr) {
  return new Date(dateStr).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFechaCL(dateStr) {
  return new Date(dateStr).toLocaleDateString("es-CL");
}

function formatDiaCL(dateStr) {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    weekday: "long",
  });
}

function agruparPorFecha(cortes) {
  return cortes.reduce((acc, c) => {
    const fecha = formatFechaCL(c.created_at);
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(c);
    return acc;
  }, {});
}

/* =========================
   COMPONENTE
========================= */

export default function Barberos() {
  const [barberos, setBarberos] = useState([]);
  const [statsMap, setStatsMap] = useState({});

  const [modalAbierto, setModalAbierto] = useState(false);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState(null);
  const [tabModal, setTabModal] = useState("hoy");

  const [cortesHoy, setCortesHoy] = useState([]);
  const [cortesMes, setCortesMes] = useState([]);

  const [totalesDia, setTotalesDia] = useState({
    total_cortes: 0,
    total_precio: 0,
    total_barbero: 0,
  });

  const [totalesMes, setTotalesMes] = useState({
    total_cortes: 0,
    total_precio: 0,
    total_barbero: 0,
  });

  useEffect(() => {
    cargarTodo();
  }, []);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape" && modalAbierto) {
        cerrarModal();
      }
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [modalAbierto]);

  async function cargarTodo() {
    const { data: listaBarberos } = await supabase
      .from("barberos")
      .select("id, nombre")
      .order("nombre");

    const { data: calculoDia } = await supabase
      .from("v_calculo_dia_barbero")
      .select("*");

    const { data: calculoMes } = await supabase
      .from("v_calculo_mes_barbero")
      .select("*");

    const mapa = {};

    (listaBarberos || []).forEach((b) => {
      const dia = calculoDia?.find((d) => d.barbero_id === b.id);
      const mes = calculoMes?.find((m) => m.barbero_id === b.id);

      mapa[b.id] = {
        total_hoy: dia?.total_precio ?? 0,
        cortes_hoy: dia?.total_cortes ?? 0,
        ganancia_mes: mes?.total_precio ?? 0,
        cortes_mes: mes?.total_cortes ?? 0,
      };
    });

    setBarberos(listaBarberos || []);
    setStatsMap(mapa);
  }

  async function abrirModal(barbero) {
    setBarberoSeleccionado(barbero);
    setTabModal("hoy");
    setModalAbierto(true);

    const { data: hoy } = await supabase
      .from("v_cortes_hoy")
      .select("*")
      .eq("barbero_id", barbero.id)
      .order("created_at", { ascending: false });

    setCortesHoy(hoy || []);

    const { data: calculoDia } = await supabase
      .from("v_calculo_dia_barbero")
      .select("*")
      .eq("barbero_id", barbero.id)
      .single();

    setTotalesDia({
      total_cortes: calculoDia?.total_cortes ?? 0,
      total_precio: calculoDia?.total_precio ?? 0,
      total_barbero: calculoDia?.total_barbero ?? 0,
    });

    const { data: mes } = await supabase
      .from("v_cortes_mes_barbero")
      .select("*")
      .eq("barbero_id", barbero.id)
      .order("created_at", { ascending: false });

    setCortesMes(mes || []);

    const { data: calculoMes } = await supabase
      .from("v_calculo_mes_barbero")
      .select("*")
      .eq("barbero_id", barbero.id)
      .single();

    setTotalesMes({
      total_cortes: calculoMes?.total_cortes ?? 0,
      total_precio: calculoMes?.total_precio ?? 0,
      total_barbero: calculoMes?.total_barbero ?? 0,
    });
  }

  function cerrarModal() {
    setModalAbierto(false);
    setBarberoSeleccionado(null);
    setCortesHoy([]);
    setCortesMes([]);
  }

  const cortesAgrupados =
    tabModal === "mes" ? agruparPorFecha(cortesMes) : null;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-extrabold">Barberos</h1>

      <p className="text-lg text-black mt-3 mb-10 max-w-3xl leading-relaxed">
        Visualiza el rendimiento individual de cada barbero. Consulta cortes del día,
        historial mensual y distribución de ingresos en tiempo real.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {barberos.map((b) => (
          <BarberoCard
            key={b.id}
            barbero={b}
            stats={statsMap[b.id]}
            onClick={() => abrirModal(b)}
          />
        ))}
      </div>

      {modalAbierto && barberoSeleccionado && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onMouseDown={(e) =>
            e.target === e.currentTarget && cerrarModal()
          }
        >
          <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-xl flex flex-col relative">
            <button
              onClick={cerrarModal}
              className="absolute top-4 right-4 text-xl"
            >
              ✕
            </button>

            <div className="sticky top-0 bg-white z-10 p-6 border-b">
              <div className="flex rounded-lg overflow-hidden w-fit border">
                <button
                  onClick={() => setTabModal("hoy")}
                  className={`px-6 py-2 font-semibold ${
                    tabModal === "hoy"
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  📅 HOY
                </button>

                <button
                  onClick={() => setTabModal("mes")}
                  className={`px-6 py-2 font-semibold ${
                    tabModal === "mes"
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  📆 ESTE MES
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-6 pb-6">
              {tabModal === "hoy" ? (
                <DetalleBarberoDia
                  cortes={cortesHoy}
                  totalPeriodo={totalesDia}
                  formatHoraCL={formatHoraCL}
                />
              ) : (
                <DetalleBarberoMes
                  cortesAgrupados={cortesAgrupados}
                  totalPeriodo={totalesMes}
                  formatHoraCL={formatHoraCL}
                  formatDiaCL={formatDiaCL}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
