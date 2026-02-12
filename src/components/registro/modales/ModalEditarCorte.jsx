import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

const MAX_DIGITOS_PRECIO = 5;
const MAX_NOMBRE = 20;
const DIGITOS_TELEFONO = 8;

export default function ModalEditarCorte({
  corte,
  barberos,
  tiposCorte,
  onClose,
  onActualizado,
}) {
  const [barberoId, setBarberoId] = useState(corte.barbero_id);
  const [tipoCorteId, setTipoCorteId] = useState(corte.tipo_corte_id);
  const [precio, setPrecio] = useState(String(corte.precio));
  const [precioEditable, setPrecioEditable] = useState(() => {
    const tipo = tiposCorte.find(t => t.id === corte.tipo_corte_id);
    return tipo?.precio === null;
  });

  const [nombreCliente, setNombreCliente] = useState(
    corte.nombre_cliente || ""
  );

  const [telefonoCliente, setTelefonoCliente] = useState(
    corte.telefono_cliente
      ? corte.telefono_cliente.replace("+569", "")
      : ""
  );

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  /* =========================
     Cerrar con ESC
  ========================= */
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  function manejarPrecio(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > MAX_DIGITOS_PRECIO) {
      value = value.slice(0, MAX_DIGITOS_PRECIO);
    }
    setPrecio(value);
  }

  function manejarNombre(e) {
    setNombreCliente(e.target.value.slice(0, MAX_NOMBRE));
  }

  function manejarTelefono(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > DIGITOS_TELEFONO) {
      value = value.slice(0, DIGITOS_TELEFONO);
    }
    setTelefonoCliente(value);
  }

  async function guardarEdicion() {
    setError("");

    if (!barberoId) {
      setError("Debe seleccionar un barbero.");
      return;
    }

    if (!tipoCorteId) {
      setError("Debe seleccionar un tipo de corte.");
      return;
    }

    if (!precio || Number(precio) <= 0) {
      setError("El precio es obligatorio.");
      return;
    }

    if (telefonoCliente.length !== DIGITOS_TELEFONO) {
      setError("Número incompleto");
      return;
    }

    setGuardando(true);

    const { error: rpcError } = await supabase.rpc(
      "rpc_editar_corte",
      {
        p_id: corte.id,
        p_barbero_id: barberoId,
        p_tipo_corte_id: tipoCorteId,
        p_precio: Number(precio),
        p_nombre_cliente: nombreCliente,
        p_telefono_cliente: `+569${telefonoCliente}`,
      }
    );

    if (rpcError) {
      setError(rpcError.message);
      setGuardando(false);
      return;
    }

    if (onActualizado) onActualizado();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}   /* CLICK FUERA */
    >
      <div
        className="bg-white p-6 rounded w-[420px] border border-black"
        onClick={(e) => e.stopPropagation()}  /* EVITA cerrar si clic dentro */
      >
        <h3 className="font-semibold mb-4 text-center">
          Editar corte
        </h3>

        {/* BARBERO */}
        <select
          value={barberoId}
          onChange={(e) => setBarberoId(e.target.value)}
          className="w-full border border-black p-2 rounded mb-2"
        >
          <option value="">Seleccionar barbero</option>
          {barberos.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nombre}
            </option>
          ))}
        </select>

        {/* TIPO CORTE */}
        <select
          value={tipoCorteId}
          onChange={(e) => {
            const v = e.target.value;
            setTipoCorteId(v);

            const t = tiposCorte.find((x) => x.id === v);

            if (t?.precio === null) {
              setPrecio("");
              setPrecioEditable(true);
            } else {
              setPrecio(t?.precio || "");
              setPrecioEditable(false);
            }
          }}
          className="w-full border border-black p-2 rounded mb-2"
        >
          <option value="">Seleccionar tipo de corte</option>
          {tiposCorte.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
              {t.precio !== null && ` ($${t.precio})`}
            </option>
          ))}
        </select>

        {/* PRECIO */}
        <input
          type="text"
          value={precio}
          onChange={precioEditable ? manejarPrecio : undefined}
          disabled={!precioEditable}
          className={`w-full border border-black p-2 rounded mb-2 ${
            precioEditable ? "" : "bg-gray-100"
          }`}
        />

        {/* NOMBRE */}
        <input
          type="text"
          value={nombreCliente}
          onChange={manejarNombre}
          placeholder="Nombre cliente"
          className="w-full border border-black p-2 rounded mb-2"
        />

        {/* TELEFONO */}
        <div className="flex mb-3">
          <div className="px-3 py-2 border border-black border-r-0 bg-gray-100 rounded-l">
            +569
          </div>
          <input
            type="text"
            value={telefonoCliente}
            onChange={manejarTelefono}
            placeholder="12345678"
            className="w-full border border-black p-2 rounded-r"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-3">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-black px-4 py-1 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={guardarEdicion}
            disabled={guardando}
            className="bg-black text-white px-4 py-1 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
