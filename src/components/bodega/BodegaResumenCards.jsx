import { useEffect, useState } from "react";

function useAnimatedNumber(value, duration = 1200) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (value - start) * easeOut);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return displayValue;
}

export default function BodegaResumenCards({ resumen, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="relative rounded-3xl p-6 border border-blue-400/10 
                       bg-gradient-to-br from-[#0b1a2e]/70 to-[#0a1626]/70
                       backdrop-blur-xl animate-pulse"
          >
            <div className="h-3 bg-blue-900/40 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-blue-800/40 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const {
    totalProductos = 0,
    stockTotal = 0,
    totalCompra = 0,
    totalVenta = 0,
    utilidad = 0,
  } = resumen;

  const formatCLP = (num) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(num || 0);

  const animatedProductos = useAnimatedNumber(totalProductos);
  const animatedStock = useAnimatedNumber(stockTotal);
  const animatedCompra = useAnimatedNumber(totalCompra);
  const animatedVenta = useAnimatedNumber(totalVenta);
  const animatedUtilidad = useAnimatedNumber(utilidad);

  const cards = [
    {
      titulo: "Productos",
      valor: animatedProductos,
      color: "text-blue-400",
    },
    {
      titulo: "Stock total",
      valor: animatedStock,
      color: "text-zinc-200",
    },
    {
      titulo: "Valor compra",
      valor: formatCLP(animatedCompra),
      color: "text-yellow-400",
    },
    {
      titulo: "Valor venta",
      valor: formatCLP(animatedVenta),
      color: "text-emerald-400",
    },
    {
      titulo: "Utilidad proyectada",
      valor: formatCLP(animatedUtilidad),
      destaque: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 animate-fade-in-up">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`
            relative overflow-hidden rounded-3xl p-6 border 
            transition-all duration-500
            group
            ${
              card.destaque
                ? "bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                : "bg-gradient-to-br from-[#0b1a2e]/80 to-[#0a1626]/80 border-blue-400/15 shadow-[0_0_40px_rgba(59,130,246,0.15)]"
            }
          `}
        >
          {/* Glow breathing */}
          <div
            className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-700 ${
              card.destaque
                ? "bg-emerald-400/10"
                : "bg-blue-500/5"
            }`}
          />

          <p
            className={`text-[11px] uppercase tracking-[0.25em] font-medium ${
              card.destaque ? "text-emerald-400" : "text-zinc-400"
            }`}
          >
            {card.titulo}
          </p>

          <h3
            className={`text-2xl font-bold mt-4 tracking-tight transition-all duration-300 ${
              card.destaque ? "text-emerald-400" : card.color
            }`}
          >
            {card.valor}
          </h3>
        </div>
      ))}
    </div>
  );
}