import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/ui/button';
import { Icons } from '../icons';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'outline',
        'secondary',
        'ghost',
        'destructive',
        'text',
      ],
    },
    size: {
      control: 'select',
      options: [
        'default',
        'xs',
        'sm',
        'lg',
        'icon',
        'icon-xs',
        'icon-sm',
        'icon-lg',
      ],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllButtons: Story = {
  name: 'All Buttons (Overview)',
  render: () => {
    return (
      <div className="space-y-6 max-w-2xl py-2">
        {/* Variants */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Variants
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="default">Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="text">Text</Button>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Sizes
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button size="xs" variant="default">
              Size XS
            </Button>
            <Button size="sm" variant="default">
              Size SM
            </Button>
            <Button size="default" variant="default">
              Size Default
            </Button>
            <Button size="lg" variant="default">
              Size LG
            </Button>
          </div>
        </div>

        {/* With Icons */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            With Icons
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="default">
              <Icons name="sparkles" className="w-4 h-4" />
              <span>Left Icon</span>
            </Button>
            <Button variant="outline">
              <span>Right Icon</span>
              <Icons name="chevron-right" className="w-4 h-4" />
            </Button>
            <Button variant="secondary">
              <Icons name="play" className="w-4 h-4 fill-current" />
              <span>Continue</span>
            </Button>
            <Button variant="destructive">
              <Icons name="trash-2" className="w-4 h-4" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Icon Only Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Icon Only (Sizes)
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button size="icon-xs" variant="outline" title="icon-xs">
              <Icons name="plus" className="w-3 h-3" />
            </Button>
            <Button size="icon-sm" variant="outline" title="icon-sm">
              <Icons name="search" className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="outline" title="icon (default)">
              <Icons name="settings" className="w-4 h-4" />
            </Button>
            <Button size="icon-lg" variant="outline" title="icon-lg">
              <Icons name="bell" className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* States: Disabled & Loading */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            States
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button disabled variant="default">
              Disabled
            </Button>
            <Button disabled variant="outline">
              Disabled Outline
            </Button>
            <Button variant="default" disabled>
              <Icons name="spinner" className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </Button>
          </div>
        </div>
      </div>
    );
  },
};

export const InteractiveSingle: Story = {
  name: 'Interactive Single Button',
  args: {
    children: 'Interactive Button',
    variant: 'default',
    size: 'default',
    disabled: false,
  },
};
