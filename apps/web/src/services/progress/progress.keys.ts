export const progressKeys = {
  all: ['progress'] as const,
  dashboard: () => [...progressKeys.all, 'dashboard'] as const,
  activities: () => [...progressKeys.all, 'activities'] as const,
  heatmap: (year?: number) =>
    year
      ? ([...progressKeys.all, 'heatmap', year] as const)
      : ([...progressKeys.all, 'heatmap'] as const),
};
