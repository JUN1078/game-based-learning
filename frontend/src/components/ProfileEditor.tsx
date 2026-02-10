import { useEffect, useState } from 'react'
import { authApi } from '@services/api'
import { User } from '@/types'

const ProfileEditor = () => {
  const [form, setForm] = useState<Partial<User>>({
    displayName: '',
    gender: '',
    dateOfBirth: '',
    heightCm: undefined,
    weightKg: undefined,
    goal: '',
    preferredUnits: 'metric',
  })
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await authApi.me()
        setForm({
          displayName: response.data.displayName,
          gender: response.data.gender,
          dateOfBirth: response.data.dateOfBirth,
          heightCm: response.data.heightCm,
          weightKg: response.data.weightKg,
          goal: response.data.goal,
          preferredUnits: response.data.preferredUnits || 'metric',
        })
      } catch {
        setStatus('Login required to edit profile')
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setStatus(null)
    try {
      await authApi.updateProfile(form)
      setStatus('Profile updated')
    } catch {
      setStatus('Update failed')
    }
  }

  return (
    <div className="card-glass space-y-4">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Profile Editor</p>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm"
          placeholder="Display name"
          value={form.displayName || ''}
          onChange={(event) => setForm({ ...form, displayName: event.target.value })}
        />
        <input
          className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm"
          placeholder="Gender"
          value={form.gender || ''}
          onChange={(event) => setForm({ ...form, gender: event.target.value })}
        />
        <input
          className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm"
          placeholder="Date of birth (YYYY-MM-DD)"
          value={form.dateOfBirth || ''}
          onChange={(event) => setForm({ ...form, dateOfBirth: event.target.value })}
        />
        <input
          className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm"
          placeholder="Goal"
          value={form.goal || ''}
          onChange={(event) => setForm({ ...form, goal: event.target.value })}
        />
        <input
          className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm"
          placeholder="Height (cm)"
          value={form.heightCm ?? ''}
          onChange={(event) => setForm({ ...form, heightCm: Number(event.target.value) })}
        />
        <input
          className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm"
          placeholder="Weight (kg)"
          value={form.weightKg ?? ''}
          onChange={(event) => setForm({ ...form, weightKg: Number(event.target.value) })}
        />
      </div>
      <button className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-background" onClick={handleSave}>
        Save Profile
      </button>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </div>
  )
}

export default ProfileEditor
