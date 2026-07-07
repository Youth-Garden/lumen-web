import type { Meta, StoryObj } from '@storybook/react';
import { Icons } from './index';

const meta = {
  title: 'UIKit/Icons',
  component: Icons,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: ['home', 'cardiology'],
      description: 'The name of the icon from the registry',
    },
    size: {
      control: { type: 'range', min: 12, max: 120, step: 4 },
      description: 'Size of the icon in pixels',
    },
    color: {
      control: 'color',
      description: 'Color of the icon (for linear variants)',
    },
    variant: {
      control: 'radio',
      options: ['linear', 'bold'],
      description: 'The variant style of the icon (where applicable)',
    },
  },
} satisfies Meta<typeof Icons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'home',
    size: 48,
    color: '#000000',
    variant: 'linear',
  },
};

export const CardiologyIcon: Story = {
  args: {
    name: 'cardiology',
    size: 64,
  },
};

export const BoldVariant: Story = {
  args: {
    name: 'home',
    size: 48,
    color: '#3b82f6',
    variant: 'bold',
  },
};
