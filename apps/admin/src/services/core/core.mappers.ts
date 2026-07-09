export const idResponseMapper = (raw: any): { id: string } => ({
  id: raw?.id ? String(raw.id) : '',
});
