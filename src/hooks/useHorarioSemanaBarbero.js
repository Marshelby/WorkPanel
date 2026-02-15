import { useHorarioSemanaBarbero } from "../../hooks/useHorarioSemanaBarbero";

const DIAS_CORTO = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

export default function HorarioSemanaBarbero({
  barbero,
  semana,
}) {
  const { datos, loading } = useHorarioSemanaBarbero({
    barbero,
    semana,
  });

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Cargando semana...
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 mt-4">

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Horario semanal
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {barbero.nombre}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Día</th>
              <th>Entrada</th>
              <th>Salida col.</th>
              <th>Regreso</th>
              <th>Salida</th>
              <th>Origen</th>
            </tr>
          </thead>

          <tbody>
            {datos.map((d) => {
              const fechaObj = new Date(d.fecha + "T00:00:00");
              const nombreDia =
                DIAS_CORTO[(fechaObj.getDay() + 6) % 7];

              return (
                <tr
                  key={d.fecha}
                  className="border-b hover:bg-gray-50 transition-all"
                >
                  <td className="py-2 font-medium">
                    {nombreDia} {fechaObj.getDate()}
                  </td>

                  {!d.presente ? (
                    <td
                      colSpan="5"
                      className="text-red-600 font-semibold text-center"
                    >
                      Local cerrado
                    </td>
                  ) : (
                    <>
                      <td className="text-center">
                        {d.entrada || "-"}
                      </td>
                      <td className="text-center">
                        {d.salidaColacion || "-"}
                      </td>
                      <td className="text-center">
                        {d.regresoColacion || "-"}
                      </td>
                      <td className="text-center">
                        {d.salida || "-"}
                      </td>
                      <td className="text-center">
                        {d.origen === "base" && (
                          <span className="text-gray-500 text-xs">
                            Base
                          </span>
                        )}
                        {d.origen === "cronograma" && (
                          <span className="text-blue-600 text-xs font-semibold">
                            Especial
                          </span>
                        )}
                        {d.origen === "individual" && (
                          <span className="text-green-600 text-xs font-semibold">
                            Individual
                          </span>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
