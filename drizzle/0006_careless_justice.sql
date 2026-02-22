CREATE TABLE `commissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`salesRepId` int NOT NULL,
	`farmerId` int NOT NULL,
	`type` enum('signup_bonus','recurring_monthly') NOT NULL,
	`amount` int NOT NULL,
	`status` enum('pending','approved','paid','cancelled') NOT NULL DEFAULT 'pending',
	`subscriptionMonth` int,
	`paidAt` timestamp,
	`stripePayoutId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `commissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `farmerSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`farmerId` int NOT NULL,
	`tier` enum('standard','premium') NOT NULL,
	`status` enum('active','cancelled','expired','trial') NOT NULL DEFAULT 'trial',
	`billingCycle` enum('monthly','annual') NOT NULL DEFAULT 'monthly',
	`monthlyPrice` int NOT NULL,
	`trialEndsAt` timestamp,
	`currentPeriodStart` timestamp NOT NULL,
	`currentPeriodEnd` timestamp NOT NULL,
	`cancelledAt` timestamp,
	`stripeSubscriptionId` varchar(255),
	`referredBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `farmerSubscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`salesRepId` int NOT NULL,
	`farmerId` int NOT NULL,
	`referralCode` varchar(20) NOT NULL,
	`status` enum('pending','converted','expired','rejected') NOT NULL DEFAULT 'pending',
	`convertedAt` timestamp,
	`subscriptionTier` enum('standard','premium'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salesReps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`referralCode` varchar(20) NOT NULL,
	`status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
	`totalReferrals` int NOT NULL DEFAULT 0,
	`activeReferrals` int NOT NULL DEFAULT 0,
	`totalCommissionsEarned` int NOT NULL DEFAULT 0,
	`pendingCommissions` int NOT NULL DEFAULT 0,
	`paidCommissions` int NOT NULL DEFAULT 0,
	`stripeAccountId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salesReps_id` PRIMARY KEY(`id`),
	CONSTRAINT `salesReps_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
ALTER TABLE `farmerProfiles` MODIFY COLUMN `subscriptionTier` enum('trial','standard','premium') NOT NULL DEFAULT 'trial';