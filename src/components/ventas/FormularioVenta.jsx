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

  // 🔹 Cargar productos con stock
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

  // 🔹 Auto cargar precio venta desde producto real
  useEffect(() => {
    if (!productoSeleccionado) return;

    // Como la view no trae precio_venta,
    // lo buscamos desde work_productos
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
        "No hay stock disponible en el sistema. Si cuentas con stock físico, debes registrar un ajuste positivo en Bodega antes de registrar la venta."
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-zinc-900">
        Registrar venta
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* PRODUCTO */}
        <div>
          <label className="text-sm text-zinc-600">Producto</label>
          <select
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            className="w-full mt-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
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
          <label className="text-sm text-zinc-600">Cantidad</label>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-full mt-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* PRECIO */}
        <div>
          <label className="text-sm text-zinc-600">Precio unitario</label>
          <input
            type="number"
            value={precioUnitario}
            onChange={(e) => setPrecioUnitario(Number(e.target.value))}
            className="w-full mt-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* MÉTODO PAGO */}
        <div>
          <label className="text-sm text-zinc-600">Método de pago</label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full mt-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="EFECTIVO">Efectivo</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="DEBITO">Débito</option>
            <option value="CREDITO">Crédito</option>
          </select>
        </div>

        {/* TOTAL */}
        <div className="bg-zinc-100 rounded-lg p-3 text-sm">
          <p className="text-zinc-500">Total</p>
          <p className="text-lg font-bold text-zinc-900">
            ${total.toLocaleString("es-CL")}
          </p>
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded-xl py-2 text-sm font-medium hover:bg-zinc-800 transition"
        >
          {loading ? "Registrando..." : "Registrar venta"}
        </button>

      </form>
    </div>
  );
}
