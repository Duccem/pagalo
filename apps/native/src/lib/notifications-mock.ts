export type MockNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
};

const store: { notifications: MockNotification[] } = { notifications: [] };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => {
    l();
  });
}

export function pushMockNotification(title: string, body: string) {
  const n: MockNotification = {
    id: Math.random().toString(36).slice(2),
    title,
    body,
    createdAt: Date.now(),
  };
  store.notifications.unshift(n);
  emit();
  return n.id;
}

export function clearMockNotifications() {
  store.notifications = [];
  emit();
}

export function getMockNotifications() {
  return store.notifications;
}

export function useMockNotificationList(): MockNotification[] {
  // dynamic require to avoid import cycle illusions in React Native bundler edge cases
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require("react") as typeof import("react");
  const { useState, useEffect } = React;
  const [list, setList] = useState<MockNotification[]>(() => [
    ...store.notifications,
  ]);
  useEffect(() => {
    const listener = () => setList([...store.notifications]);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return list;
}

export function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

