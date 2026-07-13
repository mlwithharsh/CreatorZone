"use client";

import { useEffect, useState } from "react";

import { getDeviceId } from "@/lib/device-id";

export function useDeviceId() {
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    setDeviceId(getDeviceId());
  }, []);

  return deviceId;
}
