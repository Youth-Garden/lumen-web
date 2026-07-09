export const idResponseMapper = (raw: any): { id: string } => ({
  id: raw?.id || '',
});
