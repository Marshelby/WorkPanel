import React, { useState } from "react";

export default function PinAdminModal({ isOpen, onClose, onConfirm }) {
  const [pin, setPin] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">
          Confirmar con PIN administrador
        </h3>

        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-sm text-zinc-500">
            Cancelar
          </button>

          <button
            onClick={() => onConfirm(pin)}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
