import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createBreathTest,
  createDevice,
  createEcgSession,
  createHealthReading,
  createSemgGesture,
  createTensSession,
  createVaultFile,
  deleteDevice,
  deleteSemgGesture,
  deleteVaultFile,
  getBreathTests,
  getDeviceById,
  getDevicesByUser,
  getEcgSessions,
  getHealthReadings,
  getLatestFirmware,
  getSemgGestures,
  getTensSessions,
  getVaultFiles,
  updateDevice,
  updateSemgGesture,
} from "./db";

/* ─── Devices Router ────────────────────────────────────────────────────── */
const devicesRouter = router({
  list: protectedProcedure.query(({ ctx }) => getDevicesByUser(ctx.user.id)),

  pair: protectedProcedure
    .input(z.object({
      deviceType: z.enum(["HEALTH-KEY ULTRA", "HEALTH-BAND Neuro"]),
      name: z.string().min(1).max(128),
      serialNumber: z.string().optional(),
      connectionType: z.enum(["BLE", "USB-C", "Wi-Fi"]).default("BLE"),
      firmwareVersion: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await createDevice({ ...input, userId: ctx.user.id, isConnected: true, lastSeenAt: new Date() });
      return { success: true, deviceType: input.deviceType, name: input.name };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(128).optional(),
      connectionType: z.enum(["BLE", "USB-C", "Wi-Fi"]).optional(),
      isConnected: z.boolean().optional(),
      batteryLevel: z.number().min(0).max(100).optional(),
      firmwareVersion: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await updateDevice(id, ctx.user.id, data);
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteDevice(input.id, ctx.user.id);
      return { success: true };
    }),

  getLatestFirmware: protectedProcedure
    .input(z.object({ deviceType: z.enum(["HEALTH-KEY ULTRA", "HEALTH-BAND Neuro"]) }))
    .query(({ input }) => getLatestFirmware(input.deviceType)),
});

/* ─── Health Data Router ────────────────────────────────────────────────── */
const healthDataRouter = router({
  addReading: protectedProcedure
    .input(z.object({
      deviceId: z.number(),
      heartRate: z.number().optional(),
      spo2: z.number().optional(),
      bac: z.number().optional(),
      steps: z.number().optional(),
      sleepMinutes: z.number().optional(),
      temperature: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await createHealthReading({ ...input, userId: ctx.user.id });
      return { success: true };
    }),

  getReadings: protectedProcedure
    .input(z.object({ deviceId: z.number().optional(), limit: z.number().default(100) }))
    .query(({ ctx, input }) => getHealthReadings(ctx.user.id, input.deviceId, input.limit)),

  // Mock live stream data for demo
  getLiveData: protectedProcedure
    .input(z.object({ deviceId: z.number() }))
    .query(() => {
      const now = Date.now();
      return {
        heartRate: 68 + Math.floor(Math.random() * 12),
        spo2: 97 + Math.random() * 2,
        bac: 0.00,
        steps: 4820 + Math.floor(Math.random() * 50),
        sleepMinutes: 432,
        temperature: 36.6 + Math.random() * 0.4,
        timestamp: now,
      };
    }),
});

/* ─── ECG Router ────────────────────────────────────────────────────────── */
const ecgRouter = router({
  saveSession: protectedProcedure
    .input(z.object({
      deviceId: z.number(),
      durationSeconds: z.number(),
      anomalyCount: z.number().default(0),
      hasAfib: z.boolean().default(false),
      hasBradycardia: z.boolean().default(false),
      hasTachycardia: z.boolean().default(false),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await createEcgSession({ ...input, userId: ctx.user.id });
      return { success: true };
    }),

  getSessions: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(({ ctx, input }) => getEcgSessions(ctx.user.id, input.limit)),

  // Generate mock ECG waveform data
  getMockWaveform: protectedProcedure.query(() => {
    const points: number[] = [];
    for (let i = 0; i < 500; i++) {
      const t = i / 500;
      const beat = Math.sin(t * Math.PI * 2 * 5) * 0.1;
      const qrs = i % 100 === 50 ? 1.2 : i % 100 === 48 ? -0.3 : i % 100 === 52 ? -0.2 : 0;
      const p = Math.sin(((i % 100) - 20) * 0.3) * 0.15 * (i % 100 < 35 ? 1 : 0);
      const t_wave = Math.sin(((i % 100) - 65) * 0.25) * 0.2 * (i % 100 > 58 && i % 100 < 80 ? 1 : 0);
      points.push(beat + qrs + p + t_wave + (Math.random() - 0.5) * 0.03);
    }
    return { points, sampleRate: 250 };
  }),
});

/* ─── Breath Test Router ────────────────────────────────────────────────── */
const breathTestRouter = router({
  submit: protectedProcedure
    .input(z.object({
      deviceId: z.number(),
      testType: z.enum(["BAC", "VOC", "Both"]).default("BAC"),
      bacValue: z.number().optional(),
      vocPpm: z.number().optional(),
      result: z.enum(["Clear", "Caution", "Alert"]).default("Clear"),
    }))
    .mutation(async ({ ctx, input }) => {
      await createBreathTest({ ...input, userId: ctx.user.id });
      return { success: true };
    }),

  getHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(({ ctx, input }) => getBreathTests(ctx.user.id, input.limit)),
});

/* ─── TENS Router ───────────────────────────────────────────────────────── */
const tensRouter = router({
  saveSession: protectedProcedure
    .input(z.object({
      deviceId: z.number(),
      pulseWidthUs: z.number().min(50).max(500).default(200),
      frequencyHz: z.number().min(1).max(150).default(80),
      amplitudeMa: z.number().min(0).max(80).default(10),
      durationSeconds: z.number().optional(),
      programName: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await createTensSession({ ...input, userId: ctx.user.id });
      return { success: true };
    }),

  getHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(({ ctx, input }) => getTensSessions(ctx.user.id, input.limit)),
});

/* ─── sEMG Router ───────────────────────────────────────────────────────── */
const semgRouter = router({
  addGesture: protectedProcedure
    .input(z.object({
      deviceId: z.number(),
      label: z.string().min(1).max(64),
      sampleCount: z.number().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      await createSemgGesture({ ...input, userId: ctx.user.id });
      return { success: true };
    }),

  getGestures: protectedProcedure
    .input(z.object({ deviceId: z.number() }))
    .query(({ ctx, input }) => getSemgGestures(ctx.user.id, input.deviceId)),

  updateGesture: protectedProcedure
    .input(z.object({
      id: z.number(),
      label: z.string().optional(),
      sampleCount: z.number().optional(),
      accuracy: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await updateSemgGesture(id, ctx.user.id, data);
      return { success: true };
    }),

  deleteGesture: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteSemgGesture(input.id, ctx.user.id);
      return { success: true };
    }),
});

/* ─── Vault Router ──────────────────────────────────────────────────────── */
const vaultRouter = router({
  getFiles: protectedProcedure
    .input(z.object({ deviceId: z.number().optional() }))
    .query(({ ctx, input }) => getVaultFiles(ctx.user.id, input.deviceId)),

  addFile: protectedProcedure
    .input(z.object({
      deviceId: z.number(),
      fileName: z.string().min(1).max(256),
      fileType: z.enum(["ECG", "BreathTest", "HealthLog", "sEMG", "Other"]).default("Other"),
      fileSizeBytes: z.number().optional(),
      storageKey: z.string().optional(),
      storageUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await createVaultFile({ ...input, userId: ctx.user.id });
      return { success: true };
    }),

  deleteFile: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteVaultFile(input.id, ctx.user.id);
      return { success: true };
    }),
});

/* ─── App Router ────────────────────────────────────────────────────────── */
export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  devices: devicesRouter,
  healthData: healthDataRouter,
  ecg: ecgRouter,
  breathTest: breathTestRouter,
  tens: tensRouter,
  semg: semgRouter,
  vault: vaultRouter,
});

export type AppRouter = typeof appRouter;
