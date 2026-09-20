'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useCreateFolder } from '@/features/vocabulary/hooks';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
      toast.error(t('createError'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('createFolder')}</DialogTitle>
          <DialogDescription>{t('createFolderDescription')}</DialogDescription>
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
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Icons
                    name="loader-2"
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                )}
                {t('saveFolder')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
