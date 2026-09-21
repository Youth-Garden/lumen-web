'use client';

import { useEffect, useRef, type RefObject } from 'react';

export type KeyPredicate = (event: KeyboardEvent) => boolean;
export type KeyFilter = string | string[] | KeyPredicate;

export interface UseKeyPressModifierKeys {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  ctrlOrMeta?: boolean;
}

export interface UseKeyPressOptions {
  event?: 'keydown' | 'keyup' | 'keypress';
  target?: Window | Document | HTMLElement | RefObject<HTMLElement | null>;
  modifierKeys?: UseKeyPressModifierKeys;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  ignoreInputElements?: boolean;
  disabled?: boolean;
  eventOptions?: AddEventListenerOptions;
}

function isInputElement(element: EventTarget | null): boolean {
  if (!element || !(element instanceof HTMLElement)) return false;
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element.isContentEditable ||
    element.getAttribute('role') === 'textbox'
  );
}

function matchesKey(event: KeyboardEvent, keyFilter: KeyFilter): boolean {
  if (typeof keyFilter === 'function') {
    return keyFilter(event);
  }

  const pressedKey = event.key.toLowerCase();
  const pressedCode = event.code.toLowerCase();

  if (Array.isArray(keyFilter)) {
    return keyFilter.some(
      (k) => k.toLowerCase() === pressedKey || k.toLowerCase() === pressedCode,
    );
  }

  const targetKey = keyFilter.toLowerCase();
  return targetKey === pressedKey || targetKey === pressedCode;
}

function matchesModifiers(
  event: KeyboardEvent,
  modifiers?: UseKeyPressModifierKeys,
): boolean {
  if (!modifiers) return true;

  if (modifiers.ctrlOrMeta !== undefined) {
    const hasCtrlOrMeta = event.ctrlKey || event.metaKey;
    if (modifiers.ctrlOrMeta !== hasCtrlOrMeta) return false;
  }

  if (modifiers.ctrl !== undefined && modifiers.ctrl !== event.ctrlKey) {
    return false;
  }
  if (modifiers.shift !== undefined && modifiers.shift !== event.shiftKey) {
    return false;
  }
  if (modifiers.alt !== undefined && modifiers.alt !== event.altKey) {
    return false;
  }
  if (modifiers.meta !== undefined && modifiers.meta !== event.metaKey) {
    return false;
  }

  return true;
}

export function useKeyPress(
  key: KeyFilter,
  callback: (event: KeyboardEvent) => void,
  options: UseKeyPressOptions = {},
): void {
  const {
    event = 'keydown',
    target,
    modifierKeys,
    preventDefault = false,
    stopPropagation = false,
    ignoreInputElements = true,
    disabled = false,
    eventOptions,
  } = options;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;

    const handler = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;

      if (ignoreInputElements && isInputElement(keyboardEvent.target)) {
        return;
      }

      if (
        matchesKey(keyboardEvent, key) &&
        matchesModifiers(keyboardEvent, modifierKeys)
      ) {
        if (preventDefault) {
          keyboardEvent.preventDefault();
        }
        if (stopPropagation) {
          keyboardEvent.stopPropagation();
        }
        callbackRef.current(keyboardEvent);
      }
    };

    let resolvedTarget: EventTarget | null = null;
    if (target) {
      if ('current' in target) {
        resolvedTarget = target.current;
      } else {
        resolvedTarget = target;
      }
    } else {
      resolvedTarget = window;
    }

    if (!resolvedTarget) return;

    resolvedTarget.addEventListener(event, handler, eventOptions);

    return () => {
      resolvedTarget.removeEventListener(event, handler, eventOptions);
    };
  }, [
    key,
    event,
    target,
    modifierKeys,
    preventDefault,
    stopPropagation,
    ignoreInputElements,
    disabled,
    eventOptions,
  ]);
}
