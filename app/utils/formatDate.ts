// Buat utility
export const formatDate = (value: string | Date) => {
  const date = new Date(value)

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}