ALTER TABLE `cartItems` ADD `isMixed` enum('yes','no') DEFAULT 'no' NOT NULL;--> statement-breakpoint
ALTER TABLE `cartItems` ADD `mixedStrains` text;