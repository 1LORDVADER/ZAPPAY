ALTER TABLE `farmerProfiles` ADD `subscriptionTier` enum('free','premium','enterprise') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `farmerProfiles` ADD `subscriptionStatus` enum('active','cancelled','expired') DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `farmerProfiles` ADD `subscriptionExpiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `farmerProfiles` ADD `monthlyRevenue` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `farmerProfiles` ADD `totalSales` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `isFeatured` enum('yes','no') DEFAULT 'no' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `isSponsored` enum('yes','no') DEFAULT 'no' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `views` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `clicks` int DEFAULT 0 NOT NULL;