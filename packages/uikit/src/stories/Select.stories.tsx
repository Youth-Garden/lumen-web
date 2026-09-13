import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '../components/ui/select';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <Select defaultValue="en">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select target language..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Languages</SelectLabel>
            <SelectItem value="vi">Vietnamese</SelectItem>
            <SelectItem value="en">English (US)</SelectItem>
            <SelectItem value="ja">Japanese (日本語)</SelectItem>
            <SelectItem value="fr">French (Français)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};
