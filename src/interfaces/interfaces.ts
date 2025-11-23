import { client, facture, minimizedProfessionModel, Produit } from "./models"

export enum userType{
    "ADMIN",
    "SUPERADMIN",
    "USER"
}
export interface LoginResponse{
    token: string,
    user: {
      id: number,
      nom: string,
      email: string,
      role: userType,
      profession: minimizedProfessionModel
    }
}

export interface CommandeResponse{
  id: number,
  idProduit: number,
  idClient: number,
  quantite: number,
  valide: boolean,
  date: Date,
  datePaiement: Date,
  factures: facture[],
  produit: Produit,
  client: client
}

export interface AuthContextType {
  user: { token: string,
      user: {
        id: number,
        nom: string,
        email: string,
        role: userType,
        profession: minimizedProfessionModel
      } 
    } | null;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
}