import { getMaintenanceState } from "@/lib/maintenance";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
    const encoder = new TextEncoder();
    const { signal } = request;

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            let lastState = await getMaintenanceState();

            const send = (state: { enabled: boolean; updatedAt: string }) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(state)}\n\n`));
            };

            send(lastState);

            const intervalId = setInterval(async () => {
                try {
                    const current = await getMaintenanceState();
                    if (current.enabled !== lastState.enabled || current.updatedAt !== lastState.updatedAt) {
                        lastState = current;
                        send(current);
                    }
                } catch {
                    // Ignore read errors while streaming.
                }
            }, 1000);

            const close = () => {
                clearInterval(intervalId);
                try {
                    controller.close();
                } catch {
                    // Ignore close errors.
                }
            };

            signal.addEventListener("abort", close, { once: true });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}
