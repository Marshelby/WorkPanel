import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session) {
        navigate("/app", { replace: true })
      }
    }
    checkSession()
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate("/app", { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-6">

      {/* Glow de fondo */}
      <div className="absolute w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full bottom-0 right-0 pointer-events-none" />

      <div className="relative w-full max-w-md">

        <div className="
          relative rounded-3xl p-10
          bg-white/5 backdrop-blur-xl
          border border-white/10
          shadow-[0_0_60px_rgba(0,0,0,0.6)]
          transition-all duration-300
          hover:border-emerald-400/40
          hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]
        ">

          {/* Título */}
          <h1 className="text-3xl font-black text-white tracking-tight">
            Bienvenido a <span className="text-emerald-400">BarberPanel</span>
          </h1>

          <p className="text-zinc-400 mt-3 text-sm">
            Accede a tu panel administrativo
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">

            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400">
                Correo
              </label>
              <input
                type="email"
                placeholder="correo@barberia.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  mt-2 w-full rounded-xl px-4 py-3
                  bg-zinc-900 border border-white/10
                  text-white placeholder-zinc-500
                  focus:outline-none focus:border-emerald-400/60
                  focus:ring-2 focus:ring-emerald-400/30
                  transition-all
                "
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  mt-2 w-full rounded-xl px-4 py-3
                  bg-zinc-900 border border-white/10
                  text-white placeholder-zinc-500
                  focus:outline-none focus:border-emerald-400/60
                  focus:ring-2 focus:ring-emerald-400/30
                  transition-all
                "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-xl
                bg-emerald-500
                hover:bg-emerald-400
                text-black font-bold
                transition-all duration-300
                hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]
                disabled:opacity-60
              "
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

            {error && (
              <p className="text-red-400 text-sm mt-2">
                {error}
              </p>
            )}

          </form>

        </div>
      </div>
    </div>
  )
}
