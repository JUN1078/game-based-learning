type MacroRingProps = {
  protein: number
  carbs: number
  fat: number
}

const MacroRing = ({ protein, carbs, fat }: MacroRingProps) => {
  const total = protein + carbs + fat
  const proteinPct = total === 0 ? 0 : Math.round((protein / total) * 100)
  const carbsPct = total === 0 ? 0 : Math.round((carbs / total) * 100)
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct)
  const ringStyle = {
    background: `conic-gradient(var(--macro-protein) 0 ${proteinPct}%, var(--macro-carbs) ${proteinPct}% ${proteinPct + carbsPct}%, var(--macro-fat) ${proteinPct + carbsPct}% 100%)`,
  }

  return (
    <div className="macro-ring-wrap">
      <div className="macro-ring" style={ringStyle}>
        <div className="macro-ring-inner">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Macros</p>
          <p className="text-2xl font-semibold">{total}g</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
        <div className="flex flex-col gap-2 rounded-xl border border-white/40 bg-white/60 p-3">
          <span className="macro-dot bg-[var(--macro-protein)]" />
          <span className="font-semibold text-foreground">{protein}g</span>
          <span>Protein</span>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-white/40 bg-white/60 p-3">
          <span className="macro-dot bg-[var(--macro-carbs)]" />
          <span className="font-semibold text-foreground">{carbs}g</span>
          <span>Carbs</span>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-white/40 bg-white/60 p-3">
          <span className="macro-dot bg-[var(--macro-fat)]" />
          <span className="font-semibold text-foreground">{fat}g</span>
          <span>Fat</span>
        </div>
      </div>
    </div>
  )
}

export default MacroRing
