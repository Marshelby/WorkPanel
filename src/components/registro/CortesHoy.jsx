import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import ModalEditarCorte from "./modales/ModalEditarCorte";
import ModalEliminarCorte from "./modales/ModalEliminarCorte";

export default function CortesHoy({ onActualizado }) {
  const [cortes, setCortes] = useState([]);
  const [barberos, setBarberos] = useState([]);
  const [tiposCorte, setTiposCorte] = useState([]);

  const [corteEditar, setCorteEditar] = useState(null);
  const [corteEliminar, setCorteEliminar] = useState(null);

  useEffect(() => {
    cargarTodo();
  }, []);

  async function cargarTodo() {
    await Promise.all([
      cargarCortesHoy(),
      cargarBarberos(),
      cargarTipos(),
    ]);
  }

  async function cargarCortesHoy() {
    const { data } = await supabase
      .from("v_cortes_hoy")
      .select("*")
      .order("created_at", { ascending: false });

    setCortes(data || []);
  }

  async function cargarBarberos() {
    const { data } = await supabase
      .from("barberos")
      .select("id,nombre")
      .order("nombre");

    setBarberos(data || []);
  }

  async function cargarTipos() {
    const { data } = await supabase
      .from("tipos_corte")
      .select("id,nombre,precio")
      .order("nombre");

    setTiposCorte(data || []);
  }

  function formatearHora(fecha) {
    return new Date(fecha).toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="bg-white border border-black p-4 rounded">
      <h2 className="text-lg font-semibold pb-2 border-b border-black mb-4">
        Cortes de hoy
      </h2>

      <div className="max-h-[420px] overflow-y-auto">

        {/* HEADER */}
        <div className="grid grid-cols-9 text-sm font-semibold border-b border-black pb-2">
          <div>Hora</div>
          <div>Barbero</div>
          <div>Corte</div>
          <div>Cliente</div>
          <div>Teléfono</div>
          <div className="text-right">Precio</div>
          <div className="text-right">Acciones</div>
          <div className="text-center">Editado</div>
          <div className="text-center">Hora edición</div>
        </div>

        {cortes.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-9 text-sm py-3 border-b border-black/40 items-center"
          >
            {/* Hora */}
            <div>{formatearHora(c.created_at)}</div>

            {/* Barbero */}
            <div>{c.barbero_nombre}</div>

            {/* Corte */}
            <div>{c.tipo_corte_nombre}</div>

            {/* Cliente */}
            <div>{c.nombre_cliente || "-"}</div>

            {/* Teléfono */}
            <div>{c.telefono_cliente || "-"}</div>

            {/* Precio */}
            <div className="text-right font-medium">
              ${c.precio.toLocaleString("es-CL")}
            </div>

            {/* Acciones */}
            <div className="text-right space-x-3">
              <button
                onClick={() => setCorteEditar(c)}
                className="underline text-zinc-700"
              >
                Editar
              </button>
              <button
                onClick={() => setCorteEliminar(c.id)}
                className="underline text-red-600"
              >
                Eliminar
              </button>
            </div>

            {/* Editado */}
            <div className="text-center">
              {c.edicion === "editado" ? (
                <span className="text-orange-600 font-medium">
                  Sí
                </span>
              ) : (
                <span className="text-zinc-500">
                  No
                </span>
              )}
            </div>

            {/* Hora edición */}
            <div className="text-center">
              {c.hora_edicion
                ? formatearHora(c.hora_edicion)
                : "-"}
            </div>
          </div>
        ))}

        {cortes.length === 0 && (
          <div className="text-center text-sm text-zinc-500 py-6">
            No hay cortes registrados hoy.
          </div>
        )}
      </div>

      {/* MODAL EDITAR */}
      {corteEditar && (
        <ModalEditarCorte
          corte={corteEditar}
          barberos={barberos}
          tiposCorte={tiposCorte}
          onClose={() => setCorteEditar(null)}
          onActualizado={() => {
            cargarCortesHoy();
            if (onActualizado) onActualizado();
          }}
        />
      )}

      {/* MODAL ELIMINAR */}
      {corteEliminar && (
        <ModalEliminarCorte
          corteId={corteEliminar}
          onClose={() => setCorteEliminar(null)}
          onActualizado={() => {
            cargarCortesHoy();
            if (onActualizado) onActualizado();
          }}
        />
      )}
    </div>
  );
}
