import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useQuiz, useCreateQuiz, useUpdateQuiz } from '../hooks/use-quizzes';

const quizSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  isPublished: z.boolean().default(false),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export default function QuizzesForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const { data: quiz, isLoading } = useQuiz(id as string);
  const createQuiz = useCreateQuiz();
  const updateQuiz = useUpdateQuiz();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      isPublished: false,
    },
  });

  useEffect(() => {
    if (quiz) {
      form.reset({
        title: quiz.title,
        description: quiz.description,
        isPublished: quiz.isPublished,
      });
    }
  }, [quiz, form]);

  const onSubmit = async (values: QuizFormValues) => {
    if (isEditing) {
      await updateQuiz.mutateAsync({ id: id as string, data: values });
    } else {
      await createQuiz.mutateAsync(values);
    }
    navigate('/quizzes');
  };

  if (isEditing && isLoading) {
    return <div className="flex justify-center p-8"><Icons name="loader-2" className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/quizzes')} className="p-2 h-8 w-8">
            <Icons name="arrow-left" className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">{isEditing ? 'Edit' : 'Create'} Quiz</h2>
        </div>
        <Button type="submit" disabled={createQuiz.isPending || updateQuiz.isPending}>
          {(createQuiz.isPending || updateQuiz.isPending) && (
            <Icons name="loader-2" className="mr-2 h-4 w-4 animate-spin" />
          )}
          <Icons name="save" className="mr-2 h-4 w-4" /> Save
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...form.register('title')} placeholder="Enter quiz title" />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...form.register('description')} placeholder="Enter quiz description" rows={4} />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="isPublished" 
              {...form.register('isPublished')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isPublished" className="font-normal">Published (visible to users)</Label>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Questions</span>
              <Button type="button" variant="outline" size="sm">
                <Icons name="plus" className="h-4 w-4 mr-2" /> Add Question
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
              Question management functionality will be integrated in the next phase.
            </p>
          </CardContent>
        </Card>
      )}
    </form>
  );
}