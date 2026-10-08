import { demoSessionSchema, type DemoSession } from "./schemas";
const SESSION_KEY = "sellwella-demo-session-v1";
export function saveDemoSession(session: DemoSession) {
  const safeSession = demoSessionSchema.parse(session);
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeSession));
    window.dispatchEvent(new Event("sellwella-demo-session-changed"));
    return true;
  } catch {
    return false;
  }
}
export function readDemoSession(): DemoSession | null {
  try {
    const parsed = demoSessionSchema.safeParse(
      JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null"),
    );
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
