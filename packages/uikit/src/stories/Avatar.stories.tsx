import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>LQ</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>Admin</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithImage: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  ),
};
