import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Card } from '../components/ui/card';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <Tabs defaultValue="all">
        <TabsList className="w-full">
          <TabsTrigger value="all">All Words</TabsTrigger>
          <TabsTrigger value="due">Due Review</TabsTrigger>
          <TabsTrigger value="mastered">Mastered</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="all">
            <Card className="p-4 text-sm text-muted-foreground">
              Displaying all 120 vocabulary items in this deck.
            </Card>
          </TabsContent>
          <TabsContent value="due">
            <Card className="p-4 text-sm text-muted-foreground">
              You have 15 cards scheduled for spaced repetition review today.
            </Card>
          </TabsContent>
          <TabsContent value="mastered">
            <Card className="p-4 text-sm text-muted-foreground">
              45 words have reached Stage 5 (Bloom Mastered).
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  ),
};

export const LineVariant: Story = {
  render: () => (
    <div className="w-[420px]">
      <Tabs defaultValue="overview">
        <TabsList variant="line" className="w-full justify-start border-b border-border/40">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="overview">
            <p className="text-sm text-muted-foreground">General deck performance overview.</p>
          </TabsContent>
          <TabsContent value="analytics">
            <p className="text-sm text-muted-foreground">Retention curve and daily streak charts.</p>
          </TabsContent>
          <TabsContent value="settings">
            <p className="text-sm text-muted-foreground">Spaced repetition interval settings.</p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  ),
};
