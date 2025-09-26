PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_invoice` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`total` real NOT NULL,
	`vendor` text DEFAULT '' NOT NULL,
	`tax` real NOT NULL,
	`tip` real NOT NULL,
	`date` text DEFAULT '2025-09-26T18:32:47.521Z' NOT NULL,
	`state` text DEFAULT 'pending' NOT NULL,
	`evenly` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_invoice`("id", "total", "vendor", "tax", "tip", "date", "state", "evenly") SELECT "id", "total", "vendor", "tax", "tip", "date", "state", "evenly" FROM `invoice`;--> statement-breakpoint
DROP TABLE `invoice`;--> statement-breakpoint
ALTER TABLE `__new_invoice` RENAME TO `invoice`;--> statement-breakpoint
PRAGMA foreign_keys=ON;