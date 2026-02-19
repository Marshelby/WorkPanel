export default function BodegaResumenCards({ resumen, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 border border-white/10 bg-zinc-900 animate-pulse"
          >
            <div className="h-4 bg-zinc-700 rounded w-1/2 mb-3"></div>
            <div className="h-6 bg-zinc-600 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const {
    totalProductos,
    stockTotal,
    totalCompra,
    totalVenta,
    utilidad,
  } = resumen;

  const formatCLP = (num) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(num || 0);

  const cards = [
    {
      titulo: "Productos",
      valor: totalProductos,
      color: "text-blue-400",
    },
    {
      titulo: "Stock total",
      valor: stockTotal,
      color: "text-zinc-200",
    },
    {
      titulo: "Valor compra",
      valor: formatCLP(totalCompra),
      color: "text-yellow-400",
    },
    {
      titulo: "Valor venta",
      valor: formatCLP(totalVenta),
      color: "text-emerald-400",
    },
    {
      titulo: "Utilidad proyectada",
      valor: formatCLP(utilidad),
      destaque: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`
            rounded-2xl p-5 border transition
            ${
              card.destaque
                ? "bg-emerald-500/10 border-emerald-500/30 shadow-lg"
                : "bg-zinc-900 border-white/10 hover:bg-zinc-800"
            }
          `}
        >
          <p
            className={`text-xs uppercase tracking-wider ${
              card.destaque ? "text-emerald-400" : "text-zinc-400"
            }`}
          >
            {card.titulo}
          </p>

          <h3
            className={`text-xl font-bold mt-2 ${
              card.destaque
                ? "text-emerald-400"
                : card.color
            }`}
          >
            {card.valor}
          </h3>
        </div>
      ))}
    </div>
  );
}
