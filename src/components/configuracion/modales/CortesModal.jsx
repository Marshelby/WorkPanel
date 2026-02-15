import React, { useState, useEffect } from "react";
import { useTiposCorte } from "../../../hooks/useTiposCorte";

export default function CortesModal({
  isOpen,
  onClose,
  cortes = [],
  barberiaId,
  onUpdated
}) {

  const {
    loading,
    crearCorte,
    editarCorte,
    desactivarCorte
  } = useTiposCorte(barberiaId, onUpdated);

  const [editandoId, setEditandoId] = useState(null);
  const [nombreEdit, setNombreEdit] = useState("");
  const [precioEdit, setPrecioEdit] = useState("");

  const [agregando, setAgregando] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [precioNuevo, setPrecioNuevo] = useState("");

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinIngresado, setPinIngresado] = useState("");
  const [accion, setAccion] = useState(null);

  const [mensaje, setMensaje] = useState(null);

  /* =========================
     AUTO OCULTAR MENSAJE
  ========================= */
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  /* =========================
     CERRAR CON ESC
  ========================= */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !pinModalOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, pinModalOpen]);

  const reset = () => {
    setEditandoId(null);
    setNombreEdit("");
    setPrecioEdit("");
    setAgregando(false);
    setNombreNuevo("");
    setPrecioNuevo("");
    setPinIngresado("");
    setAccion(null);
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  if (!isOpen) return null;

  const soloNumeros = (val) => val.replace(/\D/g, "").slice(0, 5);
  const soloTexto = (val) => val.slice(0, 30);

  const abrirPin = (tipoAccion) => {
    setAccion(tipoAccion);
    setPinModalOpen(true);
  };

  const ejecutarAccion = async () => {
    try {

      if (accion === "crear") {
        await crearCorte({
          nombre: nombreNuevo,
          precio: precioNuevo,
          pin: pinIngresado
        });
        setMensaje("Corte creado correctamente");
      }

      if (accion === "editar") {
        await editarCorte({
          corteId: editandoId,
          nombre: nombreEdit,
          precio: precioEdit,
          pin: pinIngresado
        });
        setMensaje("Corte actualizado correctamente");
      }

      if (accion === "eliminar") {
        await desactivarCorte({
          corteId: editandoId,
          pin: pinIngresado
        });
        setMensaje("Corte desactivado correctamente");
      }

      setPinModalOpen(false);
      reset();

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={!pinModalOpen ? handleClose : undefined}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm"
      >
        {/* MODAL */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 relative"
        >

          {/* CERRAR */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700"
          >
            ✖
          </button>

          <h2 className="text-xl font-semibold text-zinc-900 mb-6">
            Gestionar Tipos de Corte
          </h2>

          {/* MENSAJE ÉXITO */}
          {mensaje && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
              {mensaje}
            </div>
          )}

          {/* LISTADO */}
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">

            {cortes.map((corte) => {

              const esPromocion =
                corte.nombre.toLowerCase().includes("promo");

              return (
                <div
                  key={corte.id}
                  className="border border-zinc-200 rounded-xl p-5 bg-zinc-50"
                >

                  {editandoId === corte.id ? (
                    <div className="space-y-3">

                      <input
                        value={nombreEdit}
                        onChange={(e) =>
                          setNombreEdit(soloTexto(e.target.value))
                        }
                        maxLength={30}
                        className="w-full px-4 py-2 border border-zinc-200 rounded-lg"
                      />

                      <input
                        value={precioEdit}
                        onChange={(e) =>
                          setPrecioEdit(soloNumeros(e.target.value))
                        }
                        maxLength={5}
                        className="w-full px-4 py-2 border border-zinc-200 rounded-lg"
                      />

                      <div className="flex justify-between">
                        <button
                          onClick={() => setEditandoId(null)}
                          className="text-sm text-zinc-500"
                        >
                          Cancelar
                        </button>

                        <button
                          disabled={loading}
                          onClick={() => abrirPin("editar")}
                          className="px-4 py-1 rounded-lg bg-zinc-900 text-white text-sm"
                        >
                          Guardar
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="flex items-center justify-between">

                      <div>
                        <div className="font-medium text-zinc-900">
                          {corte.nombre}
                        </div>
                        <div className="text-sm text-zinc-500">
                          ${Number(corte.precio).toLocaleString()}
                        </div>
                      </div>

                      {!esPromocion && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditandoId(corte.id);
                              setNombreEdit(corte.nombre);
                              setPrecioEdit(String(corte.precio));
                            }}
                            className="px-3 py-1 rounded-lg bg-zinc-200 text-sm"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => {
                              setEditandoId(corte.id);
                              abrirPin("eliminar");
                            }}
                            className="px-3 py-1 rounded-lg bg-red-100 text-red-600 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}

          </div>

          {/* AGREGAR */}
          <div className="mt-8 pt-6 border-t border-zinc-200">

            {!agregando ? (
              <button
                onClick={() => setAgregando(true)}
                className="w-full py-3 rounded-xl border-2 border-dashed border-zinc-300 text-zinc-600 hover:bg-zinc-50 font-medium"
              >
                ➕ Añadir corte
              </button>
            ) : (
              <div className="space-y-3">

                <input
                  placeholder="Nombre del servicio"
                  value={nombreNuevo}
                  onChange={(e) =>
                    setNombreNuevo(soloTexto(e.target.value))
                  }
                  maxLength={30}
                  className="w-full px-4 py-2 border border-zinc-200 rounded-lg"
                />

                <input
                  placeholder="Valor"
                  value={precioNuevo}
                  onChange={(e) =>
                    setPrecioNuevo(soloNumeros(e.target.value))
                  }
                  maxLength={5}
                  className="w-full px-4 py-2 border border-zinc-200 rounded-lg"
                />

                <div className="flex justify-between">
                  <button
                    onClick={reset}
                    className="text-sm text-zinc-500"
                  >
                    Cancelar
                  </button>

                  <button
                    disabled={!nombreNuevo || !precioNuevo || loading}
                    onClick={() => abrirPin("crear")}
                    className="px-4 py-2 rounded-lg bg-zinc-900 text-white disabled:opacity-50"
                  >
                    Guardar corte
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* MODAL PIN */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">

            <h3 className="font-semibold text-lg mb-4">
              Confirmar PIN administrador
            </h3>

            <input
              type="password"
              value={pinIngresado}
              onChange={(e) =>
                setPinIngresado(e.target.value)
              }
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg mb-4"
              placeholder="Ingresa PIN"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setPinModalOpen(false)}
                className="text-sm text-zinc-500"
              >
                Cancelar
              </button>

              <button
                disabled={loading}
                onClick={ejecutarAccion}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm"
              >
                Confirmar
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
