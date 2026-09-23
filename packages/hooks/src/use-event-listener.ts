'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

type TargetElement<T> = RefObject<T | null> | T | null;

// MediaQueryList Event based useEventListener interface
function useEventListener<K extends keyof MediaQueryListEventMap>(
  eventName: K,
  handler: (event: MediaQueryListEventMap[K]) => void,
  element: TargetElement<MediaQueryList>,
  options?: boolean | AddEventListenerOptions,
): void;

// Window Event based useEventListener interface
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: TargetElement<Window>,
  options?: boolean | AddEventListenerOptions,
): void;

// Document Event based useEventListener interface
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: TargetElement<Document>,
  options?: boolean | AddEventListenerOptions,
): void;

// Element Event based useEventListener interface
function useEventListener<
  K extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  T extends Element = HTMLElement,
>(
  eventName: K,
  handler:
    | ((event: HTMLElementEventMap[K]) => void)
    | ((event: SVGElementEventMap[K]) => void),
  element: TargetElement<T>,
  options?: boolean | AddEventListenerOptions,
): void;

// Custom / Generic EventTarget interface
function useEventListener<
  E extends Event = Event,
  T extends EventTarget = EventTarget,
>(
  eventName: string,
  handler: (event: E) => void,
  element?: TargetElement<T>,
  options?: boolean | AddEventListenerOptions,
): void;

function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element?: TargetElement<EventTarget>,
  options?: boolean | AddEventListenerOptions,
) {
  const savedHandler = useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let targetElement: EventTarget | null = null;

    if (element === undefined) {
      targetElement = window;
    } else if (element && typeof element === 'object' && 'current' in element) {
      targetElement = element.current;
    } else {
      targetElement = element as EventTarget | null;
    }

    if (!targetElement?.addEventListener) return;

    const listener = (event: Event) => {
      savedHandler.current(event);
    };

    targetElement.addEventListener(eventName, listener, options);

    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}

export { useEventListener };
export type { TargetElement };
