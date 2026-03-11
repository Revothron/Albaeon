"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type MaintenanceWatcherProps = {
    when: "enabled" | "disabled";
    intervalMs?: number;
};

export default function MaintenanceWatcher({
    when,
    intervalMs = 2000,
}: MaintenanceWatcherProps) {
    const router = useRouter();
    const hasTriggeredRef = useRef(false);

    useEffect(() => {
        let active = true;
        let intervalId: ReturnType<typeof setInterval> | null = null;
        let eventSource: EventSource | null = null;

        const handleState = (enabled: boolean) => {
            const shouldRefresh = when === "enabled" ? enabled : !enabled;

            if (active && shouldRefresh && !hasTriggeredRef.current) {
                hasTriggeredRef.current = true;
                router.refresh();
            }
        };

        const startPolling = () => {
            const check = async () => {
                try {
                    const response = await fetch("/api/admin/maintenance");
                    const data = await response.json();
                    handleState(Boolean(data?.enabled));
                } catch {
                    // Ignore polling failures.
                }
            };

            check();
            intervalId = setInterval(check, intervalMs);
        };

        if (typeof window !== "undefined" && "EventSource" in window) {
            eventSource = new EventSource("/api/admin/maintenance/stream");
            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleState(Boolean(data?.enabled));
                } catch {
                    // Ignore malformed events.
                }
            };
            eventSource.onerror = () => {
                eventSource?.close();
                eventSource = null;
                if (!intervalId) {
                    startPolling();
                }
            };
        } else {
            startPolling();
        }

        return () => {
            active = false;
            if (intervalId) {
                clearInterval(intervalId);
            }
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [intervalMs, router, when]);

    return null;
}
