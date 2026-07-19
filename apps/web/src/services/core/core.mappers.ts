export const idResponseMapper = (
  raw: Record<string, unknown>,
): { id: string } => ({
  id: String(raw?.id ?? ''),
});

export const voidResponseMapper = (): void => undefined;
