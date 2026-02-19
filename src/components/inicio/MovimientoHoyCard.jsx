import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MovimientoHoyCard({ empresaId }) {
  const [ventasHoy, setVentasHoy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empresaId) return;

    const fetchVentas = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("work_view_ventas_hoy")
        .select("*")
        .eq("empresa_id", empresaId)
        .order("created_at", { ascending: false })
        .limit(5);

      setVentasHoy(data || []);
      setLoading(false);
    };

    fetchVentas();
  }, [empresaId]);

  const totalHoy =
    ventasHoy.reduce(
      (acc, v) => acc + Number(v.total_venta || 0),
      0
    ) || 0;

  return (
    <div className="relative rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

      {/* Glow lateral */}
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Ventas hoy
        </p>
      </div>

      {/* Total */}
      <div className="mb-6">
        <p className="text-sm text-zinc-500">Total acumulado</p>
        <h3 className="text-3xl font-black text-blue-400">
          ${totalHoy.toLocaleString("es-CL")}
        </h3>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-sm text-zinc-500">Cargando...</p>
      ) : ventasHoy.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No hay ventas registradas hoy.
        </p>
      ) : (
        <div className="space-y-4 max-h-72 overflow-y-auto pr-2">

          {ventasHoy.map((v) => (
            <div
              key={v.venta_id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <div>
                <p className="text-zinc-200 font-medium">
                  {v.producto}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date(v.created_at).toLocaleTimeString("es-CL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="text-right">
                <p className="text-blue-400 font-semibold">
                  ${Number(v.total_venta).toLocaleString("es-CL")}
                </p>
                <p className="text-xs text-zinc-500">
                  {v.metodo_pago}
                </p>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
