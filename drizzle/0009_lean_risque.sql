CREATE TABLE `salesRepApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`location` varchar(255) NOT NULL,
	`experience` varchar(50) NOT NULL,
	`linkedinUrl` text,
	`resume` text,
	`whyJoin` text NOT NULL,
	`status` enum('pending_approval','approved','rejected') NOT NULL DEFAULT 'pending_approval',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salesRepApplications_id` PRIMARY KEY(`id`)
);
