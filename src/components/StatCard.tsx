interface Props {
  label: string;
  value: string;
  description?: string;
}

export default function StatCard({ label, value, description }: Props) {
  return (
    <article className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {description && <span className="stat-description">{description}</span>}
    </article>
  );
}
