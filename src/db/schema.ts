// src/db/schema.ts
import { sql } from "drizzle-orm";
import { date } from "drizzle-orm/mysql-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Enums
export const DureeAbonnement = {
  MENSUELLE: "MENSUELLE",
  ANNUELLE: "ANNUELLE",
} as const;

export const Role = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export const TransactionType = {
  ENTREE: "ENTREE",
  SORTIE: "SORTIE",
} as const;

export const DataType = {
  USER: "USER",
  PROFESSION: "PROFESSION",
  PRODUCT: "PRODUCT",
  TRANSACTION: "TRANSACTION",
  COMMAND: "COMMAND",
} as const;

// Tables
export const companyMailer = sqliteTable("companymailer", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const entreprise = sqliteTable("entreprises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  email: text("email").notNull().unique(),
  ref: text("ref").notNull(),
  activite: text("activite").notNull(),
});

export const offre = sqliteTable("offre", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  duree: text("duree").$type<"MENSUELLE" | "ANNUELLE">().notNull(),
  montant: integer("montant").notNull(),
  services: text("services").notNull(),
});

export const abonnement = sqliteTable("abonnement", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  idOffre: integer("idOffre").notNull().references(() => offre.id),
  idEntreprise: integer("idEntreprise").notNull().references(() => entreprise.id),
  date: integer("date", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  endDate: integer("endDate", { mode: "timestamp" }).notNull(),
});

export const utilisateur = sqliteTable("utilisateurs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  email: text("email").notNull().unique(),
  mdp: text("mdp").notNull(),
  role: text("role").$type<"SUPERADMIN" | "ADMIN" | "USER">().notNull(),
  idProfession: integer("idProfession").notNull(),
});

export const conge = sqliteTable("conge", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  idUser: integer("idUser").notNull().references(() => utilisateur.id),
  dateDebut: integer("dateDebut", { mode: "timestamp" }).notNull(),
  dateFin: integer("dateFin", { mode: "timestamp" }).notNull(),
});

export const client = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  email: text("email").notNull().unique(),
  telephone: text("telephone").notNull(),
  idEntreprise: integer("idEntreprise").notNull().references(() => entreprise.id),
});

export const produit = sqliteTable("produits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  numero: text("numero").notNull().unique(),
  nom: text("nom").notNull(),
  prixAchat: integer("prixAchat").notNull().default(0),
  prixVente: integer("prixVente").notNull().default(0),
  type: text("type").notNull(),
  quantite: integer("quantite").notNull().default(0),
  idEntreprise: integer("idEntreprise").notNull().references(() => entreprise.id),
});

export const commande = sqliteTable("commandes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  idProduit: integer("idProduit").notNull().references(() => produit.id),
  idClient: integer("idClient").notNull().references(() => client.id),
  quantite: integer("quantite").notNull(),
  valide: integer("valide", { mode: "boolean" }).notNull(),
  date: integer("date", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  datePaiement: integer("datePaiement", { mode: "timestamp" }).notNull(),
});

export const facture = sqliteTable("facture", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  numero: text("numero").notNull().unique(),
  idCommande: integer("idCommande").notNull().references(() => commande.id),
  datePaiement: integer("datePaiement", { mode: "timestamp" }).notNull(),
  payed: integer("payed", { mode: "boolean" }).notNull(),
  retard: integer("retard", { mode: "boolean" }).notNull(),
});

export const transaction = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").$type<"ENTREE" | "SORTIE">().notNull(),
  quantite: integer("quantite").notNull(),
  prixUnitaire: integer("prixUnitaire").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  produitId: integer("produitId").notNull().references(() => produit.id),
  ref: text("ref").default(""),
});

export const pointage = sqliteTable("pointages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  in: integer("in", { mode: "timestamp" }).notNull(),
  out: integer("out", { mode: "timestamp" }).notNull(),
  duration: integer("duration").default(0),
  idUser: integer("idUser").notNull().references(() => utilisateur.id),
});

export const profession = sqliteTable("professions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  poste: text("poste").notNull(),
  salaire: integer("salaire").notNull(),
  idEntreprise: integer("idEntreprise").notNull().references(() => entreprise.id),
});

export const activities = sqliteTable("activites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  idUser: integer("idUser").notNull().references(() => utilisateur.id),
  action: text("action").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  superAdmin: integer("superAdmin", { mode: "boolean" }).notNull(),
});

export const archives = sqliteTable("archives", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  idActivity: integer("idActivity").notNull().references(() => activities.id),
  dataType: text("dataType").$type<"USER" | "PROFESSION" | "PRODUCT" | "TRANSACTION" | "COMMAND">().notNull(),
  data: text("data").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  expiration: integer("expiration", { mode: "timestamp" }).notNull(),
});

export const authentications = sqliteTable("authentications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  idUser: integer("idUser").notNull().references(() => utilisateur.id),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  loginAt: integer("loginAt", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  logoutAt: integer("logoutAt", { mode: "timestamp" }),
  token: text("token"),
  success: integer("success", { mode: "boolean" }).default(true),
});

export const blacklistedTokens = sqliteTable("blacklist", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  token: text("token").notNull(),
  expired: integer("expired", { mode: "timestamp" }).notNull(),
});

export const passwordReset = sqliteTable("passwordreset", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  code: text("code").notNull().unique(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  used: integer("used", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const syncTable = sqliteTable("synctable", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dataType: text("dataType").$type<"USER" | "PROFESSION" | "PRODUCT" | "TRANSACTION" | "COMMAND" | "ACTIVITY" | "ARCHIVE" | "CLIENT">().notNull(),
  data: text("data").notNull(),
  idEntreprise: integer("identreprise"),
  action: text("action"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const syncHistory = sqliteTable("synchistory",{
  id: integer("id").primaryKey({ autoIncrement: true }),
  synctype: text("dataType").$type<"PULL" | "PUSH">().notNull(),
  dateSync: integer("datesync", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
})