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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lumen/uikit/components';
import { Loader2 } from 'lucide-react';
import { useVocabularyDecksQuery } from '@/features/vocabulary/hooks/queries';
import { useCreateFlashcardMutation } from '@/features/vocabulary/hooks/mutations';
import { PortalProps } from '@lumen/uikit/portal';

const formSchema = z.object({
  deckId: z.string().min(1, { message: 'Please select a deck.' }),
});

type FormValues = z.infer<typeof formSchema>;

export interface AddFlashcardDialogProps extends PortalProps {
  wordId: string;
  term: string;
}

export function AddFlashcardDialog({ isOpen, onDismiss, data }: PortalProps<AddFlashcardDialogProps>) {
  const { wordId, term } = data || { wordId: '', term: '' };
  const t = useTranslations('Vocabulary.List');
  
  const { data: decksData, isLoading: isLoadingDecks } = useVocabularyDecksQuery();
  const { mutateAsync: createFlashcard, isPending } = useCreateFlashcardMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deckId: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createFlashcard({
        deckId: data.deckId,
        wordId,
      });
      toast.success(t('addDeckSuccess', { term, fallback: 'Added to deck successfully!' }));
      onDismiss?.();
      form.reset();
    } catch (error) {
      toast.error(t('addError', { fallback: 'Failed to add to deck.' }));
    }
  };

  const decks = decksData?.data || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('addToDeck')}</DialogTitle>
          <DialogDescription>
            {t('addToDeckDescription', { fallback: 'Select a deck to add the word to.' })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-lg font-medium text-center mb-6">&quot;{term}&quot;</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="deckId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('selectDeck', { fallback: 'Select Deck' })}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('selectDeckPlaceholder', { fallback: 'Select a deck...' })} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingDecks ? (
                          <div className="p-2 text-sm text-muted-foreground">{t('loadingDecks', { fallback: 'Loading decks...' })}</div>
                        ) : decks.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">{t('noDecksAvailable', { fallback: 'No decks available.' })}</div>
                        ) : (
                          decks.map((deck) => (
                            <SelectItem key={deck.id} value={deck.id}>
                              {deck.name}
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
                  {t('cancel', { fallback: 'Cancel' })}
                </Button>
                <Button type="submit" disabled={isPending || decks.length === 0}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('add', { fallback: 'Add' })}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
