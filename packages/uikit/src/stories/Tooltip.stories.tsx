import type { Meta, StoryObj } from '@storybook/react';
import {
  IconButton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components';
import { Icons } from '../icons';

const meta = {
  title: 'Feedback/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
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
          <TooltipTrigger
            render={
              <IconButton variant="outline">
                <Icons name="volume-2" className="w-4 h-4" />
              </IconButton>
            }
          />
          <TooltipContent side="top">Listen pronunciation (US)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <IconButton variant="secondary">
                <Icons name="bookmark" className="w-4 h-4" />
              </IconButton>
            }
          />
          <TooltipContent side="bottom">Save to quick review</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};
