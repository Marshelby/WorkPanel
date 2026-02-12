import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

const MAX_DIGITOS_PRECIO = 5;
const MAX_NOMBRE = 20;
const DIGITOS_TELEFONO = 8;

export default function RegistroCorte({
  barberos,
  tiposCorte,
  onCorteRegistrado,
}) {
  const navigate = useNavigate();

  const [barberoId, setBarberoId] = useState("");
  const [tipoCorteId, setTipoCorteId] = useState("");
  const [precio, setPrecio] = useState("");
  const [precioEditable, setPrecioEditable] = useState(false);

  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");

  const [estadoBarbero, setEstadoBarbero] = useState(null);
  const [registrando, setRegistrando] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const bloqueado =
    estadoBarbero === "no_disponible" || estadoBarbero === "en_almuerzo";

  async function verificarEstado(barbero_id) {
    if (!barbero_id) {
      setEstadoBarbero(null);
      return;
    }

    const { data } = await supabase
      .from("estado_actual")
      .select("estado")
      .eq("barbero_id", barbero_id)
      .single();

    setEstadoBarbero(data?.estado || null);
  }

  function manejarPrecio(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > MAX_DIGITOS_PRECIO) {
      value = value.slice(0, MAX_DIGITOS_PRECIO);
    }
    setPrecio(value);
  }

  function manejarNombre(e) {
    const value = e.target.value.slice(0, MAX_NOMBRE);
    setNombreCliente(value);
  }

  function manejarTelefono(e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > DIGITOS_TELEFONO) {
      value = value.slice(0, DIGITOS_TELEFONO);
    }

    setTelefonoCliente(value);
  }

  async function registrarCorte() {
    setError("");
    setSuccess(false);

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

    if (bloqueado) return;

    setRegistrando(true);

    const { error: rpcError } = await supabase.rpc(
      "rpc_registrar_corte",
      {
        p_barbero_id: barberoId,
        p_tipo_corte_id: tipoCorteId,
        p_precio: Number(precio),
        p_nombre_cliente: nombreCliente,
        p_telefono_cliente: `+569${telefonoCliente}`,
      }
    );

    if (rpcError) {
      setError(rpcError.message);
      setRegistrando(false);
      return;
    }

    setBarberoId("");
    setTipoCorteId("");
    setPrecio("");
    setPrecioEditable(false);
    setNombreCliente("");
    setTelefonoCliente("");
    setEstadoBarbero(null);
    setRegistrando(false);

    setSuccess(true);

    if (onCorteRegistrado) onCorteRegistrado();

    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  }

  return (
    <div
      className="bg-white border border-black p-4 rounded
      transition-all duration-500 ease-out
      animate-[fadeIn_0.4s_ease-out]"
    >
      <h2 className="text-lg font-semibold mb-4 text-center">
        Registra un corte
      </h2>

      <select
        value={barberoId}
        onChange={(e) => {
          setBarberoId(e.target.value);
          verificarEstado(e.target.value);
        }}
        className="w-full border border-black p-2 rounded mb-2"
      >
        <option value="">Seleccionar barbero</option>
        {barberos.map((b) => (
          <option key={b.id} value={b.id}>
            {b.nombre}
          </option>
        ))}
      </select>

      {bloqueado && (
        <div className="mb-2 text-sm text-orange-600 border border-orange-500 p-2 rounded">
          ⚠ El barbero no está disponible.
          <button
            type="button"
            onClick={() => navigate("/app/estado-diario")}
            className="underline ml-1"
          >
            Ir a Estado diario
          </button>
        </div>
      )}

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

      <input
        type="text"
        value={precio}
        onChange={precioEditable ? manejarPrecio : undefined}
        disabled={!precioEditable}
        placeholder="Precio"
        className={`w-full border border-black p-2 rounded mb-2 ${
          precioEditable ? "" : "bg-gray-100"
        }`}
      />

      <input
        type="text"
        value={nombreCliente}
        onChange={manejarNombre}
        placeholder="Nombre cliente (IMPORTANTE)"
        className="w-full border border-black p-2 rounded mb-2"
      />

      {/* TELEFONO CON +569 FIJO */}
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
        <div className="text-red-600 text-sm mb-2">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-600 text-sm mb-3 animate-[fadeIn_0.5s_ease-out]">
          ✓ Corte registrado correctamente
        </div>
      )}

      <button
        type="button"
        onClick={registrarCorte}
        disabled={registrando || bloqueado}
        className={`w-full py-2 rounded text-white bg-black
        transition-all duration-200
        hover:scale-[1.03]
        hover:shadow-xl
        active:scale-[0.97]
        ${bloqueado ? "bg-gray-400" : ""}`}
      >
        Registrar corte
      </button>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
