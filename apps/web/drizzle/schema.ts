import {
  boolean,
  float,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const devices = mysqlTable("devices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceType: mysqlEnum("deviceType", ["HEALTH-KEY ULTRA", "HEALTH-BAND Neuro"]).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  serialNumber: varchar("serialNumber", { length: 64 }),
  firmwareVersion: varchar("firmwareVersion", { length: 32 }),
  connectionType: mysqlEnum("connectionType", ["BLE", "USB-C", "Wi-Fi"]).default("BLE"),
  isConnected: boolean("isConnected").default(false),
  batteryLevel: int("batteryLevel"),
  storageUsedMb: int("storageUsedMb").default(0),
  lastSeenAt: timestamp("lastSeenAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const healthReadings = mysqlTable("health_readings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: int("deviceId").notNull(),
  heartRate: int("heartRate"),
  spo2: float("spo2"),
  bac: float("bac"),
  steps: int("steps"),
  sleepMinutes: int("sleepMinutes"),
  temperature: float("temperature"),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export const ecgSessions = mysqlTable("ecg_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: int("deviceId").notNull(),
  durationSeconds: int("durationSeconds"),
  anomalyCount: int("anomalyCount").default(0),
  hasAfib: boolean("hasAfib").default(false),
  hasBradycardia: boolean("hasBradycardia").default(false),
  hasTachycardia: boolean("hasTachycardia").default(false),
  waveformDataKey: text("waveformDataKey"),
  notes: text("notes"),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export const breathTests = mysqlTable("breath_tests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: int("deviceId").notNull(),
  testType: mysqlEnum("testType", ["BAC", "VOC", "Both"]).default("BAC"),
  bacValue: float("bacValue"),
  vocPpm: float("vocPpm"),
  result: mysqlEnum("result", ["Clear", "Caution", "Alert"]).default("Clear"),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export const tensSessions = mysqlTable("tens_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: int("deviceId").notNull(),
  pulseWidthUs: int("pulseWidthUs").default(200),
  frequencyHz: int("frequencyHz").default(80),
  amplitudeMa: float("amplitudeMa").default(10),
  durationSeconds: int("durationSeconds"),
  programName: varchar("programName", { length: 64 }),
  notes: text("notes"),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export const semgGestures = mysqlTable("semg_gestures", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: int("deviceId").notNull(),
  label: varchar("label", { length: 64 }).notNull(),
  sampleCount: int("sampleCount").default(0),
  accuracy: float("accuracy"),
  modelVersion: varchar("modelVersion", { length: 32 }),
  dataKey: text("dataKey"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const vaultFiles = mysqlTable("vault_files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: int("deviceId").notNull(),
  fileName: varchar("fileName", { length: 256 }).notNull(),
  fileType: mysqlEnum("fileType", ["ECG", "BreathTest", "HealthLog", "sEMG", "Other"]).default("Other"),
  fileSizeBytes: int("fileSizeBytes"),
  storageKey: text("storageKey"),
  storageUrl: text("storageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const firmwareVersions = mysqlTable("firmware_versions", {
  id: int("id").autoincrement().primaryKey(),
  deviceType: mysqlEnum("deviceType", ["HEALTH-KEY ULTRA", "HEALTH-BAND Neuro"]).notNull(),
  version: varchar("version", { length: 32 }).notNull(),
  releaseNotes: text("releaseNotes"),
  downloadUrl: text("downloadUrl"),
  isLatest: boolean("isLatest").default(false),
  releasedAt: timestamp("releasedAt").defaultNow().notNull(),
});
