export function formatCurrency(value: string | number | null | undefined) {
  const number = Number(value ?? 0);

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number.isFinite(number) ? number : 0);
}

export function formatNumber(
  value: string | number | null | undefined,
  maximumFractionDigits = 2,
) {
  const number = Number(value ?? 0);

  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits,
  }).format(Number.isFinite(number) ? number : 0);
}

export function formatDuration(value: string | number | null | undefined) {
  const minutes = Math.max(0, Math.round(Number(value ?? 0)));

  if (!Number.isFinite(minutes)) {
    return '—';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  return `${hours} h ${remainingMinutes} min`;
}

export function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data indisponível';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}
