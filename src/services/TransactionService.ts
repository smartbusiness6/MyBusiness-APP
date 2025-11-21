import { sql } from "drizzle-orm";
import { db } from "../db";
import { transaction } from "../db/schema";
import { Transaction } from "../interfaces/models";
import { date } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/gel-core";

enum transactionType{
    "ENTREE",
    "SORTIE"
}

export const addTransaction = async (data: {
  type: "ENTREE" | "SORTIE";
  quantite: number;
  prixUnitaire: number;
  produitId: number;
  ref?: string;
}) => {
  const result = await db.insert(transaction).values({
    type: data.type,
    quantite: data.quantite,
    prixUnitaire: data.prixUnitaire,
    produitId: data.produitId,
    ref: data.ref || "",
    // date est automatiquement ajoutée grâce au .default(sql`CURRENT_TIMESTAMP`)
  }).returning();

  return result[0];
};