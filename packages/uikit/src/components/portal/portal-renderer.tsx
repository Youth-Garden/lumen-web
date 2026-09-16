'use client';

import React, { useEffect, useState } from 'react';
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

  const openPortals = portals.filter((p) => p.isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openPortals.length > 0) {
        const topPortal = openPortals[openPortals.length - 1];
        if (!topPortal.disableCloseByBackdrop) {
          onDismiss(topPortal.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openPortals, onDismiss]);

  if (!mounted || portals.length === 0) return null;
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
