import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useBodega(empresaId) {
  const [productos, setProductos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStock = useCallback(async () => {
    if (!empresaId) return;

    const { data, error } = await supabase
      .from("work_view_stock_actual")
      .select("*")
      .eq("empresa_id", empresaId)
      .order("categoria_nombre", { ascending: true });

    if (error) {
      console.error("Error cargando stock:", error);
      throw error;
    }

    setProductos(data || []);
  }, [empresaId]);

  const fetchHistorial = useCallback(async () => {
    if (!empresaId) return;

    const { data, error } = await supabase
      .from("work_view_historial_movimientos")
      .select("*")
      .eq("empresa_id", empresaId)
      .order("fecha_movimiento", { ascending: false }); // 🔥 FIX

    if (error) {
      console.error("Error cargando historial:", error);
      throw error;
    }

    setHistorial(data || []);
  }, [empresaId]);

  const fetchAll = useCallback(async () => {
    if (!empresaId) return;

    setLoading(true);
    setError(null);

    try {
      await Promise.all([fetchStock(), fetchHistorial()]);
    } catch (e) {
      setProductos([]);
      setHistorial([]);
      setError("Error cargando inventario.");
    } finally {
      setLoading(false);
    }
  }, [empresaId, fetchStock, fetchHistorial]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const crearProductoIngreso = async ({
    categoriaId,
    nombre,
    descripcion,
    cantidad,
    precioCompra,
    precioVenta,
  }) => {
    setError(null);

    const { error } = await supabase.rpc("rpc_crear_producto_ingreso", {
      p_empresa_id: empresaId,
      p_categoria_id: categoriaId,
      p_nombre: (nombre || "").trim(),
      p_descripcion: (descripcion || "").trim(),
      p_cantidad: Number(cantidad),
      p_precio_compra: Number(precioCompra),
      p_precio_venta: Number(precioVenta),
    });

    if (error) {
      console.error("Error rpc_crear_producto_ingreso:", error);
      setError("Error registrando ingreso.");
      return { success: false };
    }

    await fetchAll();
    return { success: true };
  };

  const ajustarStock = async ({ productoId, cantidadAjuste }) => {
    setError(null);

    const { error } = await supabase.rpc("rpc_ajustar_stock_producto", {
      p_empresa_id: empresaId,
      p_producto_id: productoId,
      p_cantidad_ajuste: Number(cantidadAjuste),
    });

    if (error) {
      console.error("Error rpc_ajustar_stock_producto:", error);
      setError("Error ajustando stock.");
      return { success: false };
    }

    await fetchAll();
    return { success: true };
  };

  return {
    productos,
    historial,
    loading,
    error,
    fetchAll,
    crearProductoIngreso,
    ajustarStock,
  };
}
