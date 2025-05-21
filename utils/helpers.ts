export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('fr-FR');