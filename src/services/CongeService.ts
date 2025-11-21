// src/services/local/CongeLocalService.ts
import { db } from "@/src/db";
import { conge, activities } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { Alert } from "react-native";

export interface CongeData {
  idUser: number;
  dateDebut: string; // "2025-04-01"
  dateFin: string;   // "2025-04-10"
}

export default class CongeLocalService {

  // Ajouter un congé
  static async ajouterConge(data: CongeData): Promise<any> {
    const { idUser, dateDebut, dateFin } = data;

    try {
      // Vérifie que l'utilisateur existe dans la même entreprise (simulé localement)
      // Tu peux avoir une table utilisateurs locale aussi
      const utilisateurExiste = true; // À adapter avec ta table users locale

      if (!utilisateurExiste) {
        throw new Error("Utilisateur introuvable dans votre entreprise.");
      }

      const nouveauConge = {
        idUser,
        dateDebut,
        dateFin,
      };

     const congeN = await db.insert(conge).values({
        idUser: nouveauConge.idUser,
        dateDebut: nouveauConge.dateDebut,
        dateFin: nouveauConge.dateFin,
    }).returning();

    if (!conge) {
    throw new Error("Échec de la création du congé");
    }

      // Sauvegarde l'activité
      await db.insert(activities).values({
        idUser: this.currentUser.userId,
        action: JSON.stringify({
          type: "Validation de congé",
          data: conge,
          date: new Date().toISOString(),
        }),
      });

      Alert.alert("Succès", "Congé ajouté avec succès");
      return congeConcerned;
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible d'ajouter le congé");
      throw error;
    }
  }

  // Annuler un congé
  static async annulerConge(id: number): Promise<any> {
    try {
      // Vérifie que le congé appartient bien à l'entreprise
      const c = await db
        .select()
        .from(conge)
        .where(eq(conge.id, id))
        .get();

      if (!c) {
        throw new Error("Congé introuvable");
      }

      // Optionnel : vérifier que l'utilisateur est dans la même entreprise
      // (via table utilisateurs locale)

      const deletedConge = await db.delete(conge).where(eq(conge.id, id)).returning().get();

      // Sauvegarde l'annulation dans l'historique
      await db.insert(activities).values({
        idUser: this.currentUser.userId,
        action: JSON.stringify({
          type: "Annulation de congé",
          data: deletedConge,
          date: new Date().toISOString(),
        }),
        date: new Date()
      });

      Alert.alert("Succès", "Congé annulé");
      return deletedConge;
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible d'annuler le congé");
      throw error;
    }
  }

  // Lister tous les congés (optionnel)
  static async getAllConges(): Promise<any[]> {
    return await db.select().from(conge).all();
  }

  // Récupérer les activités (historique)
  static async getHistoriqueConges(): Promise<any[]> {
    return db
        .select()
        .from(activities)
        .where(
            and(
                eq(activities.idUser, this.currentUser.userId)
            )
        )
        .orderBy(activities.date)
        .all();
  }
}