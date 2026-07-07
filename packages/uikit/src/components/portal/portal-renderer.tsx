'use client';

import { Backdrop } from '../ui/backdrop';
import { usePortalStore } from '../../store/portal.store';
import React, { useEffect, useState } from 'react';
import { PortalInstance } from '../../types/portal.types';
import { createPortal } from 'react-dom';

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
    document.body
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
