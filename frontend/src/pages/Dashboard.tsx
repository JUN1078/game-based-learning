import { useEffect, useState } from 'react'
import MetricCard from '@components/MetricCard'
import MacroRing from '@components/MacroRing'
import { energyApi } from '@services/api'

type DailyData = {
  bmr: number
  activeCalories: number
  neatAdjustment: number
  recoveryModifier: number
  dailyEnergyNeed: number
  caloriesEaten: number
  macros: {
    protein: number
    fat: number
    carbs: number
  }
  coaching?: {
    summary: string
    warning?: string | null
  }
}

const Dashboard = () => {
  const [daily, setDaily] = useState<DailyData>({
    bmr: 1540,
    activeCalories: 820,
    neatAdjustment: 240,
    recoveryModifier: -80,
    dailyEnergyNeed: 2520,
    caloriesEaten: 1840,
    macros: { protein: 120, fat: 58, carbs: 318 },
  })
  const [status, setStatus] = useState('Using sample data')

  useEffect(() => {
    const load = async () => {
      try {
        const response = await energyApi.getDaily()
        setDaily(response.data)
        setStatus('Live data')
      } catch {
        setStatus('Using sample data (login required)')
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-white/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">
            EnergyOS Live
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
          <h2 className="text-2xl font-semibold leading-tight md:text-4xl">
            Today’s energy plan, built from your body, training, and meals.
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Every number is traceable to InBody, COROS, or your logs.
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] md:text-xs">
            <button className="rounded-full bg-primary px-4 py-2 text-white">Log Fuel</button>
            <button className="rounded-full border border-foreground/30 px-4 py-2 text-foreground">Upload InBody</button>
            <button className="rounded-full border border-foreground/30 px-4 py-2 text-foreground">Sync COROS</button>
          </div>
        </div>
        <div className="card-glass space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Today</p>
              <h3 className="mt-2 text-xl font-semibold">Energy Summary</h3>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">AI Verified</span>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>BMR from InBody</span>
              <span className="font-semibold text-foreground">{daily.bmr.toLocaleString()} kcal</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>COROS active calories</span>
              <span className="font-semibold text-foreground">{daily.activeCalories.toLocaleString()} kcal</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>NEAT adjustment</span>
              <span className="font-semibold text-foreground">
                {daily.neatAdjustment >= 0 ? '+' : ''}{daily.neatAdjustment} kcal
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>Recovery modifier</span>
              <span className="font-semibold text-foreground">
                {daily.recoveryModifier >= 0 ? '+' : ''}{daily.recoveryModifier} kcal
              </span>
            </div>
          </div>
          <div className="rounded-2xl bg-foreground px-5 py-4 text-background">
            <p className="text-xs uppercase tracking-[0.3em] text-background/70">Daily energy need</p>
            <div className="mt-2 flex items-end gap-3">
              <p className="text-3xl font-semibold">{daily.dailyEnergyNeed.toLocaleString()}</p>
              <span className="text-sm text-background/70">kcal</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/40 bg-white/70 px-5 py-4 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">AI Coach</p>
            <p className="mt-2 text-foreground">
              {status === 'Live data'
                ? daily.coaching?.summary ||
                  `Energy needs updated. You are ${daily.caloriesEaten} kcal in — aim for ${daily.dailyEnergyNeed - daily.caloriesEaten} kcal more.`
                : 'Increase carbs by 30g tonight to hit the long-run recovery target. Protein is on track.'}
            </p>
            {status === 'Live data' && daily.coaching?.warning ? (
              <p className="mt-2 text-xs text-amber-600">{daily.coaching.warning}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Calories Needed"
          value={daily.dailyEnergyNeed.toLocaleString()}
          unit="kcal"
          trend="Explained by InBody + COROS"
          subtitle={status}
        />
        <MetricCard
          title="Calories Eaten"
          value={daily.caloriesEaten.toLocaleString()}
          unit="kcal"
          trend={`${Math.min(100, Math.round((daily.caloriesEaten / daily.dailyEnergyNeed) * 100))}% of target`}
          subtitle="3 logs today"
        />
        <MetricCard
          title="Fuel Score"
          value="86"
          unit="/ 100"
          trend="Recovery trending up"
          subtitle="Based on sleep + training load"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-glass">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Macro Targets</p>
              <h3 className="mt-2 text-lg font-semibold">Built from lean mass + goal</h3>
            </div>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">Editable</span>
          </div>
          <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>Protein (1.9 g/kg LBM)</span>
              <span className="font-semibold text-foreground">{daily.macros.protein} g</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>Fat (0.9 g/kg BW)</span>
              <span className="font-semibold text-foreground">{daily.macros.fat} g</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>Carbs (remaining)</span>
              <span className="font-semibold text-foreground">{daily.macros.carbs} g</span>
            </div>
          </div>
        </div>
        <MacroRing protein={daily.macros.protein} carbs={daily.macros.carbs} fat={daily.macros.fat} />
      </div>
    </div>
  )
}

export default Dashboard
