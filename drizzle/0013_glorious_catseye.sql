CREATE TABLE `referral_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`referral_code` varchar(50) NOT NULL,
	`referred_count` int NOT NULL DEFAULT 0,
	`total_rewards_earned` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referral_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `referral_codes_referral_code_unique` UNIQUE(`referral_code`)
);
--> statement-breakpoint
CREATE TABLE `referral_signups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrer_user_id` int NOT NULL,
	`referred_user_id` int NOT NULL,
	`referral_code` varchar(50) NOT NULL,
	`reward_points` int NOT NULL DEFAULT 500,
	`status` enum('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `referral_signups_id` PRIMARY KEY(`id`)
);
