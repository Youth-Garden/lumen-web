'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import * as z from 'zod';

import { useCreateFolder } from '@/features/vocabulary/hooks';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useZodForm,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PortalProps } from '@lumen/uikit/portal';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateFolderDialog({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('Vocabulary.Folders');
  const { mutateAsync: createFolder, isPending } = useCreateFolder();

  const form = useZodForm<FormValues>(formSchema, {
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createFolder({
        name: data.name,
        description: data.description,
      });
      toast.success(t('createSuccess'));
      onDismiss?.();
      form.reset();
    } catch {
      // API error toast is handled globally by CoreService
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader align="center">
          <DialogTitle>{t('createFolder')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('folderName')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('folderNamePlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('folderDescription')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('folderDescriptionPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" loading={isPending}>
                {t('saveFolder')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
