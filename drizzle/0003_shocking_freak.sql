CREATE TABLE `rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`keywords` json NOT NULL,
	`response` text NOT NULL,
	`action` varchar(100),
	`active` boolean NOT NULL DEFAULT true,
	`priority` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `rulesUserIdIdx` ON `rules` (`userId`);--> statement-breakpoint
CREATE INDEX `rulesActiveIdx` ON `rules` (`active`);