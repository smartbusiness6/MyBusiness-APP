// src/services/facture.service.ts
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { facture, commande, produit } from "../db/schema";
import { Facture } from "../interfaces/interfaces";

interface CurrentUser {
  idEntreprise: number;
  // ... autres champs si besoin
}

export class FactureService {
  /**
   * Liste toutes les factures de l'entreprise de l'utilisateur
   */
  static async list(user: CurrentUser) {
    const fact:any = await db
      .select({
        id: facture.id,
        numero: facture.numero,
        payed: facture.payed,
        retard: facture.retard,
        datePaiement: facture.datePaiement,
        commande: {
          id: commande.id,
          quantite: commande.quantite,
          date: commande.date,
        },
        client:{},
        produit: {
        id: produit.id,
        nom: produit.nom,
        numero: produit.numero,
        prixVente: produit.prixVente,
        }
      })
      .from(facture)
      .innerJoin(commande, eq(facture.idCommande, commande.id))
      .innerJoin(produit, eq(commande.idProduit, produit.id))
      .where(eq(produit.idEntreprise, user.idEntreprise));

      let data:Facture[] = []
    fact.map((f:any)=>{
        data.push({
                id: fact.id,
                numero: fact.numero,
                payed: fact.payed,
                retard: fact.retard,
                datePaiement: fact.datePaiement,
            commande: {
                id: fact.commande.id,
                quantite: fact.commande.quantite,
                date: fact.commande.date,
                client:fact.client,
                produit:{
                    id: fact.produit.id,
                    nom: fact.produit.nom,
                    numero: fact.produit.numero,
                    prixVente: fact.produit.prixVente,
                }
            }
        })
    })

    return data
  }

  /**
   * Marque une facture comme payée
   */
  static async payer(id: number) {
    const updated = await db
      .update(facture)
      .set({
        payed: true,
        datePaiement: new Date(), // ou sql`CURRENT_TIMESTAMP` si tu préfères côté DB
      })
      .where(eq(facture.id, id))
      .returning();

    return updated[0] || null;
  }

  /**
   * Optionnel : Récupérer une facture par ID (avec vérif entreprise)
   */
  static async findById(id: number, user: CurrentUser) {
    const result = await db
      .select()
      .from(facture)
      .innerJoin(commande, eq(facture.idCommande, commande.id))
      .innerJoin(produit, eq(commande.idProduit, produit.id))
      .where(
        and(
          eq(facture.id, id),
          eq(produit.idEntreprise, user.idEntreprise)
        )
      )
      .limit(1);

    return result[0] || null;
  }
}