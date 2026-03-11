import { NextResponse } from "next/server";
import { getMaintenanceState, setMaintenanceMode } from "@/lib/maintenance";

export const dynamic = "force-dynamic";

export async function GET() {
    const state = await getMaintenanceState();
    return NextResponse.json({ enabled: state.enabled, updatedAt: state.updatedAt });
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    const enabled = Boolean((body as { enabled?: boolean }).enabled);
    const result = await setMaintenanceMode(enabled);
    return NextResponse.json({ enabled: result.enabled, updatedAt: result.updatedAt });
}
