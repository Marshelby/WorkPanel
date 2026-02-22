import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function IngresarProductoBodega({
  crearProductoIngreso,
}) {
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState("");
  const [producto, setProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /* =========================
     CARGAR CATEGORÍAS
  ========================= */

  useEffect(() => {
    const fetchCategorias = async () => {
      const { data } = await supabase
        .from("work_categorias")
        .select("id, nombre")
        .order("nombre", { ascending: true });

      if (data) setCategorias(data);
    };

    fetchCategorias();
  }, []);

  /* =========================
     VALIDACIÓN
  ========================= */

  const validar = () => {
    if (
      !categoriaId ||
      !producto ||
      !descripcion ||
      !cantidad ||
      !precioCompra ||
      !precioVenta
    ) {
      return "Todos los campos son obligatorios.";
    }

    if (Number(precioVenta) < Number(precioCompra)) {
      return "El precio de venta no puede ser menor al de compra.";
    }

    return null;
  };

  const limpiarFormulario = () => {
    setCategoriaId("");
    setProducto("");
    setDescripcion("");
    setCantidad("");
    setPrecioCompra("");
    setPrecioVenta("");
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(false);

    const errorValidacion = validar();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setLoading(true);

    const { success } = await crearProductoIngreso({
      categoriaId,
      nombre: producto.trim(),
      descripcion: descripcion.trim(),
      cantidad: Number(cantidad),
      precioCompra: Number(precioCompra),
      precioVenta: Number(precioVenta),
    });

    if (success) {
      limpiarFormulario();
      setSuccess(true);
    } else {
      setError("Error registrando ingreso.");
    }

    setLoading(false);
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 
                    border border-blue-400/15 
                    bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 
                    backdrop-blur-xl
                    shadow-[0_0_60px_rgba(59,130,246,0.15)]
                    transition-all duration-300
                    hover:shadow-[0_0_80px_rgba(59,130,246,0.25)]">

      {/* Glow interno decorativo */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 blur-[140px] rounded-full pointer-events-none" />

      <h2 className="text-xl font-bold mb-8 tracking-tight
                     bg-gradient-to-r from-blue-300 to-cyan-400 
                     bg-clip-text text-transparent">
        ➕ Ingresar producto
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 relative">

        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="w-full bg-[#0f1f33] border border-blue-400/20 
                     rounded-xl px-4 py-3 text-sm text-zinc-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     transition-all duration-200"
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nombre del producto"
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          className="w-full bg-[#0f1f33] border border-blue-400/20 
                     rounded-xl px-4 py-3 text-sm text-zinc-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     transition-all duration-200"
        />

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full bg-[#0f1f33] border border-blue-400/20 
                     rounded-xl px-4 py-3 text-sm text-zinc-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     transition-all duration-200"
        />

        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="w-full bg-[#0f1f33] border border-blue-400/20 
                     rounded-xl px-4 py-3 text-sm text-zinc-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     transition-all duration-200"
        />

        <input
          type="number"
          placeholder="Precio compra"
          value={precioCompra}
          onChange={(e) => setPrecioCompra(e.target.value)}
          className="w-full bg-[#0f1f33] border border-blue-400/20 
                     rounded-xl px-4 py-3 text-sm text-zinc-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     transition-all duration-200"
        />

        <input
          type="number"
          placeholder="Precio venta"
          value={precioVenta}
          onChange={(e) => setPrecioVenta(e.target.value)}
          className="w-full bg-[#0f1f33] border border-blue-400/20 
                     rounded-xl px-4 py-3 text-sm text-zinc-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     transition-all duration-200"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 
                     text-white rounded-xl py-3 text-sm font-semibold
                     shadow-lg shadow-blue-500/30
                     hover:scale-[1.02] hover:shadow-blue-500/50
                     transition-all duration-200"
        >
          {loading ? "Registrando..." : "Registrar ingreso"}
        </button>

        {error && (
          <p className="text-sm text-red-400 text-center mt-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-emerald-400 text-center mt-2">
            Ingreso registrado correctamente.
          </p>
        )}
      </form>
    </div>
  );
}