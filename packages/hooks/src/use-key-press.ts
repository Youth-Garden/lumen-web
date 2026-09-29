'use client';

import { useCallback, useRef, type RefObject } from 'react';
import { useEventListener, type TargetElement } from './use-event-listener';

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
  target?: TargetElement<EventTarget>;
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

  const pressedKey = (event?.key || '').toLowerCase();
  const pressedCode = (event?.code || '').toLowerCase();

  if (!pressedKey && !pressedCode) return false;

  if (Array.isArray(keyFilter)) {
    return keyFilter.some(
      (k) =>
        (pressedKey !== '' && k.toLowerCase() === pressedKey) ||
        (pressedCode !== '' && k.toLowerCase() === pressedCode),
    );
  }

  const targetKey = keyFilter.toLowerCase();
  return (
    (pressedKey !== '' && targetKey === pressedKey) ||
    (pressedCode !== '' && targetKey === pressedCode)
  );
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

  const keyRef = useRef(key);
  keyRef.current = key;

  const modifierKeysRef = useRef(modifierKeys);
  modifierKeysRef.current = modifierKeys;

  const handleEvent = useCallback(
    (e: Event) => {
      if (disabled) return;

      const keyboardEvent = e as KeyboardEvent;

      if (ignoreInputElements && isInputElement(keyboardEvent.target)) {
        return;
      }

      if (
        matchesKey(keyboardEvent, keyRef.current) &&
        matchesModifiers(keyboardEvent, modifierKeysRef.current)
      ) {
        if (preventDefault) {
          keyboardEvent.preventDefault();
        }
        if (stopPropagation) {
          keyboardEvent.stopPropagation();
        }
        callbackRef.current(keyboardEvent);
      }
    },
    [disabled, ignoreInputElements, preventDefault, stopPropagation],
  );

  useEventListener(event, handleEvent, target, eventOptions);
}
