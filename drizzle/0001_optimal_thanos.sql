CREATE TABLE `aiConfigurations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`systemPrompt` text NOT NULL,
	`model` varchar(100) DEFAULT 'mixtral-8x7b-32768',
	`temperature` decimal(3,2) DEFAULT '0.7',
	`maxTokens` int DEFAULT 1000,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiConfigurations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20) NOT NULL,
	`whatsappPhone` varchar(20),
	`segment` varchar(100),
	`status` enum('active','inactive','blocked') DEFAULT 'active',
	`totalPurchases` decimal(10,2) DEFAULT '0',
	`lastPurchaseDate` timestamp,
	`notes` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`userId` int NOT NULL,
	`stageId` int NOT NULL,
	`value` decimal(10,2),
	`probability` int DEFAULT 0,
	`expectedCloseDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`messageType` enum('text','image','document','audio','video') DEFAULT 'text',
	`direction` enum('inbound','outbound') NOT NULL,
	`whatsappMessageId` varchar(255),
	`status` enum('sent','delivered','read','failed') DEFAULT 'sent',
	`aiGenerated` boolean DEFAULT false,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`productName` varchar(255),
	`productCategory` varchar(100),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repurchaseNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`ruleId` int NOT NULL,
	`status` enum('pending','sent','clicked','purchased') DEFAULT 'pending',
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `repurchaseNotifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repurchaseRules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`productCategory` varchar(100),
	`daysBetweenPurchases` int NOT NULL,
	`minPurchaseAmount` decimal(10,2),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `repurchaseRules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salesFunnelStages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`order` int NOT NULL,
	`color` varchar(7),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salesFunnelStages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webhookLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`payload` json,
	`status` enum('received','processed','failed') DEFAULT 'received',
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `webhookLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflowExecutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` int NOT NULL,
	`customerId` int NOT NULL,
	`status` enum('pending','running','completed','failed') DEFAULT 'pending',
	`result` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workflowExecutions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`isActive` boolean DEFAULT true,
	`triggerType` enum('message_received','customer_created','stage_changed','time_based') NOT NULL,
	`flowData` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workflows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `aiConfigurations` (`userId`);--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `customers` (`userId`);--> statement-breakpoint
CREATE INDEX `phoneIdx` ON `customers` (`phone`);--> statement-breakpoint
CREATE INDEX `customerIdIdx` ON `leads` (`customerId`);--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `leads` (`userId`);--> statement-breakpoint
CREATE INDEX `stageIdIdx` ON `leads` (`stageId`);--> statement-breakpoint
CREATE INDEX `customerIdIdx` ON `messages` (`customerId`);--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `messages` (`userId`);--> statement-breakpoint
CREATE INDEX `customerIdIdx` ON `purchases` (`customerId`);--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `purchases` (`userId`);--> statement-breakpoint
CREATE INDEX `customerIdIdx` ON `repurchaseNotifications` (`customerId`);--> statement-breakpoint
CREATE INDEX `ruleIdIdx` ON `repurchaseNotifications` (`ruleId`);--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `repurchaseRules` (`userId`);--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `salesFunnelStages` (`userId`);--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `webhookLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `workflowIdIdx` ON `workflowExecutions` (`workflowId`);--> statement-breakpoint
CREATE INDEX `customerIdIdx` ON `workflowExecutions` (`customerId`);--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `workflows` (`userId`);