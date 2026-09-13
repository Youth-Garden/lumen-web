import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Switch } from '../components/ui/switch';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-center gap-3">
        <Switch
          checked={checked}
          onCheckedChange={(c) => setChecked(Boolean(c))}
          id="sound-switch"
        />
        <label
          htmlFor="sound-switch"
          className="text-sm font-semibold text-foreground cursor-pointer select-none"
        >
          {checked ? 'Enabled' : 'Disabled'}
        </label>
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Off State</span>
        <Switch checked={false} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">On State</span>
        <Switch checked={true} />
      </div>

      <div className="flex items-center justify-between opacity-50">
        <span className="text-sm font-medium text-foreground">Disabled Off</span>
        <Switch disabled checked={false} />
      </div>

      <div className="flex items-center justify-between opacity-50">
        <span className="text-sm font-medium text-foreground">Disabled On</span>
        <Switch disabled checked={true} />
      </div>
    </div>
  ),
};
