import { useState } from 'react'
import ImageUploader from '@components/ImageUploader'
import MetricCard from '@components/MetricCard'
import { corosApi } from '@services/api'

const CorosUpload = () => {
  const [rawText, setRawText] = useState('Long Run 90 min, Active calories 820, Avg HR 148')
  const [parsed, setParsed] = useState<any>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleParse = async () => {
    setStatus(null)
    try {
      const response = await corosApi.upload({ rawText, imageUrl: imageUrl || undefined })
      setParsed(response.data.parsed)
      setStatus('Parsed, confirm to save')
    } catch {
      setStatus('Parse failed (login required)')
    }
  }

  const handleConfirm = async () => {
    if (!parsed) return
    setStatus(null)
    try {
      await corosApi.upload(parsed)
      setStatus('Saved to history')
    } catch {
      setStatus('Save failed (login required)')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">COROS Upload</p>
          <h2 className="text-3xl font-semibold">Training expenditure, parsed straight from screenshots</h2>
        </div>
        <button className="rounded-full border border-foreground/30 px-4 py-2 text-sm font-semibold text-foreground">
          Sync Device
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <ImageUploader
          title="Upload COROS Screenshot"
          helper="We extract active calories, training load, and recovery status."
          accept="PNG · JPG"
          cta="Upload Screenshot"
          chips={['OCR + AI parse', 'Confidence scoring', 'One-tap confirm']}
          onFileSelected={(dataUrl) => setImageUrl(dataUrl)}
        />
        <div className="card-glass space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Parsed Session</p>
              <h3 className="mt-2 text-lg font-semibold">Long Run · 90 min</h3>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">High Confidence</span>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>Active Calories</span>
              <span className="font-semibold text-foreground">{parsed?.activeCalories ?? 820} kcal</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>Training Load</span>
              <span className="font-semibold text-foreground">{parsed?.trainingLoad ?? 152}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>Average HR</span>
              <span className="font-semibold text-foreground">{parsed?.avgHr ?? 148} bpm</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>Max HR</span>
              <span className="font-semibold text-foreground">{parsed?.maxHr ?? 176} bpm</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>Recovery Status</span>
              <span className="font-semibold text-foreground">{parsed?.recoveryStatus ?? 'Strained'}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em]">
            <button className="rounded-full bg-primary px-4 py-2 text-white" onClick={handleConfirm}>
              Save Session
            </button>
            <button className="rounded-full border border-foreground/30 px-4 py-2 text-foreground">Edit Fields</button>
          </div>
        </div>
      </div>
      <div className="card-glass space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">AI OCR Stub</p>
        <textarea
          className="min-h-[110px] w-full rounded-2xl border border-white/60 bg-white/80 p-4 text-sm"
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
        />
        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em]">
          <button className="rounded-full bg-foreground px-4 py-2 text-background" onClick={handleParse}>
            Parse Text
          </button>
          <button className="rounded-full border border-foreground/30 px-4 py-2 text-foreground" onClick={handleConfirm}>
            Confirm & Save
          </button>
        </div>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Weekly Active Calories" value="4,980" unit="kcal" subtitle="COROS + sessions" />
        <MetricCard title="Training Load" value="612" unit="points" subtitle="Last 7 days" />
        <MetricCard title="Recovery Trend" value="Balanced" subtitle="2 strained days" />
      </div>
    </div>
  )
}

export default CorosUpload
