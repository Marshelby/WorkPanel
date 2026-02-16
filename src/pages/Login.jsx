import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

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

    // 🔥 Activar overlay premium
    setSuccess(true)

    setTimeout(() => {
      navigate("/app", { replace: true })
    }, 1600)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black overflow-hidden">

      {/* Glow fondo */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px]" />

      {/* Card Login */}
      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl transition-all duration-500 hover:border-emerald-400/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]">

        <h1 className="text-3xl font-black text-white tracking-tight">
          Bienvenido a <span className="text-emerald-400">BarberPanel</span>
        </h1>

        <p className="text-zinc-400 mt-2 mb-8">
          Accede a tu panel administrativo
        </p>

        <form onSubmit={handleLogin} className="space-y-6">

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
              className="mt-2 w-full rounded-xl bg-zinc-900/60 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
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
              className="mt-2 w-full rounded-xl bg-zinc-900/60 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar al Panel"}
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center">
              {error}
            </p>
          )}
        </form>
      </div>

      {/* 🔥 OVERLAY ULTRA PREMIUM */}
      {success && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 animate-fadeIn">
          
          {/* Glow central */}
          <div className="absolute w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[150px]" />

          <div className="relative text-center animate-scaleIn">
            <h2 className="text-4xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.9)]">
              Bienvenido Administrador
            </h2>
            <p className="text-zinc-300 mt-4 text-lg">
              Inicializando panel...
            </p>
          </div>
        </div>
      )}

      {/* Animaciones */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out forwards;
          }

          .animate-scaleIn {
            animation: scaleIn 0.5s ease-out forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  )
}
