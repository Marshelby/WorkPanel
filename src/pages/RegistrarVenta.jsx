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
    anularVenta,   // ✅ IMPORTANTE
  } = useVentas();

  return (
    <div className="min-h-screen bg-zinc-50 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Ventas
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Registro y control financiero de la empresa
        </p>
      </div>

      {/* ERROR GLOBAL */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* RESUMEN */}
      <div className="mb-8">
        <ResumenVentas resumen={resumen} />
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* FORMULARIO */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <FormularioVenta
              onRegistrarVenta={registrarVenta}
              loading={loading}
            />
          </div>
        </div>

        {/* HISTORIAL */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <HistorialVentas
              historial={historial}
              anularVenta={anularVenta}   // ✅ AQUÍ ESTABA EL PROBLEMA
              loading={loading}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
