import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const WorkContext = createContext();

export function WorkProvider({ children }) {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpresa = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setEmpresa(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("work_view_empresas") // 👈 VIEW CORRECTA
        .select("*")
        .eq("owner_user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error cargando empresa:", error);
        setEmpresa(null);
      } else {
        setEmpresa(data);
      }

      setLoading(false);
    };

    fetchEmpresa();
  }, []);

  return (
    <WorkContext.Provider value={{ empresa, loading }}>
      {children}
    </WorkContext.Provider>
  );
}

export function useWork() {
  const context = useContext(WorkContext);

  if (!context) {
    throw new Error("useWork debe usarse dentro de WorkProvider");
  }

  return context;
}
