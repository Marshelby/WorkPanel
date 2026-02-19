import { useState } from "react";
import { supabase } from "../lib/supabase";

export function useBodegaIngreso() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const registrarIngreso = async ({
    empresaId,
    categoriaId,
    nombre,
    descripcion,
    cantidad,
    precioCompra,
    precioVenta,
  }) => {

    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error: rpcError } = await supabase.rpc(
      "rpc_crear_producto_ingreso",
      {
        p_empresa_id: empresaId,
        p_categoria_id: categoriaId,
        p_nombre: nombre,
        p_descripcion: descripcion,
        p_cantidad: cantidad,
        p_precio_compra: precioCompra,
        p_precio_venta: precioVenta,
      }
    );

    if (rpcError) {
      console.error("Error RPC ingreso:", rpcError);
      setError("Error al registrar ingreso.");
      setLoading(false);
      return false;
    }

    setSuccess(true);

    // 🔥 Disparador global
    setRefreshKey(prev => prev + 1);

    setLoading(false);
    return true;
  };

  return {
    registrarIngreso,
    loading,
    error,
    success,
    setError,
    setSuccess,
    refreshKey
  };
}
