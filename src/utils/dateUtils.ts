export function getTodayKey(): string {
  const d = new Date();
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function hoursSince(timestamp: number): number {
  return (Date.now() - timestamp) / (1000 * 60 * 60);
}

export function generateId(): string {
  return crypto.randomUUID();
}
