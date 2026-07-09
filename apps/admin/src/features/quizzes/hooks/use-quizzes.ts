import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizzesService } from '../services/quizzes.service';
import { CreatePresetQuizDto, UpdatePresetQuizDto } from '../types';
import { toast } from 'sonner';

export const useQuizzes = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['admin-quizzes', page, limit],
    queryFn: () => quizzesService.getQuizzes(page, limit),
  });
};

export const useQuiz = (id: string) => {
  return useQuery({
    queryKey: ['admin-quizzes', id],
    queryFn: () => quizzesService.getQuizById(id),
    enabled: !!id,
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePresetQuizDto) => quizzesService.createQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      toast.success('Quiz created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create quiz');
    },
  });
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePresetQuizDto }) => 
      quizzesService.updateQuiz(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes', variables.id] });
      toast.success('Quiz updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update quiz');
    },
  });
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => quizzesService.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      toast.success('Quiz deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete quiz');
    },
  });
};
