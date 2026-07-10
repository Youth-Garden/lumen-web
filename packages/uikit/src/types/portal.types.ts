import React from 'react';

export interface PortalProps<T = any> {
  id?: string;
  isOpen?: boolean;
  onDismiss?: () => void;
  data?: T;
}

export interface PortalInstance<T = any> extends PortalProps<T> {
  component: React.ComponentType<PortalProps<T>>;
  disableCloseByBackdrop?: boolean;
  disableBackdrop?: boolean;
}
