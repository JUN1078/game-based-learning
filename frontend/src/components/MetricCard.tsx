type MetricCardProps = {
  title: string
  value: string
  unit?: string
  subtitle?: string
  trend?: string
}

const MetricCard = ({ title, value, unit, subtitle, trend }: MetricCardProps) => {
  return (
    <div className="card-glass">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{title}</p>
      <div className="mt-4 flex items-end gap-2">
        <h3 className="text-3xl font-semibold">{value}</h3>
        {unit ? <span className="text-sm text-muted-foreground">{unit}</span> : null}
      </div>
      {trend ? <p className="mt-2 text-sm font-medium text-foreground/80">{trend}</p> : null}
      {subtitle ? <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  )
}

export default MetricCard
