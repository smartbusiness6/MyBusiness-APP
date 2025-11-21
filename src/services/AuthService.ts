// src/services/auth.service.ts
import jwt from "jsonwebtoken";
import { db } from "../db";
import { utilisateur, profession, entreprise } from "../db/schema";
import { eq } from "drizzle-orm";
import { LoginResponse, userType } from "@/src/interfaces/interfaces";
import { BASE_URL } from "@/config/config";
import bcrypt from "bcrypt"

const JWT_SECRET = "7FUVHVMB!89VA642I0X3C";
const JWT_EXPIRES_IN = "24h";

export class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    email = email.toLowerCase().trim();

    // 1. Connexion réseau
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        return (await res.json()) as LoginResponse;
      }
    } catch (err) {
      console.log("Réseau indisponible → mode local");
    }

    // 2. Connexion locale (fallback)
    try {
      const row = await db
        .select({
          // Champs utilisateur
          id: utilisateur.id,
          nom: utilisateur.nom,
          email: utilisateur.email,
          mdp: utilisateur.mdp,
          role: utilisateur.role,

          // Champs profession
          poste: profession.poste,
          idEntreprise: profession.idEntreprise,

          // Champs entreprise
          entrepriseNom: entreprise.nom,
          entrepriseId: entreprise.id,
          entrepriseMail: entreprise.email,
          entrepriseRef:entreprise.ref,
          entrepriseAct:entreprise.activite
        })
        .from(utilisateur)
        .innerJoin(profession, eq(utilisateur.idProfession, profession.id))
        .innerJoin(entreprise, eq(profession.idEntreprise, entreprise.id))
        .where(eq(utilisateur.email, email))
        .limit(1)
        .then((rows) => rows[0]);

      if (!row) {
        throw new Error("Utilisateur introuvable localement");
      }

      // Comparaison mot de passe (à remplacer par bcrypt plus tard si besoin)
      if (!await(bcrypt.compare(password, row.mdp))) {
        throw new Error("Mot de passe incorrect");
      }

      // Génération du token local
      const token = jwt.sign(
        {
          userId: row.id,
          email: row.email,
          nom: row.nom,
          role: row.role,
          idEntreprise: row.idEntreprise,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Construction EXACTE de LoginResponse
      const loginResponse: LoginResponse = {
        token,
        user: {
          id: row.id,
          nom: row.nom,
          email: row.email,
          role: row.role as userType,
          profession: {
            poste: row.poste,
            idEntreprise: row.idEntreprise,
            entreprise: {
              id: row.entrepriseId,
              nom: row.entrepriseNom,
              email: row.entrepriseMail,
              ref:row.entrepriseRef,
              activite:row.entrepriseAct
            },
          },
        },
      };

      return loginResponse;
    } catch (err: any) {
      throw new Error(err.message || "Connexion impossible");
    }
  }
}