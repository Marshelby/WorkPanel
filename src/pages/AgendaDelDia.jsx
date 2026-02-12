import { useState } from "react";
import SelectorDiaAgenda from "../components/agenda/SelectorDiaAgenda";
import AgendaGrillaBarberos from "../components/agenda/AgendaGrillaBarberos";

const BARBERIA_ID = "2c2812a7-5095-4283-bb00-6c09e22f9c94";

export default function AgendaDelDia() {
  const hoyISO = new Date().toISOString().split("T")[0];
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoyISO);

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* HEADER + SELECTOR CENTRADOS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "22px", // 👈 ANTES 36px
        }}
      >
        {/* TÍTULO con icono a ambos lados */}
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "4px", // 👈 MÁS PEGADO
          }}
        >
          <span aria-hidden>📅</span>
          <span>Agenda</span>
          <span aria-hidden>📅</span>
        </h1>

        {/* SUBTÍTULO (más grande y en negrita) */}
        <div
          style={{
            color: "#333",       // 👈 más oscuro
            fontSize: "17px",    // 👈 más grande
            fontWeight: 600,     // 👈 en negrita
            textAlign: "center",
            maxWidth: "720px",
            marginBottom: "10px", // 👈 menos aire
          }}
        >
          Selecciona un día y revisa la disponibilidad por barbero
        </div>

        {/* SELECTOR centrado (más cerca del header) */}
        <div
          style={{
            marginTop: "8px", // 👈 ANTES 24px
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div style={{ display: "inline-flex" }}>
            <SelectorDiaAgenda
              barberiaId={BARBERIA_ID}
              fechaSeleccionada={fechaSeleccionada}
              onSelect={setFechaSeleccionada}
            />
          </div>
        </div>
      </div>

      {/* GRILLA */}
      <AgendaGrillaBarberos
        barberiaId={BARBERIA_ID}
        fechaISO={fechaSeleccionada}
      />
    </div>
  );
}
