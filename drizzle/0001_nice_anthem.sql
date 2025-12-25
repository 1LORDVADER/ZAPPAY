CREATE TABLE `cartItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cartItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consumerProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deliveryAddress` text,
	`city` varchar(100),
	`state` varchar(2),
	`zipCode` varchar(10),
	`preferences` text,
	`ageVerified` enum('yes','no') NOT NULL DEFAULT 'no',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consumerProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `farmerProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`licenseNumber` varchar(100) NOT NULL,
	`state` varchar(2) NOT NULL,
	`city` varchar(100),
	`zipCode` varchar(10),
	`bio` text,
	`verified` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `farmerProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`productStrain` varchar(255),
	`quantity` int NOT NULL,
	`pricePerUnit` int NOT NULL,
	`total` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` varchar(50) NOT NULL,
	`consumerId` int NOT NULL,
	`farmerId` int NOT NULL,
	`status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`subtotal` int NOT NULL,
	`tax` int NOT NULL,
	`platformFee` int NOT NULL,
	`total` int NOT NULL,
	`deliveryAddress` text NOT NULL,
	`deliveryCity` varchar(100),
	`deliveryState` varchar(2),
	`deliveryZipCode` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderId_unique` UNIQUE(`orderId`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`farmerId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`strain` varchar(255) NOT NULL,
	`category` enum('flower','edibles','concentrates','pre-rolls','vapes','other') NOT NULL,
	`thcPercentage` varchar(10),
	`cbdPercentage` varchar(10),
	`price` int NOT NULL,
	`quantity` int NOT NULL,
	`unit` varchar(20) NOT NULL DEFAULT 'gram',
	`description` text,
	`photos` text,
	`status` enum('active','sold_out','inactive') NOT NULL DEFAULT 'active',
	`isPreOrder` enum('yes','no') NOT NULL DEFAULT 'no',
	`estimatedHarvestDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`consumerId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`stripePaymentId` varchar(255),
	`amount` int NOT NULL,
	`status` enum('pending','succeeded','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','farmer','consumer','dispensary','transporter') NOT NULL DEFAULT 'consumer';