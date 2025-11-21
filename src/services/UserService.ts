import { db } from "../db";
import { entreprise, pointage, profession, utilisateur } from "../db/schema";
import { eq, and } from "drizzle-orm";

// 1. Tous les employés de l’entreprise
  export const getAllUsers = async (entrepriseId: number)=>{
    return await db
      .select({
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role,
        poste: profession.poste,
        salaire: profession.salaire,
      })
      .from(utilisateur)
      .innerJoin(profession, eq(utilisateur.idProfession, profession.id))
      .where(eq(profession.idEntreprise, entrepriseId))
      .orderBy(utilisateur.nom);
  }

  export const getUserbyId = async (id: number, entrepriseId: number)=>{
    const result = await db
      .select({
        nom: utilisateur.nom,
        email: utilisateur.email,
        poste: profession.poste,
        salaire: profession.salaire,
        entreprise: entreprise,
      })
      .from(utilisateur)
      .innerJoin(profession, eq(utilisateur.idProfession, profession.id))
      .innerJoin(entreprise,eq(profession.idEntreprise,entreprise.id))
      .where(and(eq(utilisateur.id, id), eq(profession.idEntreprise, entrepriseId)))
      .limit(1);
    return result[0]
  }