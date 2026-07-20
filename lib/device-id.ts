const DEVICE_ID_KEY = "creatorzone_device_id";

export function getDeviceId() {
  if (typeof window === "undefined") {
    return "";
  }

  const existing = window.localStorage.getItem(DEVICE_ID_KEY);

  if (existing) {
    return existing;
  }

  const id = crypto.randomUUID();
  window.localStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}
