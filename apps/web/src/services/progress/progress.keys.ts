export const progressKeys = {
  all: ['progress'] as const,
  dashboard: () => [...progressKeys.all, 'dashboard'] as const,
  activities: () => [...progressKeys.all, 'activities'] as const,
};
