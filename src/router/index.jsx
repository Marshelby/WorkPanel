import { createBrowserRouter } from "react-router-dom";

// layouts
import OwnerLayout from "../layouts/OwnerLayout";

// páginas privadas
import Dashboard from "../pages/Dashboard";
import Barberos from "../pages/Barberos";
import HorariosBarberos from "../pages/HorariosBarberos";
import Contabilidad from "../pages/Contabilidad";
import RegistrarCorte from "../pages/RegistrarCorte";
import OrdenBarberos from "../pages/OrdenBarberos";
import AgendaDelDia from "../pages/AgendaDelDia";
import CronogramaBarberia from "../pages/CronogramaBarberia";
import Configuracion from "../pages/Configuracion"; // 👈 NUEVO

// públicas
import Login from "../pages/Login";
import EstadoPublico from "../pages/EstadoPublico";

const router = createBrowserRouter([
  // 🔓 LOGIN
  {
    path: "/",
    element: <Login />,
  },

  // 🔒 PANEL PRIVADO
  {
    path: "/app",
    element: <OwnerLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "barberos", element: <Barberos /> },
      { path: "horarios-barberos", element: <HorariosBarberos /> },
      { path: "agenda-del-dia", element: <AgendaDelDia /> },
      { path: "cronograma", element: <CronogramaBarberia /> },
      { path: "contabilidad", element: <Contabilidad /> },
      { path: "registrar-corte", element: <RegistrarCorte /> },
      { path: "orden-barberos", element: <OrdenBarberos /> },
      { path: "configuracion", element: <Configuracion /> }, // 👈 NUEVA RUTA
    ],
  },

  // 🌍 ESTADO PÚBLICO
  {
    path: "/estado-barberia",
    element: <EstadoPublico />,
  },
]);

export default router;
