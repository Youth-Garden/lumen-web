import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="default">Open Modal</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Vocabulary Folder</DialogTitle>
          <DialogDescription>
            Organize your new flashcards into a focused learning list.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input id="folder-name" placeholder="e.g. Business English 101" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="folder-desc">Description (Optional)</Label>
            <Input
              id="folder-desc"
              placeholder="Brief notes about this topic..."
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="default">Create Folder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger
        render={<Button variant="destructive">Delete Item</Button>}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently remove the
            flashcard from your personal deck.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose render={<Button variant="outline">Keep Card</Button>} />
          <Button variant="destructive">Yes, Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
