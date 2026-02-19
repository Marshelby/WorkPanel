import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useWork } from "../context/WorkContext";

export default function useVentas() {
  const { empresa } = useWork();

  const [historial, setHistorial] = useState([]);
  const [resumen, setResumen] = useState({
    totalDia: 0,
    totalMes: 0,
    ventasDia: 0,
    ventasMes: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Obtener historial
  const obtenerHistorial = useCallback(async () => {
    if (!empresa?.id) return;

    const { data, error } = await supabase
      .from("work_view_ventas")
      .select("*")
      .eq("empresa_id", empresa.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      setError(error.message);
      return;
    }

    setHistorial(data || []);
  }, [empresa]);

  // 🔹 Obtener resumen
  const obtenerResumen = useCallback(async () => {
    if (!empresa?.id) return;

    const { data, error } = await supabase
      .from("work_view_ventas")
      .select("total_venta, created_at")
      .eq("empresa_id", empresa.id);

    if (error) {
      setError(error.message);
      return;
    }

    const hoy = new Date().toISOString().split("T")[0];
    const inicioMes = new Date();
    inicioMes.setDate(1);
    const inicioMesISO = inicioMes.toISOString().split("T")[0];

    let totalDia = 0;
    let totalMes = 0;
    let ventasDia = 0;
    let ventasMes = 0;

    data.forEach((v) => {
      const fecha = v.created_at.split("T")[0];

      if (fecha === hoy) {
        totalDia += Number(v.total_venta);
        ventasDia += 1;
      }

      if (fecha >= inicioMesISO) {
        totalMes += Number(v.total_venta);
        ventasMes += 1;
      }
    });

    setResumen({
      totalDia,
      totalMes,
      ventasDia,
      ventasMes,
    });
  }, [empresa]);

  // 🔹 Registrar venta
  const registrarVenta = async ({
    producto_id,
    cantidad,
    precio_venta_unitario,
    metodo_pago,
    telefono_cliente = null,
    vendedor = null,
  }) => {
    if (!empresa?.id) return false;

    setLoading(true);
    setError(null);

    const { error } = await supabase.rpc("rpc_work_registrar_venta", {
      p_empresa_id: empresa.id,
      p_producto_id: producto_id,
      p_cantidad: cantidad,
      p_precio_venta_unitario: precio_venta_unitario,
      p_metodo_pago: metodo_pago,
      p_telefono_cliente: telefono_cliente,
      p_vendedor: vendedor,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return false;
    }

    await obtenerHistorial();
    await obtenerResumen();

    return true;
  };

  // 🔹 Anular venta
  const anularVenta = async (venta_id) => {
    if (!empresa?.id) return false;

    const confirmar = window.confirm(
      "¿Seguro que deseas anular esta venta?"
    );

    if (!confirmar) return false;

    setLoading(true);
    setError(null);

    const { error } = await supabase.rpc("rpc_work_anular_venta", {
      p_empresa_id: empresa.id,
      p_venta_id: venta_id,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return false;
    }

    await obtenerHistorial();
    await obtenerResumen();

    return true;
  };

  // 🔹 Inicializar
  useEffect(() => {
    if (!empresa?.id) return;

    obtenerHistorial();
    obtenerResumen();
  }, [empresa, obtenerHistorial, obtenerResumen]);

  return {
    historial,
    resumen,
    loading,
    error,
    registrarVenta,
    anularVenta,
    refresh: () => {
      obtenerHistorial();
      obtenerResumen();
    },
  };
}
