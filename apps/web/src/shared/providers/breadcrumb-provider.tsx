'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from 'react';

export interface BreadcrumbConfigItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbConfigItem[];
  setBreadcrumbs: (items: BreadcrumbConfigItem[]) => void;
  clearBreadcrumbs: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  breadcrumbs: [],
  setBreadcrumbs: () => {},
  clearBreadcrumbs: () => {},
});

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [breadcrumbs, setBreadcrumbsState] = useState<BreadcrumbConfigItem[]>(
    [],
  );
  const [, startTransition] = useTransition();

  const setBreadcrumbs = (items: BreadcrumbConfigItem[]) => {
    startTransition(() => {
      setBreadcrumbsState(items);
    });
  };

  const clearBreadcrumbs = () => {
    startTransition(() => {
      setBreadcrumbsState([]);
    });
  };

  return (
    <BreadcrumbContext.Provider
      value={{ breadcrumbs, setBreadcrumbs, clearBreadcrumbs }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}

export function useSetBreadcrumb(items: BreadcrumbConfigItem[]) {
  const { setBreadcrumbs, clearBreadcrumbs } = useBreadcrumb();
  const itemsKey = JSON.stringify(
    items.map((i) => ({ label: i.label, href: i.href })),
  );

  useEffect(() => {
    setBreadcrumbs(items);
    return () => {
      clearBreadcrumbs();
    };
  }, [itemsKey]);
}
