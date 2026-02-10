import type { ChangeEvent } from 'react'

type ImageUploaderProps = {
  title: string
  helper: string
  accept: string
  cta: string
  chips?: string[]
  onFileSelected?: (dataUrl: string) => void
}

const ImageUploader = ({ title, helper, accept, cta, chips, onFileSelected }: ImageUploaderProps) => {
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !onFileSelected) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onFileSelected(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="card-glass space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
        </div>
        <span className="rounded-full border border-foreground/20 px-3 py-1 text-xs font-semibold text-foreground">{accept}</span>
      </div>
      <div className="rounded-3xl border border-dashed border-foreground/30 bg-white/60 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
          +
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Drag, drop, or capture instantly</p>
        <label className="mt-4 inline-flex cursor-pointer rounded-full bg-foreground px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-background">
          {cta}
          <input className="hidden" type="file" accept="image/*,.pdf" onChange={handleFile} />
        </label>
      </div>
      {chips && chips.length ? (
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {chips.map((chip) => (
            <span key={chip} className="rounded-full border border-white/40 bg-white/60 px-3 py-1">
              {chip}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default ImageUploader
