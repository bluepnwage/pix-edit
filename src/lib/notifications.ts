import { writable } from "svelte/store";

type NotificationTypes = "error" | "success" | "default";

type NotificationPayload = {
  payload: string;
  type?: NotificationTypes;
  id: string;
  ttl?: number;
};

export const store = writable<NotificationPayload[]>([]);

export function dispatchNoti(options: Omit<NotificationPayload, "id">) {
  const id = crypto.randomUUID();
  const ttl = options.ttl || 5 * 1000;
  const payload = { ...options, id };
  store.update((n) => [...n, payload]);
  setTimeout(() => {
    store.update((n) => n.filter((payload) => payload.id !== id));
  }, ttl);
}
