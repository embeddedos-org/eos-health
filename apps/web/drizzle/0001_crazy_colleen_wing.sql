CREATE TABLE `breath_tests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceId` int NOT NULL,
	`testType` enum('BAC','VOC','Both') DEFAULT 'BAC',
	`bacValue` float,
	`vocPpm` float,
	`result` enum('Clear','Caution','Alert') DEFAULT 'Clear',
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `breath_tests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `devices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceType` enum('HEALTH-KEY ULTRA','HEALTH-BAND Neuro') NOT NULL,
	`name` varchar(128) NOT NULL,
	`serialNumber` varchar(64),
	`firmwareVersion` varchar(32),
	`connectionType` enum('BLE','USB-C','Wi-Fi') DEFAULT 'BLE',
	`isConnected` boolean DEFAULT false,
	`batteryLevel` int,
	`storageUsedMb` int DEFAULT 0,
	`lastSeenAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `devices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ecg_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceId` int NOT NULL,
	`durationSeconds` int,
	`anomalyCount` int DEFAULT 0,
	`hasAfib` boolean DEFAULT false,
	`hasBradycardia` boolean DEFAULT false,
	`hasTachycardia` boolean DEFAULT false,
	`waveformDataKey` text,
	`notes` text,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ecg_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `firmware_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deviceType` enum('HEALTH-KEY ULTRA','HEALTH-BAND Neuro') NOT NULL,
	`version` varchar(32) NOT NULL,
	`releaseNotes` text,
	`downloadUrl` text,
	`isLatest` boolean DEFAULT false,
	`releasedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `firmware_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `health_readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceId` int NOT NULL,
	`heartRate` int,
	`spo2` float,
	`bac` float,
	`steps` int,
	`sleepMinutes` int,
	`temperature` float,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `health_readings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `semg_gestures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceId` int NOT NULL,
	`label` varchar(64) NOT NULL,
	`sampleCount` int DEFAULT 0,
	`accuracy` float,
	`modelVersion` varchar(32),
	`dataKey` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `semg_gestures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tens_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceId` int NOT NULL,
	`pulseWidthUs` int DEFAULT 200,
	`frequencyHz` int DEFAULT 80,
	`amplitudeMa` float DEFAULT 10,
	`durationSeconds` int,
	`programName` varchar(64),
	`notes` text,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tens_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vault_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceId` int NOT NULL,
	`fileName` varchar(256) NOT NULL,
	`fileType` enum('ECG','BreathTest','HealthLog','sEMG','Other') DEFAULT 'Other',
	`fileSizeBytes` int,
	`storageKey` text,
	`storageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vault_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;