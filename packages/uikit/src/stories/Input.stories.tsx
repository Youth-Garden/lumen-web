import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Input, PasswordInput } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Icons } from '../icons';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your email address...',
    type: 'email',
  },
  render: (args) => (
    <div className="w-80 space-y-2">
      <Label htmlFor="email-input">Email Address</Label>
      <Input id="email-input" {...args} />
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="password-input">Password</Label>
      <PasswordInput
        id="password-input"
        placeholder="Enter secret password..."
        defaultValue="mySecurePass123"
      />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="search-input">Search Vocabulary</Label>
      <div className="relative">
        <Icons
          name="search"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
        />
        <Input
          id="search-input"
          placeholder="Search words, idioms, collocations..."
          className="pl-10"
        />
      </div>
    </div>
  ),
};

export const InvalidState: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="invalid-email" className="text-destructive">
        Invalid Input
      </Label>
      <Input
        id="invalid-email"
        type="email"
        defaultValue="invalid-email@"
        aria-invalid="true"
      />
      <p className="text-xs text-destructive">
        Please enter a valid email address.
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="disabled-input">Disabled Input</Label>
      <Input
        id="disabled-input"
        disabled
        value="read-only-account@domain.com"
      />
    </div>
  ),
};
