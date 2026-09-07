'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePortalStore } from '../../store/portal.store';
import { Backdrop } from '../ui/backdrop';
import { PortalInstance } from '../../types/portal.types';

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

  return (
    <>
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
    </>
  );
};
