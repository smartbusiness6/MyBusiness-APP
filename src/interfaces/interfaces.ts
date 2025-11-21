import { activite, client, Commande, conges, facture, minimizedProfessionModel, Produit, Profession, Transaction } from "./models"

export enum userType {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}
export interface LoginResponse {
  token: string,
  user: {
    id: number,
    nom: string,
    email: string,
    role: userType,
    profession: minimizedProfessionModel
  }
}

export interface CommandeResponse {
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
  user: {
    token: string,
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

export interface identifiedProduct {
  nom: string,
  numero: string,
  prixAchat: number,
  prixVente: number,
  quantite: number,
  type: string,
  transactions: Transaction[],
  commandes: Commande[]
}

export interface Personnel {
  id: number,
  nom: string,
  email: string,
  role: userType,
  profession: {
    poste: string,
    salaire: number
  },
  conges: conges[]
}

export interface ProfessionGet extends Profession {
  utilisateurs: [
    {
      nom: string
      email: string,
      role: userType
    }
  ]
}

export interface userById {
  nom: string,
  email: string,
  profession: Profession,
  activities: activite[]
}

export interface synthetisedActivite {
  id: number,
  idUser: number,
  action: { type: string, data: Object },
  date: Date,
  superAdmin: boolean
}

export interface ProductPost {
  nom: string,
  numero: string,
  quantite: number,
  prix: number,
  idEntreprise: number,
  type: string,
  prixV?: number
}

export interface Facture {
  id: number,
  numero: number,
  payed: boolean,
  retard: boolean,
  datePaiement: Date,
  commande: {
    id: number,
    quantite: number,
    date: Date,
    client: client,
    produit: {
      id: number,
      nom: string,
      numero: string,
      prixVente: number,
    }
  }
}