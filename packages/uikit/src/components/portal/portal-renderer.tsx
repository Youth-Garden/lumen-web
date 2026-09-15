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

  const openPortals = portals.filter((p) => p.isOpen);
  if (openPortals.length === 0) return null;

  const lastOpenIndex = portals.reduce(
    (lastIdx, p, idx) => (p.isOpen ? idx : lastIdx),
    -1,
  );

  const topBackdropPortal = [...portals]
    .reverse()
    .find((p) => p.isOpen && !p.disableBackdrop);

  return createPortal(
    <>
      {topBackdropPortal && (
        <Backdrop
          isOpen={true}
          style={{ zIndex: 99 }}
          onPress={() => {
            if (!topBackdropPortal.disableCloseByBackdrop) {
              onDismiss(topBackdropPortal.id);
            }
          }}
        />
      )}
      {portals.map((instance, index) => {
        const isTopActive = index === lastOpenIndex;
        const zIndex = isTopActive ? 100 : 98;

        return (
          <PortalInstanceItem
            key={instance.id}
            instance={instance}
            zIndex={zIndex}
            onDismiss={() => onDismiss(instance.id)}
          />
        );
      })}
    </>,
    document.body,
  );
};

const PortalInstanceItem = ({
  instance,
  zIndex,
  onDismiss,
}: {
  instance: PortalInstance;
  zIndex: number;
  onDismiss: () => void;
}) => {
  const Component = instance.component;

  if (!instance.isOpen) return null;

  return (
    <div style={{ position: 'relative', zIndex }}>
      <Component
        id={instance.id}
        data={instance.data}
        isOpen={instance.isOpen}
        onDismiss={onDismiss}
      />
    </div>
  );
};
