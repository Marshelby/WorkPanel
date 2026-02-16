import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useBarberia } from "../context/BarberiaContext";

export default function Dashboard() {
  const { barberia } = useBarberia();
  const barberiaId = barberia?.id;

  const [barberos, setBarberos] = useState([]);
  const [resumenDia, setResumenDia] = useState({
    total_cortes: 0,
    total_ingresos: 0,
  });
  const [ingresosMes, setIngresosMes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (barberiaId) cargarDatos();
  }, [barberiaId]);

  async function cargarDatos() {
    setLoading(true);

    /* =========================
       1️⃣ DIA POR BARBERO
    ========================== */
    const { data: diaBarberos } = await supabase
      .from("v_calculo_dia_barbero")
      .select("*")
      .eq("barberia_id", barberiaId);

    /* =========================
       2️⃣ LISTA BARBEROS
    ========================== */
    const { data: listaBarberos } = await supabase
      .from("v_barberos")
      .select("id, nombre")
      .eq("barberia_id", barberiaId)
      .eq("activo", true);

    /* =========================
       3️⃣ MES GLOBAL
    ========================== */
    const { data: mesGlobal } = await supabase
      .from("v_calculo_mes_global")
      .select("*")
      .eq("barberia_id", barberiaId)
      .maybeSingle();

    /* =========================
       ARMAR BARBEROS CON CORTES
    ========================== */
    const finalBarberos = (listaBarberos || []).map((b) => {
      const datosDia = diaBarberos?.find(
        (d) => d.barbero_id === b.id
      );

      return {
        id: b.id,
        nombre: b.nombre,
        cortes: datosDia?.total_cortes || 0,
        ingreso: datosDia?.total_precio || 0,
      };
    });

    /* =========================
       RESUMEN DIA (SUMA DESDE VIEW)
    ========================== */
    const totalCortesDia =
      diaBarberos?.reduce((acc, d) => acc + Number(d.total_cortes), 0) || 0;

    const totalIngresoDia =
      diaBarberos?.reduce((acc, d) => acc + Number(d.total_precio), 0) || 0;

    setBarberos(finalBarberos);

    setResumenDia({
      total_cortes: totalCortesDia,
      total_ingresos: totalIngresoDia,
    });

    setIngresosMes(Number(mesGlobal?.total_precio || 0));

    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Inicio
        </h1>
        <p className="text-gray-500 mt-1">
          Resumen general de la barbería
        </p>
      </div>

      {/* BARBEROS */}
      <div className="bg-white border border-black rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Barberos activos hoy
        </h2>

        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {barberos.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between border border-gray-200 rounded-xl p-4 hover:shadow transition"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {b.nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    {b.cortes} cortes hoy
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    Ingreso hoy
                  </p>
                  <p className="font-semibold">
                    ${b.ingreso.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESUMEN */}
      <div className="grid md:grid-cols-3 gap-6">
        <ResumenCard
          titulo="Cortes totales hoy"
          valor={resumenDia.total_cortes}
        />
        <ResumenCard
          titulo="Ingresos del día"
          valor={`$${resumenDia.total_ingresos.toLocaleString()}`}
        />
        <ResumenCard
          titulo="Ingresos del mes"
          valor={`$${ingresosMes.toLocaleString()}`}
        />
      </div>
    </div>
  );
}

function ResumenCard({ titulo, valor }) {
  return (
    <div className="bg-white border border-black rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-500 mb-2">{titulo}</p>
      <p className="text-2xl font-bold">{valor}</p>
    </div>
  );
}
