import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import RegistroCorte from "../components/registro/RegistroCorte";
import CortesHoy from "../components/registro/CortesHoy";

export default function RegistrarCorte() {
  const [barberos, setBarberos] = useState([]);
  const [tiposCorte, setTiposCorte] = useState([]);

  const [resumen, setResumen] = useState({
    total_precio: 0,
    total_barberos: 0,
    total_barberia: 0,
    total_cortes: 0,
  });

  useEffect(() => {
    cargarTodo();
  }, []);

  async function cargarTodo() {
    await Promise.all([
      cargarBarberos(),
      cargarTiposCorte(),
      cargarResumen(),
    ]);
  }

  async function cargarBarberos() {
    const { data } = await supabase
      .from("barberos")
      .select("id,nombre")
      .order("nombre");

    setBarberos(data || []);
  }

  async function cargarTiposCorte() {
    const { data } = await supabase
      .from("tipos_corte")
      .select("id,nombre,precio")
      .eq("activo", true)
      .order("nombre");

    setTiposCorte(data || []);
  }

  async function cargarResumen() {
    const { data } = await supabase
      .from("v_calculo_dia")
      .select("*")
      .single();

    if (data) {
      setResumen(data);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* RESUMEN */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border border-black p-4 rounded">
          <div className="text-sm text-zinc-500">Total día</div>
          <div className="text-2xl font-bold">
            ${Number(resumen.total_precio).toLocaleString("es-CL")}
          </div>
        </div>

        <div className="bg-white border border-black p-4 rounded">
          <div className="text-sm text-zinc-500">Total barberos</div>
          <div className="text-2xl font-bold">
            ${Number(resumen.total_barberos).toLocaleString("es-CL")}
          </div>
        </div>

        <div className="bg-white border border-black p-4 rounded">
          <div className="text-sm text-zinc-500">Total barbería</div>
          <div className="text-2xl font-bold">
            ${Number(resumen.total_barberia).toLocaleString("es-CL")}
          </div>
        </div>

        <div className="bg-white border border-black p-4 rounded">
          <div className="text-sm text-zinc-500">Cortes</div>
          <div className="text-2xl font-bold">
            {resumen.total_cortes}
          </div>
        </div>
      </div>

      {/* FORM + LISTADO */}
      <div className="grid md:grid-cols-[360px_1fr] gap-6 items-start">
        <RegistroCorte
          barberos={barberos}
          tiposCorte={tiposCorte}
          onCorteRegistrado={cargarResumen}
        />

        <CortesHoy
          onActualizado={() => {
            cargarResumen();
          }}
        />
      </div>
    </div>
  );
}
