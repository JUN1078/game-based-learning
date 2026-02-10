import { useState } from 'react'
import FoodInput from '@components/FoodInput'
import ImageUploader from '@components/ImageUploader'
import { foodApi } from '@services/api'

type ParsedItem = {
  foodName: string
  portion?: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  confidenceScore?: number
}

const FoodLog = () => {
  const [rawText, setRawText] = useState('Salmon poke bowl, matcha latte, gel pack')
  const [parsed, setParsed] = useState<ParsedItem[] | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleParse = async () => {
    setStatus(null)
    try {
      const response = await foodApi.log({ rawText, imageUrl: imageUrl || undefined })
      setParsed(response.data.parsed || null)
      setStatus('Parsed, confirm to save')
    } catch {
      setStatus('Parse failed (login required)')
    }
  }

  const handleConfirm = async () => {
    if (!parsed) return
    setStatus(null)
    try {
      await foodApi.log({ items: parsed })
      setStatus('Saved to history')
    } catch {
      setStatus('Save failed (login required)')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Food Log</p>
          <h2 className="text-3xl font-semibold">AI parses the plate, you approve the truth</h2>
        </div>
        <button className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-background">
          New Log
        </button>
      </div>
      <ImageUploader
        title="Food Photo"
        helper="Snap the plate and let AI estimate macros."
        accept="JPG · PNG"
        cta="Upload Meal"
        chips={['Camera-first', 'Confidence scoring']}
        onFileSelected={(dataUrl) => setImageUrl(dataUrl)}
      />
      <div className="card-glass space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">AI Text Parse</p>
        <textarea
          className="min-h-[120px] w-full rounded-2xl border border-white/60 bg-white/80 p-4 text-sm"
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
        />
        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em]">
          <button className="rounded-full bg-foreground px-4 py-2 text-background" onClick={handleParse}>
            Parse Text
          </button>
          <button
            className="rounded-full border border-foreground/30 px-4 py-2 text-foreground"
            onClick={handleConfirm}
            disabled={!parsed}
          >
            Confirm & Save
          </button>
        </div>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        {parsed ? (
          <div className="grid gap-3 text-sm text-muted-foreground">
            {parsed.map((item) => (
              <div key={item.foodName} className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
                <div>
                  <p className="font-semibold text-foreground">{item.foodName}</p>
                  <p className="text-xs text-muted-foreground">{item.portion || '1 serving'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{item.calories} kcal</p>
                  <p className="text-xs text-muted-foreground">
                    P {item.protein ?? 0}g · C {item.carbs ?? 0}g · F {item.fat ?? 0}g
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <FoodInput />
    </div>
  )
}

export default FoodLog
