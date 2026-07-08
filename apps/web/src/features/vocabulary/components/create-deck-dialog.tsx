'use client';

import { useState } from 'react';
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
  Input,
} from '@lumen/uikit/components';
import { Plus, Loader2 } from 'lucide-react';
import { useCreateDeckMutation } from '@/features/vocabulary/hooks/mutations';
import { PortalProps } from '@lumen/uikit/portal';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateDeckDialog({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('Vocabulary.Decks');
  const { mutateAsync: createDeck, isPending } = useCreateDeckMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createDeck({
        name: data.name,
        description: data.description,
      });
      toast.success(t('createSuccess', { fallback: 'Deck created successfully!' }));
      onDismiss?.();
      form.reset();
    } catch (error) {
      toast.error(t('createError', { fallback: 'Failed to create deck.' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('createDeck')}</DialogTitle>
          <DialogDescription>
            {t('createDeckDescription', { fallback: 'Create a new deck to organize your flashcards.' })}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('deckName', { fallback: 'Deck Name' })}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('deckNamePlaceholder', { fallback: 'e.g. IELTS Vocabulary' })} {...field} />
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
                  <FormLabel>{t('deckDescription', { fallback: 'Description (Optional)' })}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('deckDescriptionPlaceholder', { fallback: 'What is this deck about?' })} {...field} />
                  </FormControl>
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
                {t('cancel', { fallback: 'Cancel' })}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('save', { fallback: 'Save' })}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
