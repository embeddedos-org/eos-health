import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: { name: string; options: Record<string, unknown> }[] } {
  const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-eos",
    email: "test@eos.health",
    name: "EoS Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
  return { ctx, clearedCookies };
}

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({ maxAge: -1, httpOnly: true, path: "/" });
  });
});

describe("auth.me", () => {
  it("returns the current user when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const me = await caller.auth.me();
    expect(me?.email).toBe("test@eos.health");
    expect(me?.name).toBe("EoS Test User");
  });

  it("returns null when not authenticated", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const me = await caller.auth.me();
    expect(me).toBeNull();
  });
});

describe("ecg.getMockWaveform", () => {
  it("returns 500 ECG data points at 250Hz", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const waveform = await caller.ecg.getMockWaveform();
    expect(waveform.points).toHaveLength(500);
    expect(waveform.sampleRate).toBe(250);
    expect(typeof waveform.points[0]).toBe("number");
  });
});

describe("healthData.getLiveData", () => {
  it("returns valid live health metrics", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const data = await caller.healthData.getLiveData({ deviceId: 1 });
    expect(data.heartRate).toBeGreaterThanOrEqual(68);
    expect(data.heartRate).toBeLessThanOrEqual(80);
    expect(data.spo2).toBeGreaterThanOrEqual(97);
    expect(data.spo2).toBeLessThanOrEqual(99);
    expect(data.bac).toBe(0.00);
    expect(data.steps).toBeGreaterThan(0);
    expect(typeof data.timestamp).toBe("number");
  });
});
