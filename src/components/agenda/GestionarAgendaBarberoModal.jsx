import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const BARBERIA_ID = "2c2812a7-5095-4283-bb00-6c09e22f9c94";

export default function GestionarAgendaBarberoModal({
  visible,
  contexto,
  onClose,
}) {
  const [nombreCliente, setNombreCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipoCorte, setTipoCorte] = useState("");
  const [tiposCorte, setTiposCorte] = useState([]);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

  /* =========================
     ESC
  ========================= */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* =========================
     Cargar tipos
  ========================= */
  useEffect(() => {
    if (!visible) return;

    const cargar = async () => {
      const { data } = await supabase
        .from("tipos_corte")
        .select("id, nombre, precio")
        .eq("barberia_id", BARBERIA_ID)
        .eq("activo", true)
        .order("nombre");

      setTiposCorte(data || []);
    };

    cargar();
  }, [visible]);

  if (!visible || !contexto) return null;

  /* =========================
     VALIDAR
  ========================= */
  const validar = () => {
    const e = {};

    if (!nombreCliente.trim()) {
      e.nombre = "Este campo es obligatorio";
    }

    if (telefono.length !== 8) {
      e.telefono = "Debes poner 8 dígitos";
    }

    if (!tipoCorte) {
      e.tipo = "Este campo es obligatorio";
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  /* =========================
     GUARDAR
  ========================= */
  const handleGuardar = async () => {
    if (!validar()) return;

    setLoading(true);

    const telefonoCompleto = `+569${telefono}`;

    const { data, error } = await supabase.rpc(
      "rpc_crear_agenda",
      {
        p_barberia_id: BARBERIA_ID,
        p_barbero_id: contexto.barbero_id,
        p_fecha: contexto.fecha,
        p_hora: contexto.hora,
        p_servicio: tipoCorte,
        p_nombre_cliente: nombreCliente,
        p_telefono_cliente: telefonoCompleto,
        p_origen: "manual",
      }
    );

    setLoading(false);

    if (error || !data?.success) {
      alert(data?.message || "Error al crear la reserva");
      return;
    }

    onClose();
    window.location.reload();
  };

  /* =========================
     HANDLERS (limpian errores)
  ========================= */

  const handleNombre = (v) => {
    setNombreCliente(v);
    if (v.trim()) {
      setErrores((prev) => ({ ...prev, nombre: undefined }));
    }
  };

  const handleTelefono = (v) => {
    const limpio = v.replace(/\D/g, "");
    setTelefono(limpio);

    if (limpio.length === 8) {
      setErrores((prev) => ({ ...prev, telefono: undefined }));
    }
  };

  const handleTipo = (v) => {
    setTipoCorte(v);
    if (v) {
      setErrores((prev) => ({ ...prev, tipo: undefined }));
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl w-[420px] p-6"
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📅</span>
          <h2 className="text-2xl font-extrabold">
            Agenda para {contexto.barbero_nombre}
          </h2>
        </div>

        <div className="font-bold text-lg mb-4">
          {contexto.fecha} · {contexto.hora}
        </div>

        {/* NOMBRE */}
        <div className="mb-4">
          <span className="inline-block bg-black text-white px-4 py-1 rounded-full text-sm font-semibold mb-2">
            Nombre del cliente
          </span>

          <input
            type="text"
            maxLength={15}
            value={nombreCliente}
            onChange={(e) => handleNombre(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          {errores.nombre && (
            <p className="text-red-600 text-sm mt-1">
              {errores.nombre}
            </p>
          )}
        </div>

        {/* TELÉFONO */}
        <div className="mb-4">
          <span className="inline-block bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-2">
            Teléfono del cliente
          </span>

          <div className="flex">
            <span className="px-3 py-2 border border-r-0 rounded-l bg-gray-100">
              +569
            </span>

            <input
              type="text"
              maxLength={8}
              value={telefono}
              onChange={(e) => handleTelefono(e.target.value)}
              className="w-full border rounded-r px-3 py-2"
            />
          </div>

          {errores.telefono && (
            <p className="text-red-600 text-sm mt-1">
              {errores.telefono}
            </p>
          )}
        </div>

        {/* TIPO */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            Tipo de corte
          </label>

          <select
            value={tipoCorte}
            onChange={(e) => handleTipo(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecciona un corte</option>

            {tiposCorte.map((t) => (
              <option key={t.id} value={t.nombre}>
                {t.nombre} (${t.precio})
              </option>
            ))}
          </select>

          {errores.tipo && (
            <p className="text-red-600 text-sm mt-1">
              {errores.tipo}
            </p>
          )}
        </div>

        {/* BOTONES */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded"
          >
            Cancelar
          </button>

          <button
            onClick={handleGuardar}
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
