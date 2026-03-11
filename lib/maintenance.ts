import { promises as fs } from "fs";
import path from "path";

type MaintenanceState = {
    enabled: boolean;
    updatedAt: string;
};

const maintenanceFilePath = path.join(process.cwd(), "data", "maintenance.json");

export async function getMaintenanceState(): Promise<MaintenanceState> {
    try {
        const raw = await fs.readFile(maintenanceFilePath, "utf8");
        const parsed = JSON.parse(raw) as Partial<MaintenanceState> | null;
        return {
            enabled: Boolean(parsed?.enabled),
            updatedAt: typeof parsed?.updatedAt === "string" ? parsed.updatedAt : "",
        };
    } catch {
        return { enabled: false, updatedAt: "" };
    }
}

export async function getMaintenanceMode() {
    const state = await getMaintenanceState();
    return state.enabled;
}

export async function setMaintenanceMode(enabled: boolean) {
    const payload: MaintenanceState = {
        enabled: Boolean(enabled),
        updatedAt: new Date().toISOString(),
    };

    await fs.mkdir(path.dirname(maintenanceFilePath), { recursive: true });
    await fs.writeFile(maintenanceFilePath, JSON.stringify(payload, null, 2), "utf8");

    return payload;
}
