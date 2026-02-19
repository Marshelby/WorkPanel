import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AjusteStockModal({
  producto,
  onClose,
  onSuccess,
}) {
  const [tipo, setTipo] = useState("añadir"); // añadir | quitar
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stockActual = Number(producto?.stock_total || 0);
  const cantidadNumero = Number(cantidad || 0);

  const nuevoStock =
    cantidad !== ""
      ? tipo === "quitar"
        ? stockActual - cantidadNumero
        : stockActual + cantidadNumero
      : stockActual;

  /* =========================
     VALIDACIÓN
  ========================= */

  const validar = () => {
    if (!cantidad) return "Debes ingresar una cantidad.";

    if (!/^\d+$/.test(cantidad))
      return "Cantidad inválida.";

    if (cantidad.length > 7)
      return "Máximo 7 dígitos permitidos.";

    if (cantidadNumero <= 0)
      return "La cantidad debe ser mayor a 0.";

    if (tipo === "quitar" && cantidadNumero > stockActual)
      return "No puedes quitar más que el stock actual.";

    if (nuevoStock < 0)
      return "El ajuste dejaría el stock en negativo.";

    if (!motivo.trim())
      return "Debes ingresar un motivo.";

    if (motivo.trim().length < 5)
      return "El motivo debe tener al menos 5 caracteres.";

    if (motivo.trim().length > 30)
      return "Máximo 30 caracteres en el motivo.";

    return null;
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errorValidacion = validar();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setLoading(true);

    const { error } = await supabase.rpc(
      "rpc_ajustar_stock_producto",
      {
        p_empresa_id: producto.empresa_id,
        p_producto_id: producto.producto_id,
        p_tipo:
          tipo === "añadir"
            ? "AJUSTE_POS"
            : "AJUSTE_NEG",
        p_cantidad: cantidadNumero,
        p_motivo: motivo.trim(),
      }
    );

    if (error) {
      setError(error.message || "Error al ajustar stock.");
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="relative w-full max-w-md rounded-3xl p-6 border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-2xl">

        <h2 className="text-xl font-bold text-white mb-4">
          Ajustar stock
        </h2>

        <div className="text-sm text-zinc-400 space-y-1 mb-4">
          <p>
            Producto:
            <span className="text-white font-semibold ml-1">
              {producto.producto}
            </span>
          </p>
          <p>
            Stock actual:
            <span className="text-emerald-400 font-semibold ml-1">
              {stockActual}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* SELECTOR */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setTipo("añadir")}
              className={`flex-1 py-2 rounded-xl border text-sm font-medium transition ${
                tipo === "añadir"
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400"
              }`}
            >
              Añadir stock
            </button>

            <button
              type="button"
              onClick={() => setTipo("quitar")}
              className={`flex-1 py-2 rounded-xl border text-sm font-medium transition ${
                tipo === "quitar"
                  ? "bg-red-500/20 border-red-500/40 text-red-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400"
              }`}
            >
              Quitar stock
            </button>
          </div>

          {/* CANTIDAD */}
          <input
            type="text"
            placeholder="Cantidad (máx 7 dígitos)"
            value={cantidad}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value) && e.target.value.length <= 7) {
                setCantidad(e.target.value);
              }
            }}
            className="w-full px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
          />

          {/* PREVIEW */}
          {cantidad !== "" && (
            <div className="rounded-xl bg-zinc-800/60 border border-zinc-700 p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Nuevo stock</span>
                <span className={`font-semibold ${
                  nuevoStock < 0 ? "text-red-400" : "text-white"
                }`}>
                  {nuevoStock}
                </span>
              </div>
            </div>
          )}

          {/* MOTIVO */}
          <textarea
            placeholder="Motivo del ajuste (máx 30 caracteres)"
            value={motivo}
            onChange={(e) => {
              if (e.target.value.length <= 30) {
                setMotivo(e.target.value);
              }
            }}
            rows={3}
            className="w-full px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white resize-none"
          />

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-zinc-700 text-zinc-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30"
            >
              {loading ? "Ajustando..." : "Confirmar ajuste"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
