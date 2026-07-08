import { useQuery } from '@tanstack/react-query';
import { toeicKeys, toeicService } from '@/services/toeic';

export const useGetToeicTests = () => {
  return useQuery({
    queryKey: toeicKeys.lists(),
    queryFn: () => toeicService.getTests().then((res) => res.data),
  });
};

export const useGetToeicTestById = (id: string) => {
  return useQuery({
    queryKey: toeicKeys.detail(id),
    queryFn: () => toeicService.getTestById(id).then((res) => res.data),
    enabled: !!id,
  });
};
