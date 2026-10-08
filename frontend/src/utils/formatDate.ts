export function formatDate(date: string): string {
  if (!date) {
    return 'Date unavailable';
  }

  const [year, month, day] = date.split('-').map(Number);

  const formattedDate = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(formattedDate);
}