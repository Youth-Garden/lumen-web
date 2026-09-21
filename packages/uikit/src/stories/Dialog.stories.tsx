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

export const ExitConfirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger
        render={<Button variant="outline">Exit Study Session</Button>}
      />
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Pause study session?</DialogTitle>
          <DialogDescription>
            Your learned word progress will be saved. You can continue anytime.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-end gap-3 pt-4">
          <DialogClose
            render={<Button variant="secondary">Continue Studying</Button>}
          />
          <Button variant="default">Save & Exit</Button>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const Fullscreen: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger
        render={<Button variant="default">Open Fullscreen View</Button>}
      />
      <DialogContent variant="fullscreen">
        <DialogTitle className="sr-only">Fullscreen Study View</DialogTitle>
        <DialogDescription className="sr-only">
          Interactive full-screen learning session.
        </DialogDescription>
        <div className="flex flex-col h-full justify-between p-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold">Fullscreen Session</h2>
            <DialogClose render={<Button variant="ghost">Close</Button>} />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-lg">
              Fullscreen immersive content area.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ),
};
