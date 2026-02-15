import { useState } from "react";
import { supabase } from "../../lib/supabase";

const MAX_DIGITOS_PRECIO = 5;
const MAX_NOMBRE = 20;
const DIGITOS_TELEFONO = 8;

export default function RegistroCorte({ barberos, tiposCorte, onCorteRegistrado }) {
  const [barberoId, setBarberoId] = useState("");
  const [tipoCorteId, setTipoCorteId] = useState("");
  const [precio, setPrecio] = useState("");
  const [precioEditable, setPrecioEditable] = useState(false);

  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");

  const [registrando, setRegistrando] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");

  function manejarPrecio(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > MAX_DIGITOS_PRECIO) value = value.slice(0, MAX_DIGITOS_PRECIO);
    setPrecio(value);
  }

  function manejarNombre(e) {
    setNombreCliente(e.target.value.slice(0, MAX_NOMBRE));
  }

  function manejarTelefono(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > DIGITOS_TELEFONO) value = value.slice(0, DIGITOS_TELEFONO);
    setTelefonoCliente(value);
  }

  function mensajePorEstado(estado) {
    switch (estado) {
      case "AUSENTE":
        return "Este barbero figura AUSENTE. ¿Seguro quieres registrar el corte a su nombre?";
      case "EN_COLACION":
        return "Este barbero está en COLACIÓN. ¿Seguro quieres registrar el corte igual?";
      case "FUERA_DE_HORARIO":
        return "Estás fuera de horario o el local está cerrado. ¿Seguro quieres registrar el corte igual?";
      default:
        return "El barbero no está disponible. ¿Seguro quieres registrar el corte igual?";
    }
  }

  async function validarEstadoActual() {
    const now = new Date();
    const hora = now.toTimeString().slice(0, 5); // HH:MM

    const { data } = await supabase
      .from("v_barbero_bloques_efectivos")
      .select("estado_bloque")
      .eq("barbero_id", barberoId)
      .eq("fecha", now.toISOString().slice(0, 10))
      .eq("hora", hora + ":00")
      .maybeSingle();

    if (!data) return "FUERA_DE_HORARIO";
    if (data.estado_bloque !== "DISPONIBLE") return data.estado_bloque;

    return null;
  }

  async function ejecutarInsert() {
    return await supabase.rpc("rpc_registrar_corte", {
      p_barbero_id: barberoId,
      p_tipo_corte_id: tipoCorteId,
      p_precio: Number(precio),
      p_nombre_cliente: nombreCliente,
      p_telefono_cliente: `+569${telefonoCliente}`,
    });
  }

  async function registrarCorte() {
    setError("");
    setSuccess(false);

    if (!barberoId) return setError("Debe seleccionar un barbero.");
    if (!tipoCorteId) return setError("Debe seleccionar un tipo de corte.");
    if (!precio || Number(precio) <= 0) return setError("El precio es obligatorio.");
    if (telefonoCliente.length !== DIGITOS_TELEFONO) return setError("Número incompleto");

    setRegistrando(true);

    const estado = await validarEstadoActual();

    if (estado) {
      setConfirmMsg(mensajePorEstado(estado));
      setConfirmOpen(true);
      setRegistrando(false);
      return;
    }

    const { error: rpcError } = await ejecutarInsert();

    if (rpcError) {
      setError("No se pudo registrar el corte.");
      setRegistrando(false);
      return;
    }

    limpiarYExito();
  }

  async function confirmarRegistro() {
    setConfirmOpen(false);
    setRegistrando(true);

    const { error: rpcError } = await ejecutarInsert();

    if (rpcError) {
      setError("No se pudo registrar el corte.");
      setRegistrando(false);
      return;
    }

    limpiarYExito();
  }

  function limpiarYExito() {
    setBarberoId("");
    setTipoCorteId("");
    setPrecio("");
    setPrecioEditable(false);
    setNombreCliente("");
    setTelefonoCliente("");
    setRegistrando(false);

    setSuccess(true);
    if (onCorteRegistrado) onCorteRegistrado();

    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <div className="bg-white border border-black p-4 rounded">
      <h2 className="text-lg font-semibold mb-4 text-center">Registra un corte</h2>

      <select
        value={barberoId}
        onChange={(e) => setBarberoId(e.target.value)}
        className="w-full border border-black p-2 rounded mb-2"
      >
        <option value="">Seleccionar barbero</option>
        {barberos.map((b) => (
          <option key={b.id} value={b.id}>{b.nombre}</option>
        ))}
      </select>

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
            {t.nombre}{t.precio !== null && ` ($${t.precio})`}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={precio}
        onChange={precioEditable ? manejarPrecio : undefined}
        disabled={!precioEditable}
        placeholder="Precio"
        className={`w-full border border-black p-2 rounded mb-2 ${precioEditable ? "" : "bg-gray-100"}`}
      />

      <input
        type="text"
        value={nombreCliente}
        onChange={manejarNombre}
        placeholder="Nombre cliente (IMPORTANTE)"
        className="w-full border border-black p-2 rounded mb-2"
      />

      <div className="flex mb-3">
        <div className="px-3 py-2 border border-black border-r-0 bg-gray-100 rounded-l">+569</div>
        <input
          type="text"
          value={telefonoCliente}
          onChange={manejarTelefono}
          placeholder="12345678"
          className="w-full border border-black p-2 rounded-r"
        />
      </div>

      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-3">✓ Corte registrado correctamente</div>}

      <button
        type="button"
        onClick={registrarCorte}
        disabled={registrando}
        className="w-full py-2 rounded text-white bg-black"
      >
        Registrar corte
      </button>

      {confirmOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="w-full max-w-md rounded-2xl bg-white border-2 border-red-500 shadow-2xl p-6 animate-[fadeIn_0.25s_ease-out]">

      <div className="flex items-center gap-2 mb-3">
        <div className="text-red-600 text-2xl">⚠️</div>
        <h3 className="text-lg font-bold text-red-700">
          Registro fuera de horario
        </h3>
      </div>

      <p className="text-sm text-zinc-700 mb-5 leading-relaxed">
        {confirmMsg}
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => setConfirmOpen(false)}
          className="flex-1 border border-zinc-400 rounded-lg py-2 text-sm hover:bg-zinc-100 transition"
        >
          Cancelar
        </button>

        <button
          onClick={confirmarRegistro}
          className="flex-1 rounded-lg py-2 text-sm text-white bg-red-600 hover:bg-red-700 transition shadow-md"
        >
          Registrar de todos modos
        </button>
      </div>

      <div className="mt-3 text-[11px] text-zinc-400">
        Esta acción quedará registrada en el sistema.
      </div>
    </div>
  </div>


      )}
    </div>
  );
}
