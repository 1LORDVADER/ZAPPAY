CREATE TABLE `wholesalerWaitlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(30),
	`businessType` enum('farmer','dispensary','distributor','transporter','other') NOT NULL,
	`state` varchar(2) NOT NULL,
	`city` varchar(100),
	`licenseNumber` varchar(100),
	`monthlyVolume` varchar(50),
	`message` text,
	`status` enum('pending','contacted','onboarded','declined') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wholesalerWaitlist_id` PRIMARY KEY(`id`)
);
