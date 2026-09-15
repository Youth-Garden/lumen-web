import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '../components/ui/sheet';
import { Button } from '../components/ui/button';

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RightSideDrawer: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline">Open Right Drawer</Button>}
      />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Word Quick Details</SheetTitle>
          <SheetDescription>
            View definitions, phonetics, and contextual examples.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 text-sm text-muted-foreground space-y-2">
          <p className="font-bold text-foreground text-xl">Ubiquitous</p>
          <p className="italic text-xs">/juːˈbɪk.wə.t̬əs/ • adjective</p>
          <p className="text-foreground pt-2">
            Present, appearing, or found everywhere.
          </p>
        </div>
        <SheetFooter>
          <SheetClose
            render={
              <Button variant="default" className="w-full">
                Done
              </Button>
            }
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const CenteredFloatingSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger
        render={<Button variant="default">Open Floating Sheet</Button>}
      />
      <SheetContent side="bottom" centered>
        <SheetHeader>
          <SheetTitle>Floating Card Modal</SheetTitle>
          <SheetDescription>
            On desktop this renders centered with 4 rounded corners. On mobile
            it slides from bottom.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 text-sm text-foreground/80">
          This is the exact layout used for the redesigned Word Detail Sheet.
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="secondary">Close</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
