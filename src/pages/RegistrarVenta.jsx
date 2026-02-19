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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#0f1720] to-[#0c1117] text-zinc-100 p-6">

      {/* Glow decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-blue-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative space-y-10">

        {/* BANNER */}
        <div className="relative overflow-hidden rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

          <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Gestión Financiera
            </p>
          </div>

          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            VENTAS
          </h1>

          <p className="mt-4 text-zinc-400 max-w-3xl">
            Registro, análisis y control estructurado del flujo de ingresos.
          </p>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* ERROR GLOBAL */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl text-sm backdrop-blur">
            {error}
          </div>
        )}

        {/* RESUMEN */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
          <ResumenVentas resumen={resumen} />
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* FORMULARIO */}
          <div className="xl:col-span-1 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <FormularioVenta
              onRegistrarVenta={registrarVenta}
              loading={loading}
            />
          </div>

          {/* HISTORIAL */}
          <div className="xl:col-span-2 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
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
