import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function AjusteStockModal({
  producto,
  onClose,
  onSuccess,
}) {
  const [tipo, setTipo] = useState("añadir");
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
     ESC PARA CERRAR
  ========================= */

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* =========================
     VALIDACIÓN (SIN CAMBIOS)
  ========================= */

  const validar = () => {
    if (!cantidad) return "Debes ingresar una cantidad.";
    if (!/^\d+$/.test(cantidad)) return "Cantidad inválida.";
    if (cantidad.length > 7) return "Máximo 7 dígitos permitidos.";
    if (cantidadNumero <= 0) return "La cantidad debe ser mayor a 0.";
    if (tipo === "quitar" && cantidadNumero > stockActual)
      return "No puedes quitar más que el stock actual.";
    if (nuevoStock < 0)
      return "El ajuste dejaría el stock en negativo.";
    if (!motivo.trim()) return "Debes ingresar un motivo.";
    if (motivo.trim().length < 5)
      return "El motivo debe tener al menos 5 caracteres.";
    if (motivo.trim().length > 30)
      return "Máximo 30 caracteres en el motivo.";
    return null;
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

      {/* Overlay click */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-md rounded-3xl p-8
                   border border-blue-400/20
                   bg-gradient-to-br from-[#0b1a2e] to-[#0a1626]
                   shadow-[0_0_80px_rgba(59,130,246,0.25)]
                   animate-[fadeIn_0.25s_ease]"
      >

        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 tracking-tight
                       bg-gradient-to-r from-blue-300 to-cyan-400
                       bg-clip-text text-transparent">
          Ajustar stock
        </h2>

        <div className="text-sm text-zinc-400 space-y-2 mb-6">
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
              className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                tipo === "añadir"
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "bg-[#0f1f33] border-blue-400/20 text-zinc-400"
              }`}
            >
              Añadir stock
            </button>

            <button
              type="button"
              onClick={() => setTipo("quitar")}
              className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                tipo === "quitar"
                  ? "bg-red-500/20 border-red-500/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  : "bg-[#0f1f33] border-blue-400/20 text-zinc-400"
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
            className="w-full px-4 py-2 rounded-xl
                       bg-[#0f1f33]
                       border border-blue-400/20
                       text-white
                       focus:ring-2 focus:ring-blue-500/50
                       outline-none transition"
          />

          {/* PREVIEW */}
          {cantidad !== "" && (
            <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Nuevo stock</span>
                <span
                  className={`font-semibold ${
                    nuevoStock < 0 ? "text-red-400" : "text-white"
                  }`}
                >
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
            className="w-full px-4 py-2 rounded-xl
                       bg-[#0f1f33]
                       border border-blue-400/20
                       text-white resize-none
                       focus:ring-2 focus:ring-blue-500/50
                       outline-none transition"
          />

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-xl
                         border border-white/10 text-zinc-300
                         hover:bg-white/5 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-xl
                         bg-blue-500/20 text-blue-400
                         border border-blue-500/30
                         hover:bg-blue-500/30
                         hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]
                         transition"
            >
              {loading ? "Ajustando..." : "Confirmar ajuste"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}