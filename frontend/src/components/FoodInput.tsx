const FoodInput = () => {
  return (
    <div className="card-glass space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Food Logging</p>
          <h3 className="mt-2 text-lg font-semibold">Camera-first, voice-ready, text fallback</h3>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
          <button className="rounded-full bg-foreground px-4 py-2 text-background">Photo</button>
          <button className="rounded-full border border-foreground/30 px-4 py-2 text-foreground">Voice</button>
          <button className="rounded-full border border-foreground/30 px-4 py-2 text-foreground">Text</button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/40 bg-white/60 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">AI Parse Preview</p>
          <div className="mt-4 space-y-3">
            {[
              { name: 'Salmon poke bowl', portion: '1 bowl', calories: '520 kcal', macros: 'P 38g · C 62g · F 14g' },
              { name: 'Iced matcha latte', portion: '16 oz', calories: '180 kcal', macros: 'P 6g · C 22g · F 7g' },
              { name: 'Energy gel', portion: '1 pack', calories: '110 kcal', macros: 'P 0g · C 28g · F 0g' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.portion}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{item.calories}</p>
                  <p className="text-xs text-muted-foreground">{item.macros}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em]">
            <button className="rounded-full bg-primary px-4 py-2 text-white">Confirm</button>
            <button className="rounded-full border border-foreground/30 px-4 py-2 text-foreground">Edit Items</button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-dashed border-foreground/30 bg-white/60 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Quick Capture</p>
            <p className="mt-3 text-sm text-muted-foreground">Snap the plate and let AI estimate macros with confidence scores.</p>
            <button className="mt-5 w-full rounded-2xl bg-foreground px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-background">
              Open Camera
            </button>
          </div>
          <div className="rounded-3xl border border-white/40 bg-white/60 p-5 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Confidence</p>
            <div className="mt-3 flex items-center justify-between">
              <span>Average confidence</span>
              <span className="font-semibold text-foreground">92%</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white">
              <div className="h-full w-4/5 rounded-full bg-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodInput
