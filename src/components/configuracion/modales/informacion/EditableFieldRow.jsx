import React, { useState } from "react";

export default function EditableFieldRow({
  label,
  fieldKey,
  value,
  onSaveRequest,
}) {
  const [editing, setEditing] = useState(false);
  const [newValue, setNewValue] = useState(value || "");

  const handleCancel = () => {
    setNewValue(value || "");
    setEditing(false);
  };

  const handleSave = () => {
    onSaveRequest(fieldKey, newValue);
    setEditing(false);
  };

  /* =========================
     VALIDACIONES POR CAMPO
  ========================= */

  const renderInput = () => {

    // NOMBRE
    if (fieldKey === "nombre") {
      return (
        <input
          maxLength={30}
          minLength={3}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="mt-2 w-full px-3 py-2 border rounded-lg"
        />
      );
    }

    // TELEFONO
    if (fieldKey === "whatsapp_principal") {
      const editablePart = newValue.replace("+569", "");

      return (
        <div className="mt-2 flex items-center">
          <div className="px-3 py-2 border border-r-0 rounded-l-lg bg-zinc-100">
            +569
          </div>

          <input
            type="text"
            maxLength={8}
            value={editablePart}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              setNewValue("+569" + onlyNumbers);
            }}
            className="w-full px-3 py-2 border rounded-r-lg"
          />
        </div>
      );
    }

    // BLOQUES
    if (fieldKey === "bloques_agenda") {
      return (
        <select
          value={newValue}
          onChange={(e) => setNewValue(Number(e.target.value))}
          className="mt-2 w-full px-3 py-2 border rounded-lg"
        >
          <option value={30}>30</option>
          <option value={45}>45</option>
          <option value={60}>60</option>
          <option value={75}>75</option>
        </select>
      );
    }

    // UBICACION
    if (fieldKey === "ubicacion") {
      return (
        <input
          maxLength={60}
          minLength={5}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="mt-2 w-full px-3 py-2 border rounded-lg"
        />
      );
    }

    return null;
  };

  return (
    <div className="border-b border-zinc-200 py-5 flex items-center justify-between">
      <div className="flex-1 pr-6">
        <div className="text-xs uppercase text-zinc-400 font-semibold">
          {label}
        </div>

        {!editing ? (
          <div className="mt-2 text-lg font-semibold text-zinc-900">
            {value}
          </div>
        ) : (
          renderInput()
        )}
      </div>

      <div className="flex gap-2">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-sm px-3 py-1 rounded-lg border hover:bg-zinc-50"
          >
            Editar
          </button>
        ) : (
          <>
            <button
              onClick={handleCancel}
              className="text-sm text-zinc-500 hover:text-zinc-800"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="text-sm px-3 py-1 rounded-lg bg-black text-white disabled:opacity-40"
              disabled={
                (fieldKey === "whatsapp_principal" &&
                  newValue.length !== 12) ||
                (fieldKey === "nombre" && newValue.length < 3) ||
                (fieldKey === "ubicacion" && newValue.length < 5)
              }
            >
              Guardar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
