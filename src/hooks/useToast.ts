import { useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'warning' | 'celebration';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  text: string;
  type: ToastType;
  action?: ToastAction;
}

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (text: string, type: ToastType = 'success', duration = 3000, action?: ToastAction) => {
      const id = `toast-${++toastCounter}`;
      const toast: Toast = { id, text, type, action };
      setToasts((prev) => [...prev, toast]);

      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);
      timersRef.current.set(id, timer);

      return id;
    },
    [removeToast]
  );

  return { toasts, addToast, removeToast };
}
