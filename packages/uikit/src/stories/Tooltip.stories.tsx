import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../components/ui/tooltip';
import { Button } from '../components/ui/button';
import { Icons } from '../icons';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon"><Icons name="volume-2" className="w-4 h-4" /></Button>} />
          <TooltipContent side="top">Listen pronunciation (US)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="secondary" size="icon"><Icons name="bookmark" className="w-4 h-4" /></Button>} />
          <TooltipContent side="bottom">Save to quick review</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};
