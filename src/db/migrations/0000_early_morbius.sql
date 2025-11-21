CREATE TABLE `abonnement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`idOffre` integer NOT NULL,
	`idEntreprise` integer NOT NULL,
	`date` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`endDate` integer NOT NULL,
	FOREIGN KEY (`idOffre`) REFERENCES `offre`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idEntreprise`) REFERENCES `entreprises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `abonnement_reference_unique` ON `abonnement` (`reference`);--> statement-breakpoint
CREATE TABLE `activites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idUser` integer NOT NULL,
	`action` text NOT NULL,
	`date` integer NOT NULL,
	`superAdmin` integer NOT NULL,
	FOREIGN KEY (`idUser`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `archives` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idActivity` integer NOT NULL,
	`dataType` text NOT NULL,
	`data` text NOT NULL,
	`date` integer NOT NULL,
	`expiration` integer NOT NULL,
	FOREIGN KEY (`idActivity`) REFERENCES `activites`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `authentications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idUser` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`loginAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`logoutAt` integer,
	`token` text,
	`success` integer DEFAULT true,
	FOREIGN KEY (`idUser`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `blacklist` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`expired` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`email` text NOT NULL,
	`telephone` text NOT NULL,
	`idEntreprise` integer NOT NULL,
	FOREIGN KEY (`idEntreprise`) REFERENCES `entreprises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_email_unique` ON `clients` (`email`);--> statement-breakpoint
CREATE TABLE `commandes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idProduit` integer NOT NULL,
	`idClient` integer NOT NULL,
	`quantite` integer NOT NULL,
	`valide` integer NOT NULL,
	`date` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`datePaiement` integer NOT NULL,
	FOREIGN KEY (`idProduit`) REFERENCES `produits`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idClient`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `companymailer` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `companymailer_email_unique` ON `companymailer` (`email`);--> statement-breakpoint
CREATE TABLE `conge` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idUser` integer NOT NULL,
	`dateDebut` integer NOT NULL,
	`dateFin` integer NOT NULL,
	FOREIGN KEY (`idUser`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `entreprises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`email` text NOT NULL,
	`ref` text NOT NULL,
	`activite` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entreprises_email_unique` ON `entreprises` (`email`);--> statement-breakpoint
CREATE TABLE `facture` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`numero` text NOT NULL,
	`idCommande` integer NOT NULL,
	`datePaiement` integer NOT NULL,
	`payed` integer NOT NULL,
	`retard` integer NOT NULL,
	FOREIGN KEY (`idCommande`) REFERENCES `commandes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `facture_numero_unique` ON `facture` (`numero`);--> statement-breakpoint
CREATE TABLE `offre` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`duree` text NOT NULL,
	`montant` integer NOT NULL,
	`services` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `passwordreset` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`code` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`used` integer DEFAULT false,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `passwordreset_code_unique` ON `passwordreset` (`code`);--> statement-breakpoint
CREATE TABLE `pointages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`in` integer NOT NULL,
	`out` integer NOT NULL,
	`duration` integer DEFAULT 0,
	`idUser` integer NOT NULL,
	FOREIGN KEY (`idUser`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `produits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`numero` text NOT NULL,
	`nom` text NOT NULL,
	`prixAchat` integer DEFAULT 0 NOT NULL,
	`prixVente` integer DEFAULT 0 NOT NULL,
	`type` text NOT NULL,
	`quantite` integer DEFAULT 0 NOT NULL,
	`idEntreprise` integer NOT NULL,
	FOREIGN KEY (`idEntreprise`) REFERENCES `entreprises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `produits_numero_unique` ON `produits` (`numero`);--> statement-breakpoint
CREATE TABLE `professions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`poste` text NOT NULL,
	`salaire` integer NOT NULL,
	`idEntreprise` integer NOT NULL,
	FOREIGN KEY (`idEntreprise`) REFERENCES `entreprises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`quantite` integer NOT NULL,
	`prixUnitaire` integer NOT NULL,
	`date` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`produitId` integer NOT NULL,
	`ref` text DEFAULT '',
	FOREIGN KEY (`produitId`) REFERENCES `produits`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `utilisateurs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`email` text NOT NULL,
	`mdp` text NOT NULL,
	`role` text NOT NULL,
	`idProfession` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `utilisateurs_email_unique` ON `utilisateurs` (`email`);