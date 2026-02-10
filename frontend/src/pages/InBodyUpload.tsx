import { useState } from 'react'
import ImageUploader from '@components/ImageUploader'
import MetricCard from '@components/MetricCard'
import { inBodyApi } from '@services/api'

const InBodyUpload = () => {
  const [rawText, setRawText] = useState('Weight 64.2kg, PBF 17.6%, BMR 1540')
  const [parsed, setParsed] = useState<any>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleParse = async () => {
    setStatus(null)
    try {
      const response = await inBodyApi.upload({ rawText, imageUrl: imageUrl || undefined })
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
      await inBodyApi.upload(parsed)
      setStatus('Saved to history')
    } catch {
      setStatus('Save failed (login required)')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">InBody Upload</p>
          <h2 className="text-3xl font-semibold">OCR + AI validation for real body composition</h2>
        </div>
        <button className="rounded-full border border-foreground/30 px-4 py-2 text-sm font-semibold text-foreground">
          View History
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <ImageUploader
          title="Upload InBody Scan"
          helper="JPG, PNG, or PDF supported. AI highlights uncertain fields."
          accept="JPG · PNG · PDF"
          cta="Upload File"
          chips={['OCR in 3s', 'Manual override', 'Encrypted storage']}
          onFileSelected={(dataUrl) => setImageUrl(dataUrl)}
        />
        <div className="card-glass space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Parsed Values</p>
              <h3 className="mt-2 text-lg font-semibold">Confirm before saving</h3>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Needs Review</span>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>Weight</span>
              <span className="font-semibold text-foreground">{parsed?.weight ?? 64.2} kg</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>Skeletal Muscle Mass</span>
              <span className="font-semibold text-foreground">{parsed?.skeletalMuscleMass ?? 29.4} kg</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>Body Fat Percentage</span>
              <span className="font-semibold text-foreground">{parsed?.bodyFatPercent ?? 17.6}%</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>BMR</span>
              <span className="font-semibold text-foreground">{parsed?.bmr ?? 1540} kcal</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <span>ECW Ratio</span>
              <span className="font-semibold text-foreground">{parsed?.ecwRatio ?? 0.385}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em]">
            <button className="rounded-full bg-primary px-4 py-2 text-white" onClick={handleConfirm}>
              Save Report
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
        <MetricCard title="Lean Mass" value="58.4" unit="kg" subtitle="Fat-free mass" />
        <MetricCard title="Visceral Fat" value="7" unit="level" subtitle="Healthy range" />
        <MetricCard title="Total Body Water" value="38.2" unit="L" subtitle="Hydration status" />
      </div>
    </div>
  )
}

export default InBodyUpload
