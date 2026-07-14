import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export const useGetToeicNotes = (testId?: string) => {
  return useQuery({
    queryKey: ['toeic', 'notes', testId],
    queryFn: () => toeicService.getNotes(testId).then((res) => res.data),
  });
};

export const useSaveToeicNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteData: {
      questionId: string;
      testId: string;
      content: string;
      category: string;
      tags: string[];
    }) => toeicService.saveNote(noteData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['toeic', 'notes', variables.testId] });
      queryClient.invalidateQueries({ queryKey: ['toeic', 'notes', undefined] });
    },
  });
};

export const useUpdateExplanation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      questionId: string;
      explanation: string;
      mediaUrls?: string[];
    }) =>
      toeicService.updateExplanation(variables.questionId, {
        explanation: variables.explanation,
        mediaUrls: variables.mediaUrls,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toeicKeys.all });
    },
  });
};

