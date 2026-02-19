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
    <div className="space-y-8">

      <h3 className="text-xl font-semibold tracking-tight text-zinc-100">
        Registrar venta
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* PRODUCTO */}
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500">
            Producto
          </label>
          <select
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
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
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500">
            Cantidad
          </label>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        {/* PRECIO */}
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500">
            Precio unitario
          </label>
          <input
            type="number"
            value={precioUnitario}
            onChange={(e) => setPrecioUnitario(Number(e.target.value))}
            className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        {/* MÉTODO PAGO */}
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500">
            Método de pago
          </label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <option value="EFECTIVO">Efectivo</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="DEBITO">Débito</option>
            <option value="CREDITO">Crédito</option>
          </select>
        </div>

        {/* TOTAL */}
        <div className="rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur">
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Total calculado
          </p>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            ${total.toLocaleString("es-CL")}
          </p>
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-3 text-sm font-semibold tracking-wide 
                     bg-gradient-to-r from-emerald-500 to-blue-500 
                     hover:opacity-90 transition-all duration-200 
                     shadow-lg shadow-emerald-500/20"
        >
          {loading ? "Registrando..." : "Registrar venta"}
        </button>

      </form>
    </div>
  );
}
