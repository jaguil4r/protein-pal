import { useState, useCallback, useRef, useEffect } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  const scheduleNotification = useCallback(
    (title: string, body: string, delayMs: number) => {
      if (permission !== 'granted') return;

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        new Notification(title, { body, icon: '/icons/icon-192.png' });
        timerRef.current = null;
      }, delayMs);
    },
    [permission]
  );

  return { permission, requestPermission, scheduleNotification };
}
