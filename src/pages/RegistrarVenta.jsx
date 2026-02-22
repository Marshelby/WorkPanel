import useVentas from "../hooks/useVentas";
import ResumenVentas from "../components/ventas/ResumenVentas";
import FormularioVenta from "../components/ventas/FormularioVenta";
import HistorialVentas from "../components/ventas/HistorialVentas";

export default function RegistrarVenta() {
  const {
    historial,
    resumen,
    loading,
    error,
    registrarVenta,
    anularVenta,
  } = useVentas();

  const hayVentas = resumen?.ventas_dia > 0 || resumen?.total_dia > 0;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#05070d] via-[#07101c] to-[#040812] text-zinc-100 p-8">

      {/* 🔵 Glow principal */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-160px] left-[-160px] w-[500px] h-[500px] bg-blue-600/25 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-160px] right-[-160px] w-[500px] h-[500px] bg-cyan-400/20 blur-[180px] rounded-full" />
      </div>

      <div className="relative space-y-12">

        {/* 🔵 BANNER METÁLICO */}
        <div className="relative overflow-hidden rounded-3xl p-10 border border-blue-400/20 bg-gradient-to-br from-[#0a1626]/70 via-[#0c1d33]/60 to-[#0a1626]/70 backdrop-blur-xl shadow-[0_0_60px_rgba(59,130,246,0.25)]">

          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-[160px] pointer-events-none" />

          <div className="flex items-center gap-3 mb-5">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.9)]" />
            <p className="text-xs uppercase tracking-[0.35em] text-blue-300/70">
              Gestión Financiera
            </p>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.8)]">
            VENTAS
          </h1>

          <p className="mt-5 text-zinc-400 max-w-3xl">
            Registro, análisis y control estructurado del flujo de ingresos.
          </p>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl text-sm backdrop-blur">
            {error}
          </div>
        )}

        {/* 🔵 RESUMEN CON REACCIÓN VISUAL */}
        <div
          className={`transition-all duration-300 rounded-2xl p-6 backdrop-blur-xl border ${
            hayVentas
              ? "bg-gradient-to-br from-[#0b1f36]/80 to-[#0a1a2e]/80 border-blue-400/30 shadow-[0_0_50px_rgba(59,130,246,0.35)]"
              : "bg-gradient-to-br from-[#0b1a2e]/70 to-[#0a1626]/70 border-blue-400/15 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
          }`}
        >
          <ResumenVentas resumen={resumen} />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

          {/* FORMULARIO */}
          <div className="xl:col-span-1 bg-gradient-to-br from-[#0b1a2e]/70 to-[#0a1626]/70 border border-blue-400/15 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(59,130,246,0.35)]">

            <FormularioVenta
              onRegistrarVenta={registrarVenta}
              loading={loading}
              className="work-btn-blue"
            />

          </div>

          {/* HISTORIAL */}
          <div className="xl:col-span-2 bg-gradient-to-br from-[#0b1a2e]/70 to-[#0a1626]/70 border border-blue-400/15 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(59,130,246,0.35)]">
            <HistorialVentas
              historial={historial}
              anularVenta={anularVenta}
              loading={loading}
            />
          </div>

        </div>

      </div>
    </div>
  );
}