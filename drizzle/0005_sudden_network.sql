ALTER TABLE `products` MODIFY COLUMN `status` enum('active','sold_out','inactive','growing') NOT NULL DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `products` ADD `rating` varchar(5);