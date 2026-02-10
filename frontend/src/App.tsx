import Dashboard from '@pages/Dashboard'
import FoodLog from '@pages/FoodLog'
import InBodyUpload from '@pages/InBodyUpload'
import CorosUpload from '@pages/CorosUpload'
import MetricCard from '@components/MetricCard'
import AuthPanel from '@components/AuthPanel'
import ProfileEditor from '@components/ProfileEditor'
import { useAuthStore } from '@store/authStore'

function App() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="ambient-orbs" aria-hidden="true" />
      <header className="sticky top-0 z-40 border-b border-white/20 bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-[2px]">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white text-sm font-semibold text-slate-900">
                EM
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">EnergyOS</p>
              <h1 className="text-sm font-semibold md:text-lg">Energy Management</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#dashboard" className="hover:text-foreground">Dashboard</a>
            <a href="#food" className="hover:text-foreground">Food Log</a>
            <a href="#inbody" className="hover:text-foreground">InBody</a>
            <a href="#coros" className="hover:text-foreground">COROS</a>
            <a href="#history" className="hover:text-foreground">History</a>
            <a href="#profile" className="hover:text-foreground">Profile</a>
          </nav>
          <button className="rounded-full bg-foreground px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-background md:px-4 md:text-xs">
            Quick Log
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl space-y-14 px-4 pb-28 pt-6 md:space-y-20 md:px-6 md:pb-24 md:pt-10">
        <section id="dashboard">
          <Dashboard />
        </section>

        <section id="food">
          <FoodLog />
        </section>

        <section id="inbody">
          <InBodyUpload />
        </section>

        <section id="coros">
          <CorosUpload />
        </section>

        <section id="history" className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">History</p>
              <h2 className="text-3xl font-semibold">Progress trail, fully explainable</h2>
            </div>
            <button className="rounded-full border border-foreground/20 px-4 py-2 text-sm font-semibold text-foreground hover:border-foreground">
              Export CSV
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="7-Day Fuel Score"
              value="82"
              unit="/ 100"
              trend="+6 vs last week"
              subtitle="Consistency and recovery alignment"
            />
            <MetricCard
              title="Avg Daily Energy Need"
              value="2,640"
              unit="kcal"
              trend="+120 from training load"
              subtitle="BMR + COROS + NEAT"
            />
            <MetricCard
              title="Logged Foods"
              value="128"
              unit="items"
              trend="94% AI-confirmed"
              subtitle="Text, voice, and photo"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card-glass">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">InBody</p>
                  <h3 className="text-lg font-semibold">Body composition history</h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Synced</span>
              </div>
              <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/60 px-4 py-3">
                  <span>Feb 9 - Lean mass 58.4 kg</span>
                  <span className="font-semibold text-foreground">Body fat 17.6%</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/60 px-4 py-3">
                  <span>Jan 28 - Lean mass 58.0 kg</span>
                  <span className="font-semibold text-foreground">Body fat 18.1%</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/60 px-4 py-3">
                  <span>Jan 12 - Lean mass 57.4 kg</span>
                  <span className="font-semibold text-foreground">Body fat 18.9%</span>
                </div>
              </div>
            </div>
            <div className="card-glass">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Training</p>
                  <h3 className="text-lg font-semibold">COROS workload trend</h3>
                </div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Auto-Parsed</span>
              </div>
              <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                <div className="rounded-2xl border border-white/40 bg-white/60 p-4">
                  <p className="font-semibold text-foreground">Feb 9 - Long Run 90 min</p>
                  <p>Active calories 820 - Avg HR 148 - Recovery: Strained</p>
                </div>
                <div className="rounded-2xl border border-white/40 bg-white/60 p-4">
                  <p className="font-semibold text-foreground">Feb 8 - Strength 55 min</p>
                  <p>Active calories 410 - Avg HR 126 - Recovery: Balanced</p>
                </div>
                <div className="rounded-2xl border border-white/40 bg-white/60 p-4">
                  <p className="font-semibold text-foreground">Feb 7 - Tempo Ride 64 min</p>
                  <p>Active calories 560 - Avg HR 152 - Recovery: Fit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="profile" className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Profile</p>
              <h2 className="text-3xl font-semibold">Your physiology is the source of truth</h2>
            </div>
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Edit Profile</button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card-glass">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Identity</p>
              <h3 className="mt-3 text-lg font-semibold">{user?.displayName || 'Guest'}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {user?.gender || 'Gender'} - {user?.goal || 'Goal not set'}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Height</p>
                  <p className="font-semibold">{user?.heightCm ? `${user.heightCm} cm` : '—'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Weight</p>
                  <p className="font-semibold">{user?.weightKg ? `${user.weightKg} kg` : '—'}</p>
                </div>
              </div>
            </div>
            <div className="card-glass">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Preferences</p>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/60 px-4 py-3">
                  <span>Units</span>
                  <span className="font-semibold text-foreground">Metric</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/60 px-4 py-3">
                  <span>Logging style</span>
                  <span className="font-semibold text-foreground">Camera-first</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/60 px-4 py-3">
                  <span>Notifications</span>
                  <span className="font-semibold text-foreground">Summary at 8 PM</span>
                </div>
              </div>
            </div>
            <div className="card-glass">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Security</p>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/60 px-4 py-3">
                  <span>Encryption</span>
                  <span className="font-semibold text-foreground">AES-256</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/60 px-4 py-3">
                  <span>Manual override</span>
                  <span className="font-semibold text-foreground">Always on</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/60 px-4 py-3">
                  <span>Last login</span>
                  <span className="font-semibold text-foreground">Feb 10, 2026</span>
                </div>
              </div>
            </div>
          </div>
          <ProfileEditor />
          <AuthPanel />
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/40 bg-background/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <a href="#dashboard" className="text-foreground">Home</a>
          <a href="#food">Food</a>
          <a href="#inbody">InBody</a>
          <a href="#coros">COROS</a>
          <a href="#profile">Profile</a>
        </div>
      </nav>
    </div>
  )
}

export default App
