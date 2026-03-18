CREATE TABLE `toolConfigurations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`toolName` varchar(100) NOT NULL,
	`config` json NOT NULL,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `toolConfigurations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `toolConfigurations` (`userId`);--> statement-breakpoint
CREATE INDEX `toolNameIdx` ON `toolConfigurations` (`toolName`);