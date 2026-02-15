import React from "react";

export default function TablaCortes({ cortes = [], loading = false }) {

  if (loading) {
    return (
      <div
        id="tabla-contabilidad"
        className="bg-white border border-black rounded-xl p-6 scroll-mt-24"
      >
        <p>Cargando…</p>
      </div>
    );
  }

  return (
    <div
      id="tabla-contabilidad"
      className="bg-white border border-black rounded-xl scroll-mt-24 transition-all duration-300"
    >
      {/* CONTENEDOR CON ALTURA MAYOR */}
      <div className="max-h-[520px] overflow-y-auto">

        <table className="w-full text-sm">

          {/* HEADER STICKY */}
          <thead className="bg-zinc-100 border-b border-black sticky top-0 z-10">
            <tr>
              <th className="th text-left py-3">Fecha / Hora</th>
              <th className="th text-left py-3">Barbero</th>
              <th className="th text-left py-3">Servicio</th>
              <th className="th text-left py-3">Cliente</th>
              <th className="th text-left py-3">Teléfono</th>
              <th className="th text-right py-3">Precio</th>
              <th className="th text-right py-3">Barbero</th>
              <th className="th text-right py-3">Local</th>
              <th className="th text-center py-3">Editado</th>
              <th className="th text-center py-3">Origen</th>
            </tr>
          </thead>

          <tbody>
            {cortes.length === 0 ? (
              <tr>
                <td colSpan="10" className="td text-center py-10">
                  No hay registros
                </td>
              </tr>
            ) : (
              cortes.map((c, i) => (
                <tr
                  key={c.id}
                  className={`border-t border-zinc-300 transition-colors duration-150 ${
                    i % 2 === 0 ? "bg-white" : "bg-zinc-50"
                  } hover:bg-zinc-100`}
                >
                  <td className="td py-3">
                    {new Date(c.created_at).toLocaleString("es-CL")}
                  </td>

                  <td className="td py-3">{c.barbero_nombre || "-"}</td>

                  <td className="td py-3">{c.tipo_corte_nombre || "-"}</td>

                  <td className="td py-3">{c.nombre_cliente || "-"}</td>

                  <td className="td py-3">{c.telefono_cliente || "-"}</td>

                  <td className="td text-right font-medium py-3">
                    ${Number(c.precio || 0).toLocaleString()}
                  </td>

                  <td className="td text-right py-3">
                    ${Number(c.monto_barbero || 0).toLocaleString()}
                  </td>

                  <td className="td text-right py-3">
                    ${Number(c.monto_barberia || 0).toLocaleString()}
                  </td>

                  <td className="td text-center py-3">
                    {c.edicion ? (
                      <span className="text-red-600 font-medium">Sí</span>
                    ) : (
                      <span className="text-zinc-500">No</span>
                    )}
                  </td>

                  <td className="td text-center py-3">
                    {c.origen === "historico" ? (
                      <span className="text-zinc-500">Histórico</span>
                    ) : (
                      <span className="text-green-600">Activo</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}
