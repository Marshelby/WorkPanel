import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useBarberia } from "../context/BarberiaContext";

import ContabilidadFilters from "../components/contabilidad/ContabilidadFilters";
import TablaCortes from "../components/contabilidad/TablaCortes";
import ResumenTotales from "../components/contabilidad/ResumenTotales";
import ResumenPorBarbero from "../components/contabilidad/ResumenPorBarbero";
import TopBarberosBox from "../components/contabilidad/TopBarberosBox";

export default function Contabilidad() {
  const { barberia, loading: loadingBarberia } = useBarberia();

  const [fecha, setFecha] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [modo, setModo] = useState("dia");
  const [barberoFiltro, setBarberoFiltro] = useState("todos");

  const [cortes, setCortes] = useState([]);
  const [loading, setLoading] = useState(false);

  const barberiaId = barberia?.id;

  /* =========================
     RANGO FECHA
  ========================= */

  function getRangoDiaISO(dateStr) {
    const [y, m, d] = dateStr.split("-");
    const inicio = new Date(y, m - 1, d, 0, 0, 0, 0);
    const fin = new Date(y, m - 1, d, 23, 59, 59, 999);
    return { inicio: inicio.toISOString(), fin: fin.toISOString() };
  }

  function getRangoMesISO(dateStr) {
    const [y, m] = dateStr.split("-");
    const year = Number(y);
    const month = Number(m) - 1;
    const inicio = new Date(year, month, 1, 0, 0, 0, 0);
    const fin = new Date(year, month + 1, 0, 23, 59, 59, 999);
    return { inicio: inicio.toISOString(), fin: fin.toISOString() };
  }

  /* =========================
     FETCH
  ========================= */

  useEffect(() => {
    if (!barberiaId) return;
    fetchCortes();
  }, [fecha, modo, barberiaId]);

  async function fetchCortes() {
    if (!barberiaId) return;

    setLoading(true);

    try {
      const { inicio, fin } =
        modo === "dia"
          ? getRangoDiaISO(fecha)
          : getRangoMesISO(fecha);

      const { data, error } = await supabase
        .from("v_cortes_contabilidad")
        .select("*")
        .eq("barberia_id", barberiaId)
        .gte("created_at", inicio)
        .lte("created_at", fin)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setCortes(data || []);
    } catch (err) {
      console.error("Error contabilidad:", err);
      setCortes([]);
    }

    setLoading(false);
  }

  /* =========================
     FILTRO
  ========================= */

  const cortesFiltrados = useMemo(() => {
    if (barberoFiltro === "todos") return cortes;
    return cortes.filter(
      (c) => c.barbero_nombre === barberoFiltro
    );
  }, [cortes, barberoFiltro]);

  /* =========================
     TOTALES
  ========================= */

  const totalIngresos = useMemo(
    () =>
      cortesFiltrados.reduce(
        (acc, c) => acc + Number(c.precio || 0),
        0
      ),
    [cortesFiltrados]
  );

  const totalBarberos = useMemo(
    () =>
      cortesFiltrados.reduce(
        (acc, c) => acc + Number(c.monto_barbero || 0),
        0
      ),
    [cortesFiltrados]
  );

  const totalLocal = useMemo(
    () =>
      cortesFiltrados.reduce(
        (acc, c) => acc + Number(c.monto_barberia || 0),
        0
      ),
    [cortesFiltrados]
  );

  /* =========================
     RESUMEN BARBEROS
  ========================= */

  const resumenBarberos = useMemo(() => {
    const acc = {};

    cortesFiltrados.forEach((c) => {
      const nombre = c.barbero_nombre || "Sin nombre";

      if (!acc[nombre]) {
        acc[nombre] = {
          nombre,
          cortes: 0,
          ganado: 0,
          generado: 0,
        };
      }

      acc[nombre].cortes += 1;
      acc[nombre].ganado += Number(c.monto_barbero || 0);
      acc[nombre].generado += Number(c.precio || 0);
    });

    return Object.values(acc).sort(
      (a, b) => b.ganado - a.ganado
    );
  }, [cortesFiltrados]);

  const topBarberos = useMemo(() => {
    const acc = {};

    cortes.forEach((c) => {
      const nombre = c.barbero_nombre || "Sin nombre";
      if (!acc[nombre]) acc[nombre] = { nombre, total: 0 };
      acc[nombre].total += Number(c.precio || 0);
    });

    return Object.values(acc)
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  }, [cortes]);

  const barberosDisponibles = useMemo(() => {
    const set = new Set();
    cortes.forEach(
      (c) => c.barbero_nombre && set.add(c.barbero_nombre)
    );
    return Array.from(set).sort();
  }, [cortes]);

  if (loadingBarberia) {
    return <p>Cargando barbería…</p>;
  }

  /* =========================
     UI FINAL ORDENADA
  ========================= */

  return (
    <div className="space-y-6">

      <ContabilidadFilters
        fecha={fecha}
        setFecha={setFecha}
        modo={modo}
        setModo={setModo}
        barberoFiltro={barberoFiltro}
        setBarberoFiltro={setBarberoFiltro}
        barberosDisponibles={barberosDisponibles}
      />

      {/* ===== TOTALES + MEJORES ===== */}

      <div className="grid grid-cols-12 gap-6 items-stretch">

        <div className="col-span-12 xl:col-span-8">
          <ResumenTotales
            totalIngresos={totalIngresos}
            totalBarberos={totalBarberos}
            totalLocal={totalLocal}
            loading={loading}
          />
        </div>

        {barberoFiltro === "todos" && (
          <div className="col-span-12 xl:col-span-4">
            <TopBarberosBox
              topBarberos={topBarberos}
              modo={modo}
              loading={loading}
            />
          </div>
        )}

      </div>

      {/* ===== TABLA ===== */}

      <TablaCortes
        cortes={cortesFiltrados}
        loading={loading}
      />

      {/* ===== CORTES POR BARBERO FULL WIDTH ===== */}

      {barberoFiltro === "todos" && (
        <div>
          <ResumenPorBarbero
            resumen={resumenBarberos}
            loading={loading}
          />
        </div>
      )}

    </div>
  );
}
