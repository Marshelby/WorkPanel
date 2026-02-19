import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";

export default function useContabilidad(
  empresaId,
  { fechaInicio = null, fechaFin = null, categoria = null } = {}
) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!empresaId) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("work_view_contabilidad")
          .select("*")
          .eq("empresa_id", empresaId)
          .order("created_at", { ascending: false });

        if (fechaInicio) {
          query = query.gte("created_at", fechaInicio);
        }

        if (fechaFin) {
          query = query.lte("created_at", fechaFin);
        }

        if (categoria && categoria !== "todas") {
          query = query.eq("categoria", categoria);
        }

        const { data, error } = await query;

        if (!isMounted) return;

        if (error) {
          setError(error.message);
          setMovimientos([]);
        } else {
          setMovimientos(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError("Error inesperado al cargar contabilidad");
          setMovimientos([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [empresaId, fechaInicio, fechaFin, categoria]);

  /* =========================
     TOTALES CENTRALIZADOS
  ========================= */

  const totales = useMemo(() => {
    let totalVentas = 0;
    let totalCompras = 0;
    let utilidadNeta = 0;

    for (const m of movimientos) {
      totalVentas += Number(m.total_venta ?? 0);
      totalCompras += Number(m.total_compra ?? 0);
      utilidadNeta += Number(m.utilidad ?? 0);
    }

    return {
      totalVentas,
      totalCompras,
      utilidadNeta,
    };
  }, [movimientos]);

  return {
    movimientos,
    totales,
    loading,
    error,
  };
}
