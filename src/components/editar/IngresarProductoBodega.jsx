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
    <div className="relative overflow-hidden rounded-3xl p-6 border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-xl">

      <h2 className="text-lg font-semibold mb-6 text-white">
        ➕ Ingresar producto
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white"
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
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white"
        />

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white"
        />

        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white"
        />

        <input
          type="number"
          placeholder="Precio compra"
          value={precioCompra}
          onChange={(e) => setPrecioCompra(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white"
        />

        <input
          type="number"
          placeholder="Precio venta"
          value={precioVenta}
          onChange={(e) => setPrecioVenta(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white rounded-lg p-2 text-sm font-semibold hover:bg-blue-600 transition"
        >
          {loading ? "Registrando..." : "Registrar ingreso"}
        </button>

        {error && (
          <p className="text-sm text-red-400 text-center">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-emerald-400 text-center">
            Ingreso registrado correctamente.
          </p>
        )}
      </form>
    </div>
  );
}
