import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { materialsService, materialKeys } from '@/services/materials';
import type {
  CreateMaterialPayload,
  UpdateMaterialPayload,
} from '@/services/materials';

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMaterialPayload) =>
      materialsService.createMaterial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMaterialPayload;
    }) => materialsService.updateMaterial(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(id) });
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => materialsService.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
    },
  });
};

export const usePublishMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => materialsService.publishMaterial(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(id) });
    },
  });
};

export const useMaterials = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) => {
  return useQuery({
    queryKey: materialKeys.list(params),
    queryFn: () => materialsService.listMaterials(params),
  });
};

export const useMaterialDetail = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: materialKeys.detail(id),
    queryFn: () => materialsService.getMaterialById(id),
    enabled: options?.enabled ?? Boolean(id),
  });
};
