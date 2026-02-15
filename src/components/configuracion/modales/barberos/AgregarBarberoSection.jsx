import { useEffect, useRef, useState } from "react";

export default function AgregarBarberoSection({
  loadingId,
  onRequestAccion,
  barberosActivos = [],
}) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [error, setError] = useState("");

  const containerRef = useRef(null);

  /* =========================
     SCROLL AUTOMATICO
  ========================= */
  useEffect(() => {
    if (open && containerRef.current) {
      setTimeout(() => {
        containerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 120);
    }
  }, [open]);

  /* =========================
     VALIDACIONES
  ========================= */

  const validarCampos = () => {
    const nombreTrim = nombre.trim();
    const telefonoTrim = telefono.trim();
    const porcentajeNum = Number(porcentaje);

    if (!nombreTrim || !telefonoTrim || !porcentaje) {
      return "Debes completar todos los campos.";
    }

    if (telefonoTrim.length !== 8) {
      return "El teléfono debe tener 8 dígitos.";
    }

    if (porcentajeNum < 1 || porcentajeNum > 100) {
      return "El porcentaje debe estar entre 1 y 100.";
    }

    // VALIDACION CASE INSENSITIVE
    const existe = barberosActivos.some(
      (b) =>
        b.nombre.trim().toLowerCase() ===
        nombreTrim.toLowerCase()
    );

    if (existe) {
      return "Ya existe un barbero activo con ese nombre.";
    }

    return null;
  };

  const handleGuardar = () => {
    const errorValidacion = validarCampos();

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setError("");

    onRequestAccion({
      tipo: "agregar",
      data: {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        porcentaje: porcentaje.trim(),
      },
    });
  };

  const resetLocal = () => {
    setOpen(false);
    setNombre("");
    setTelefono("");
    setPorcentaje("");
    setError("");
  };

  return (
    <div ref={containerRef} className="mt-6">
      {!open ? (
        <button
          onClick={() => {
            setOpen(true);
            setError("");
          }}
          className="w-full py-3 border border-dashed border-zinc-300 rounded-xl hover:bg-black hover:text-white transition"
        >
          ➕ Añadir barbero
        </button>
      ) : (
        <div className="space-y-4 border p-5 rounded-xl bg-zinc-50 transition-all duration-300">
          <input
            type="text"
            maxLength={25}
            value={nombre}
            onChange={(e) =>
              setNombre(e.target.value.slice(0, 25))
            }
            placeholder="Nombre (máx 25 caracteres)"
            className={`w-full px-4 py-2 border rounded-lg ${
              error ? "border-red-500" : "border-zinc-300"
            }`}
          />

          <div className="flex items-center border rounded-lg px-3">
            <span className="text-sm text-zinc-500 mr-2">
              +569
            </span>
            <input
              type="number"
              value={telefono}
              onChange={(e) =>
                setTelefono(e.target.value.slice(0, 8))
              }
              className="w-full py-2 outline-none"
              placeholder="Teléfono (8 dígitos)"
            />
          </div>

          <input
            type="number"
            min={1}
            max={100}
            value={porcentaje}
            onChange={(e) =>
              setPorcentaje(e.target.value.slice(0, 3))
            }
            placeholder="% comisión"
            className={`w-full px-4 py-2 border rounded-lg ${
              error ? "border-red-500" : "border-zinc-300"
            }`}
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              disabled={loadingId === "agregar"}
              onClick={handleGuardar}
              className="w-full py-2 bg-black text-white rounded-lg disabled:opacity-40"
            >
              Guardar cambio
            </button>

            <button
              onClick={resetLocal}
              className="w-full py-2 border rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
