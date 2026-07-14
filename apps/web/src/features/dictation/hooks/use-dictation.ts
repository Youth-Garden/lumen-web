import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialService } from '@/services/material/material.service';
import type { DictationSubmissionDto } from '@/services/material';
import { materialKeys } from '@/services/material/material.keys';

export function useDictationMaterials() {
  return useQuery({
    queryKey: materialKeys.list({ type: 'AUDIO' }),
    queryFn: () => materialService.getMaterials({ type: 'AUDIO' }),
  });
}

export function useDictationMaterial(materialId: string) {
  return useQuery({
    queryKey: materialKeys.detail(materialId),
    queryFn: () => materialService.getMaterialById(materialId),
  });
}

export function useSubmitDictation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DictationSubmissionDto) =>
      materialService.submitDictation(data),
    onSuccess: (_, variables) => {
      // Invalidate the detail query to potentially refresh any state if needed
      queryClient.invalidateQueries({
        queryKey: materialKeys.detail(variables.materialId),
      });
    },
  });
}
