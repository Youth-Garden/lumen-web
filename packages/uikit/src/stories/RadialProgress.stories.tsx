import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { RadialProgress } from '../components/ui/radial-progress';

const meta = {
  title: 'UI/RadialProgress',
  component: RadialProgress,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'number', min: 40, max: 200, step: 10 } },
    strokeWidth: { control: { type: 'number', min: 4, max: 24, step: 2 } },
  },
  args: {
    value: 75,
  },
} satisfies Meta<typeof RadialProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 75,
    max: 100,
    size: 120,
    strokeWidth: 10,
    valueSuffix: '%',
  },
};

export const ProgressStages: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <RadialProgress value={20} size={80} strokeWidth={8} valueSuffix="%" />
      <RadialProgress value={50} size={80} strokeWidth={8} valueSuffix="%" />
      <RadialProgress value={85} size={80} strokeWidth={8} valueSuffix="%" />
      <RadialProgress value={100} size={80} strokeWidth={8} valueSuffix="%" colorClass="text-emerald-500" />
    </div>
  ),
};
