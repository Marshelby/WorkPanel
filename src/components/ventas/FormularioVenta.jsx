import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useWork } from "../../context/WorkContext";

export default function FormularioVenta({ onRegistrarVenta, loading }) {
  const { empresa } = useWork();

  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");

  const productoSeleccionado = productos.find(
    (p) => p.producto_id === productoId
  );

  useEffect(() => {
    if (!empresa?.id) return;

    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("work_view_stock_actual")
        .select("*")
        .eq("empresa_id", empresa.id)
        .gt("stock_total", 0);

      if (!error) {
        setProductos(data || []);
      }
    };

    fetchProductos();
  }, [empresa?.id]);

  useEffect(() => {
    if (!productoSeleccionado) return;

    const fetchPrecio = async () => {
      const { data } = await supabase
        .from("work_productos")
        .select("precio_venta")
        .eq("id", productoSeleccionado.producto_id)
        .single();

      if (data) {
        setPrecioUnitario(Number(data.precio_venta || 0));
      }
    };

    fetchPrecio();
  }, [productoSeleccionado]);

  const total = cantidad * precioUnitario;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productoId || cantidad <= 0) return;

    if (productoSeleccionado.stock_total < cantidad) {
      alert(
        "No hay stock disponible en el sistema. Registra un ajuste positivo en Bodega antes de vender."
      );
      return;
    }

    const ok = await onRegistrarVenta({
      producto_id: productoId,
      cantidad,
      precio_venta_unitario: precioUnitario,
      metodo_pago: metodoPago,
    });

    if (ok) {
      setProductoId("");
      setCantidad(1);
      setPrecioUnitario(0);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 border border-blue-500/20 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-[0_0_60px_rgba(59,130,246,0.15)] backdrop-blur-xl space-y-8">

      {/* Glow layer */}
      <div className="absolute inset-0 rounded-3xl bg-blue-500/5 opacity-30 pointer-events-none" />

      <h3 className="text-xl font-semibold tracking-tight text-white">
        Registrar venta
      </h3>

      <form onSubmit={handleSubmit} className="space-y-7">

        {/* PRODUCTO */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Producto
          </label>
          <select
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            className="w-full bg-zinc-800/70 border border-zinc-700 rounded-2xl px-4 py-3 text-sm text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50
                       transition-all duration-300 hover:border-blue-500/40"
          >
            <option value="">Seleccionar producto</option>
            {productos.map((p) => (
              <option key={p.producto_id} value={p.producto_id}>
                {p.producto} (Stock: {p.stock_total})
              </option>
            ))}
          </select>
        </div>

        {/* CANTIDAD */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Cantidad
          </label>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-full bg-zinc-800/70 border border-zinc-700 rounded-2xl px-4 py-3 text-sm text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50
                       transition-all duration-300 hover:border-blue-500/40"
          />
        </div>

        {/* PRECIO */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Precio unitario
          </label>
          <input
            type="number"
            value={precioUnitario}
            onChange={(e) => setPrecioUnitario(Number(e.target.value))}
            className="w-full bg-zinc-800/70 border border-zinc-700 rounded-2xl px-4 py-3 text-sm text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50
                       transition-all duration-300 hover:border-blue-500/40"
          />
        </div>

        {/* MÉTODO PAGO */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Método de pago
          </label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full bg-zinc-800/70 border border-zinc-700 rounded-2xl px-4 py-3 text-sm text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50
                       transition-all duration-300 hover:border-blue-500/40"
          >
            <option value="EFECTIVO">Efectivo</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="DEBITO">Débito</option>
            <option value="CREDITO">Crédito</option>
          </select>
        </div>

        {/* TOTAL CARD */}
        <div className="rounded-3xl p-6 border border-emerald-500/30 
                        bg-gradient-to-br from-emerald-500/10 to-emerald-500/5
                        shadow-[0_0_50px_rgba(16,185,129,0.25)]
                        transition-all duration-300">

          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Total calculado
          </p>

          <p className="text-3xl font-bold text-emerald-400 mt-3">
            ${total.toLocaleString("es-CL")}
          </p>
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl py-3 text-sm font-semibold tracking-wide
                     bg-gradient-to-r from-emerald-500 via-blue-500 to-blue-600
                     hover:scale-[1.02] transition-all duration-300
                     shadow-[0_0_40px_rgba(59,130,246,0.4)]
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Registrando..." : "Registrar venta"}
        </button>

      </form>
    </div>
  );
}