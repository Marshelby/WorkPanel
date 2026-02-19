import { useMemo, useState } from "react";
import AjusteStockModal from "./AjusteStockModal";

export default function BodegaTabla({
  productos = [],
  loading,
  onAjusteRealizado,
}) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [soloStockBajo, setSoloStockBajo] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  /* =========================
     CATEGORÍAS
  ========================= */

  const categorias = useMemo(() => {
    const unicas = [...new Set(productos.map((p) => p.categoria_nombre))];
    return ["todas", ...unicas];
  }, [productos]);

  /* =========================
     FILTROS
  ========================= */

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const matchCategoria =
        categoriaSeleccionada === "todas" ||
        p.categoria_nombre === categoriaSeleccionada;

      const matchBusqueda = p.producto
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const matchStock =
        !soloStockBajo || Number(p.stock_total) <= 5;

      return matchCategoria && matchBusqueda && matchStock;
    });
  }, [productos, categoriaSeleccionada, busqueda, soloStockBajo]);

  const formatCLP = (num) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(num || 0);

  /* =========================
     UI
  ========================= */

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl p-6 border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-xl space-y-6">

        {/* HEADER */}
        <h2 className="text-lg font-semibold text-white">
          📦 Stock actual
        </h2>

        {/* FILTROS */}
        <div className="flex flex-wrap items-center gap-4 justify-between">

          <div className="flex flex-wrap items-center gap-4">

            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {categorias.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat === "todas" ? "Todos los productos" : cat}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />

            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={soloStockBajo}
                onChange={() => setSoloStockBajo(!soloStockBajo)}
                className="accent-blue-500"
              />
              Stock bajo
            </label>

          </div>

          <div className="text-sm text-zinc-400">
            {productosFiltrados.length} resultados
          </div>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-sm text-zinc-400">
              Cargando productos...
            </p>
          ) : productosFiltrados.length === 0 ? (
            <p className="text-sm text-zinc-400">
              No se encontraron productos.
            </p>
          ) : (
            <table className="w-full text-sm text-left">

              <thead>
                <tr className="border-b border-zinc-700 text-zinc-400 uppercase text-xs tracking-wider">
                  <th className="py-3">Producto</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Compra</th>
                  <th>Venta</th>
                  <th>Utilidad</th>
                  <th className="text-right">Acción</th>
                </tr>
              </thead>

              <tbody>
                {productosFiltrados.map((p, index) => {
                  const stock = Number(p.stock_total);

                  const stockColor =
                    stock === 0
                      ? "text-red-400"
                      : stock <= 5
                      ? "text-yellow-400"
                      : "text-emerald-400";

                  return (
                    <tr
                      key={index}
                      className="border-b border-zinc-800 hover:bg-white/5 transition"
                    >
                      <td className="py-3 font-semibold text-white">
                        {p.producto}
                      </td>

                      <td className="text-zinc-400">
                        {p.categoria_nombre}
                      </td>

                      <td className={`font-semibold ${stockColor}`}>
                        {stock}
                      </td>

                      <td className="text-zinc-300">
                        {formatCLP(p.valor_total_compra)}
                      </td>

                      <td className="text-zinc-300">
                        {formatCLP(p.valor_total_venta)}
                      </td>

                      <td className="font-bold text-emerald-400">
                        {formatCLP(p.utilidad_proyectada)}
                      </td>

                      <td className="text-right">
                        <button
                          onClick={() => setProductoSeleccionado(p)}
                          className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition"
                        >
                          Ajustar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          )}
        </div>
      </div>

      {/* MODAL */}
      {productoSeleccionado && (
        <AjusteStockModal
          producto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
          onSuccess={() => {
            setProductoSeleccionado(null);
            if (onAjusteRealizado) onAjusteRealizado();
          }}
        />
      )}
    </>
  );
}
