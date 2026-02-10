import { useState } from 'react'
import { useEffect } from 'react'
import { useAuthStore } from '@store/authStore'
import { authApi } from '@services/api'

const AuthPanel = () => {
  const { user, login, register, logout, setUser, token } = useAuthStore()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({
    email: '',
    password: '',
    displayName: '',
    goal: 'endurance',
    preferredUnits: 'metric' as 'metric' | 'imperial',
  })
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!token || user) return
      try {
        const response = await authApi.me()
        setUser(response.data)
      } catch {
        setStatus('Session expired, please sign in')
      }
    }
    loadProfile()
  }, [token, user, setUser])

  const handleSubmit = async () => {
    setStatus(null)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register({
          email: form.email,
          password: form.password,
          displayName: form.displayName || 'Energy User',
          goal: form.goal,
          preferredUnits: form.preferredUnits,
        })
      }
      setStatus('Authenticated')
    } catch (error: any) {
      setStatus(error?.response?.data?.message || 'Auth failed')
    }
  }

  return (
    <div className="card-glass space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Authentication</p>
          <h3 className="mt-2 text-lg font-semibold">
            {user ? `Signed in as ${user.displayName}` : 'Sign in to sync your data'}
          </h3>
        </div>
        {user ? (
          <button className="rounded-full border border-foreground/30 px-4 py-2 text-xs font-semibold" onClick={logout}>
            Log out
          </button>
        ) : null}
      </div>
      {!user ? (
        <div className="space-y-3">
          <div className="flex gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
            <button
              className={`rounded-full px-4 py-2 ${mode === 'login' ? 'bg-foreground text-background' : 'border border-foreground/30 text-foreground'}`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              className={`rounded-full px-4 py-2 ${mode === 'register' ? 'bg-foreground text-background' : 'border border-foreground/30 text-foreground'}`}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <input
              className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            {mode === 'register' ? (
              <>
                <input
                  className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm"
                  placeholder="Display name"
                  value={form.displayName}
                  onChange={(event) => setForm({ ...form, displayName: event.target.value })}
                />
                <input
                  className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm"
                  placeholder="Goal (fat loss, muscle, endurance)"
                  value={form.goal}
                  onChange={(event) => setForm({ ...form, goal: event.target.value })}
                />
              </>
            ) : null}
          </div>
          <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={handleSubmit}>
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
          {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Your token is stored locally for API calls.</p>
      )}
    </div>
  )
}

export default AuthPanel
