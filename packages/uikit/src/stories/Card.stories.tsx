import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Icons } from '../icons';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[380px] p-6">
      <CardHeader className="p-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Vocabulary Folder</CardTitle>
          <Icons name="folder" className="w-5 h-5 text-primary" />
        </div>
        <CardDescription className="text-xs">
          Daily active words and spaced repetition queue.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 py-3 text-sm text-foreground/80 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Total Words:</span>
          <span className="font-semibold text-foreground">120 terms</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Due for review:</span>
          <span className="font-semibold text-primary">15 words</span>
        </div>
      </CardContent>
      <CardFooter className="p-0 pt-3 flex gap-2 justify-end">
        <Button variant="outline" size="sm">
          Details
        </Button>
        <Button variant="default" size="sm">
          Study Now
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const MutedVariant: Story = {
  render: () => (
    <Card variant="muted" className="w-[380px] p-6 border-dashed">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm font-semibold">Muted Background Card</CardTitle>
        <CardDescription className="text-xs">
          Useful for sub-containers, empty slots, or secondary widgets.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-2 text-xs text-muted-foreground">
        Card variant with muted surface.
      </CardContent>
    </Card>
  ),
};
