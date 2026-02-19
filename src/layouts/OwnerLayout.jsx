import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

export default function OwnerLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/", { replace: true });
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/", { replace: true });
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="h-screen flex bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 overflow-hidden">

      {/* SIDEBAR */}
      <aside className="flex-shrink-0 h-full">
        <Sidebar />
      </aside>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="flex-shrink-0 border-b border-white/10 backdrop-blur bg-black/40">
          <Header />
        </header>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-6">

          <div
            className="
              relative
              rounded-2xl
              border border-white/10
              bg-white/[0.04]
              backdrop-blur-md
              shadow-[inset_0_0_40px_rgba(255,255,255,0.02)]
              p-6
            "
          >
            <Outlet />
          </div>

        </main>

      </div>
    </div>
  );
}
