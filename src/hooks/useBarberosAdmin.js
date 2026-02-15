import { useState } from "react";
import { supabase } from "../lib/supabase";

export function useBarberosAdmin(barberiaId) {
  const [accionActiva, setAccionActiva] = useState(null);

  // 🔥 Se mantienen por compatibilidad, pero ya no se usan para agregar
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [nuevoPorcentaje, setNuevoPorcentaje] = useState("");

  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const reset = () => {
    setAccionActiva(null);
    setNuevoNombre("");
    setNuevoTelefono("");
    setNuevoPorcentaje("");
    setPin("");
    setError("");
    setLoadingId(null);
  };

  const validarPin = () => {
    if (!pin.trim()) {
      setError("Debes ingresar el PIN administrador.");
      return false;
    }
    return true;
  };

  const validarPorcentaje = (valor) => {
    const num = Number(valor);
    if (!valor) {
      setError("Debes ingresar un porcentaje.");
      return false;
    }
    if (num < 1 || num > 100) {
      setError("El porcentaje debe estar entre 1 y 100.");
      return false;
    }
    return true;
  };

  const ejecutarRpc = async (rpcName, params, loadingKey) => {
    setError("");
    setLoadingId(loadingKey);

    const { error } = await supabase.rpc(rpcName, params);

    setLoadingId(null);

    if (error) {
      setError(error.message);
      return false;
    }

    reset();
    return true;
  };

  /* =========================
     ACCIONES EXISTENTES
  ========================= */

  const desactivarBarbero = async (id) => {
    if (!validarPin()) return false;

    return ejecutarRpc(
      "rpc_desactivar_barbero",
      {
        p_barbero_id: id,
        p_barberia_id: barberiaId,
        p_pin: pin,
      },
      id
    );
  };

  const cambiarPorcentaje = async (id, porcentaje) => {
    if (!validarPorcentaje(porcentaje)) return false;
    if (!validarPin()) return false;

    return ejecutarRpc(
      "rpc_cambiar_porcentaje_barbero",
      {
        p_barbero_id: id,
        p_barberia_id: barberiaId,
        p_nuevo_porcentaje: Number(porcentaje),
        p_pin: pin,
      },
      id
    );
  };

  /* =========================
     🔥 AGREGAR BARBERO CORREGIDO
     Ahora recibe datos como parámetro
  ========================= */

  const agregarBarbero = async ({ nombre, telefono, porcentaje }) => {
    if (!validarPin()) return false;

    const telefonoFinal = `+569${telefono}`;

    return ejecutarRpc(
      "rpc_insertar_barbero",
      {
        p_barberia_id: barberiaId,
        p_nombre: nombre.trim(),
        p_telefono: telefonoFinal,
        p_porcentaje: Number(porcentaje),
        p_pin: pin,
      },
      "agregar"
    );
  };

  /* =========================
     NUEVAS ACCIONES
  ========================= */

  const activarBarbero = async (id) => {
    if (!validarPin()) return false;

    return ejecutarRpc(
      "rpc_reactivar_barbero",
      {
        p_barbero_id: id,
        p_barberia_id: barberiaId,
        p_pin: pin,
      },
      id
    );
  };

  const eliminarBarberoDefinitivo = async (id) => {
    if (!validarPin()) return false;

    return ejecutarRpc(
      "rpc_eliminar_barbero_definitivo",
      {
        p_barbero_id: id,
        p_barberia_id: barberiaId,
        p_pin: pin,
      },
      id
    );
  };

  return {
    accionActiva,
    setAccionActiva,

    // 🔥 Se mantienen para no romper nada externo
    nuevoNombre,
    setNuevoNombre,
    nuevoTelefono,
    setNuevoTelefono,
    nuevoPorcentaje,
    setNuevoPorcentaje,

    pin,
    setPin,
    error,
    loadingId,

    desactivarBarbero,
    cambiarPorcentaje,
    agregarBarbero,
    activarBarbero,
    eliminarBarberoDefinitivo,
    reset,
  };
}
