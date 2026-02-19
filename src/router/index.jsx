import { createBrowserRouter } from "react-router-dom";

// layouts
import OwnerLayout from "../layouts/OwnerLayout";

// páginas privadas
import Inicio from "../pages/Inicio";
import RegistrarVenta from "../pages/RegistrarVenta";
import Bodega from "../pages/Bodega";
import EditarBodega from "../pages/EditarBodega";
import Contabilidad from "../pages/Contabilidad";
import Configuracion from "../pages/Configuracion";

// públicas
import Login from "../pages/Login";

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
      { index: true, element: <Inicio /> },
      { path: "inicio", element: <Inicio /> },
      { path: "registrar-venta", element: <RegistrarVenta /> },
      { path: "bodega", element: <Bodega /> },
      { path: "editar-bodega", element: <EditarBodega /> },
      { path: "contabilidad", element: <Contabilidad /> },
      { path: "configuracion", element: <Configuracion /> },
    ],
  },
]);

export default router;
