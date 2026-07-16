'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePortalStore } from '../../store/portal.store';
import { PortalInstance } from '../../types/portal.types';
import { Backdrop } from '../ui/backdrop';

export const PortalRenderer = () => {
  const { portals, onDismiss } = usePortalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || portals.length === 0) return null;

  return createPortal(
    <>
      {portals.map((instance) => (
        <PortalInstanceItem
          key={instance.id}
          instance={instance}
          onDismiss={() => onDismiss(instance.id)}
        />
      ))}
    </>,
    document.body,
  );
};

const PortalInstanceItem = ({
  instance,
  onDismiss,
}: {
  instance: PortalInstance;
  onDismiss: () => void;
}) => {
  const Component = instance.component;

  if (instance.disableBackdrop) {
    return (
      <Component
        id={instance.id}
        data={instance.data}
        isOpen={instance.isOpen}
        onDismiss={onDismiss}
      />
    );
  }

  // Added a specific z-index wrapping wrapper for stacking correctly if multiple portals exist
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto w-full h-full">
        <Backdrop
          isOpen={instance.isOpen}
          onPress={() => {
            if (!instance.disableCloseByBackdrop) {
              onDismiss();
            }
          }}
        />
        <Component
          id={instance.id}
          data={instance.data}
          isOpen={instance.isOpen}
          onDismiss={onDismiss}
        />
      </div>
    </div>
  );
};
