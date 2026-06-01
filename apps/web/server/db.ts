import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  breathTests,
  devices,
  ecgSessions,
  firmwareVersions,
  healthReadings,
  semgGestures,
  tensSessions,
  users,
  vaultFiles,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/* ─── Users ─────────────────────────────────────────────────────────────── */
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach((field) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  });
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

/* ─── Devices ───────────────────────────────────────────────────────────── */
export async function getDevicesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(devices).where(eq(devices.userId, userId)).orderBy(desc(devices.updatedAt));
}

export async function createDevice(data: typeof devices.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(devices).values(data);
  return result;
}

export async function updateDevice(id: number, userId: number, data: Partial<typeof devices.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.update(devices).set(data).where(and(eq(devices.id, id), eq(devices.userId, userId)));
}

export async function deleteDevice(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.delete(devices).where(and(eq(devices.id, id), eq(devices.userId, userId)));
}

export async function getDeviceById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(devices).where(and(eq(devices.id, id), eq(devices.userId, userId))).limit(1);
  return result[0];
}

/* ─── Health Readings ───────────────────────────────────────────────────── */
export async function createHealthReading(data: typeof healthReadings.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(healthReadings).values(data);
}

export async function getHealthReadings(userId: number, deviceId?: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  const conditions = deviceId
    ? and(eq(healthReadings.userId, userId), eq(healthReadings.deviceId, deviceId))
    : eq(healthReadings.userId, userId);
  return db.select().from(healthReadings).where(conditions).orderBy(desc(healthReadings.recordedAt)).limit(limit);
}

/* ─── ECG Sessions ──────────────────────────────────────────────────────── */
export async function createEcgSession(data: typeof ecgSessions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(ecgSessions).values(data);
}

export async function getEcgSessions(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ecgSessions).where(eq(ecgSessions.userId, userId)).orderBy(desc(ecgSessions.recordedAt)).limit(limit);
}

/* ─── Breath Tests ──────────────────────────────────────────────────────── */
export async function createBreathTest(data: typeof breathTests.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(breathTests).values(data);
}

export async function getBreathTests(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(breathTests).where(eq(breathTests.userId, userId)).orderBy(desc(breathTests.recordedAt)).limit(limit);
}

/* ─── TENS Sessions ─────────────────────────────────────────────────────── */
export async function createTensSession(data: typeof tensSessions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(tensSessions).values(data);
}

export async function getTensSessions(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tensSessions).where(eq(tensSessions.userId, userId)).orderBy(desc(tensSessions.recordedAt)).limit(limit);
}

/* ─── sEMG Gestures ─────────────────────────────────────────────────────── */
export async function createSemgGesture(data: typeof semgGestures.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(semgGestures).values(data);
}

export async function getSemgGestures(userId: number, deviceId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(semgGestures).where(and(eq(semgGestures.userId, userId), eq(semgGestures.deviceId, deviceId))).orderBy(desc(semgGestures.createdAt));
}

export async function updateSemgGesture(id: number, userId: number, data: Partial<typeof semgGestures.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.update(semgGestures).set(data).where(and(eq(semgGestures.id, id), eq(semgGestures.userId, userId)));
}

export async function deleteSemgGesture(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.delete(semgGestures).where(and(eq(semgGestures.id, id), eq(semgGestures.userId, userId)));
}

/* ─── Vault Files ───────────────────────────────────────────────────────── */
export async function createVaultFile(data: typeof vaultFiles.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(vaultFiles).values(data);
}

export async function getVaultFiles(userId: number, deviceId?: number) {
  const db = await getDb();
  if (!db) return [];
  const conditions = deviceId
    ? and(eq(vaultFiles.userId, userId), eq(vaultFiles.deviceId, deviceId))
    : eq(vaultFiles.userId, userId);
  return db.select().from(vaultFiles).where(conditions).orderBy(desc(vaultFiles.createdAt));
}

export async function deleteVaultFile(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.delete(vaultFiles).where(and(eq(vaultFiles.id, id), eq(vaultFiles.userId, userId)));
}

/* ─── Firmware ──────────────────────────────────────────────────────────── */
export async function getLatestFirmware(deviceType: "HEALTH-KEY ULTRA" | "HEALTH-BAND Neuro") {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(firmwareVersions)
    .where(and(eq(firmwareVersions.deviceType, deviceType), eq(firmwareVersions.isLatest, true)))
    .limit(1);
  return result[0];
}
