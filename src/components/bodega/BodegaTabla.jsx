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

  const categorias = useMemo(() => {
    const unicas = [...new Set(productos.map((p) => p.categoria_nombre))];
    return ["todas", ...unicas];
  }, [productos]);

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

  return (
    <>
      <div
        className="relative overflow-hidden rounded-3xl p-8
                   border border-blue-400/15
                   bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80
                   backdrop-blur-xl
                   shadow-[0_0_60px_rgba(59,130,246,0.15)]
                   space-y-8"
      >
        {/* Glow decorativo */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 blur-[140px] rounded-full pointer-events-none" />

        {/* HEADER */}
        <h2
          className="text-xl font-bold tracking-tight
                     bg-gradient-to-r from-blue-300 to-cyan-400
                     bg-clip-text text-transparent"
        >
          📦 Stock actual
        </h2>

        {/* FILTROS */}
        <div className="flex flex-wrap items-center gap-6 justify-between">

          <div className="flex flex-wrap items-center gap-4">

            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="px-4 py-2 rounded-xl 
                         bg-[#0f1f33] border border-blue-400/20 
                         text-zinc-200
                         focus:ring-2 focus:ring-blue-500/50 
                         outline-none transition"
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
              className="px-4 py-2 rounded-xl 
                         bg-[#0f1f33] border border-blue-400/20 
                         text-zinc-200 placeholder-zinc-500
                         focus:ring-2 focus:ring-blue-500/50 
                         outline-none transition w-64"
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
        <div className="overflow-x-auto rounded-2xl border border-white/5">
          {loading ? (
            <p className="text-sm text-zinc-400 p-4">
              Cargando productos...
            </p>
          ) : productosFiltrados.length === 0 ? (
            <p className="text-sm text-zinc-400 p-4">
              No se encontraron productos.
            </p>
          ) : (
            <table className="w-full text-sm">

              <thead className="bg-white/5 backdrop-blur sticky top-0 z-10">
                <tr className="text-zinc-400 uppercase text-xs tracking-[0.15em] border-b border-white/5">
                  <th className="py-4 px-4 text-left">Producto</th>
                  <th className="px-4 text-left">Categoría</th>
                  <th className="px-4 text-left">Stock</th>
                  <th className="px-4 text-left">Compra</th>
                  <th className="px-4 text-left">Venta</th>
                  <th className="px-4 text-left">Utilidad</th>
                  <th className="px-4 text-right">Acción</th>
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
                      className="border-b border-white/5
                                 hover:bg-white/5
                                 transition-all duration-200"
                    >
                      <td className="py-4 px-4 font-semibold text-zinc-100">
                        {p.producto}
                      </td>

                      <td className="px-4 text-zinc-400">
                        {p.categoria_nombre}
                      </td>

                      <td className={`px-4 font-semibold ${stockColor}`}>
                        {stock}
                      </td>

                      <td className="px-4 text-zinc-300">
                        {formatCLP(p.valor_total_compra)}
                      </td>

                      <td className="px-4 text-zinc-300">
                        {formatCLP(p.valor_total_venta)}
                      </td>

                      <td className="px-4 font-bold text-emerald-400">
                        {formatCLP(p.utilidad_proyectada)}
                      </td>

                      <td className="px-4 text-right">
                        <button
                          onClick={() => setProductoSeleccionado(p)}
                          className="px-4 py-1.5 text-xs rounded-full
                                     bg-blue-500/20 text-blue-400
                                     border border-blue-500/30
                                     hover:bg-blue-500/30
                                     hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]
                                     transition-all duration-200"
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