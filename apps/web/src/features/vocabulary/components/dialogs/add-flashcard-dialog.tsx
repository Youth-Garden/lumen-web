'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useVocabularyFolders, useCreateFlashcard } from '@/features/vocabulary/hooks';
import { PortalProps } from '@lumen/uikit/portal';

const formSchema = z.object({
  folderId: z.string().min(1, { message: 'Please select a folder.' }),
});

type FormValues = z.infer<typeof formSchema>;

export interface AddFlashcardDialogProps extends PortalProps {
  wordId: string;
  term: string;
}

export function AddFlashcardDialog({
  isOpen,
  onDismiss,
  data,
}: PortalProps<AddFlashcardDialogProps>) {
  const { wordId, term } = data || { wordId: '', term: '' };
  const t = useTranslations('Vocabulary.List');

  const { data: foldersData, isLoading: isLoadingFolders } = useVocabularyFolders();
  const { mutateAsync: createFlashcard, isPending } = useCreateFlashcard();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      folderId: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createFlashcard({
        folderId: data.folderId,
        wordId,
      });
      toast.success(t('addFolderSuccess', { term }));
      onDismiss?.();
      form.reset();
    } catch (error) {
      toast.error(t('addError'));
    }
  };

  const folders = foldersData?.data || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('addToFolder')}</DialogTitle>
          <DialogDescription>{t('addToFolderDescription')}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-lg font-medium text-center mb-6">
            &quot;{term}&quot;
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="folderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('selectFolder')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t('selectFolderPlaceholder')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingFolders ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            {t('loadingFolders')}
                          </div>
                        ) : folders.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            {t('noFoldersAvailable')}
                          </div>
                        ) : (
                          folders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4 space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onDismiss?.()}
                  disabled={isPending}
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || folders.length === 0}
                >
                  {isPending && (
                    <Icons
                      name="loader-2"
                      className="mr-2 h-4 w-4 animate-spin"
                    />
                  )}
                  {t('add')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
