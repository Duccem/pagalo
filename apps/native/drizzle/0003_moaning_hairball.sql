PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_invoice` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`total` real NOT NULL,
	`vendor` text DEFAULT '' NOT NULL,
	`tax` real NOT NULL,
	`tip` real NOT NULL,
	`date` text DEFAULT '2025-09-15T23:53:24.097Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_invoice`("id", "total", "vendor", "tax", "tip", "date") SELECT "id", "total", "vendor", "tax", "tip", "date" FROM `invoice`;--> statement-breakpoint
DROP TABLE `invoice`;--> statement-breakpoint
ALTER TABLE `__new_invoice` RENAME TO `invoice`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `member_item` ADD `invoice_id` integer NOT NULL REFERENCES invoice(id);