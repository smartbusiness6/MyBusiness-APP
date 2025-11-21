export interface Produit{
    id: number,
    numero: string,
    nom: string,
    prixAchat: number,
    prixVente: number,
    type: string,
    quantite: number,
    idEntreprise: number
}

export enum TransactionType{
    "ENTREE",
    "SORTIE"
}

export interface Transaction{
    id: number;
    produitId: number;
    type: TransactionType;
    quantite: number;
    date: Date;
    prixUnitaire: number;
    ref: string;
}

export interface Commande{
    id:number
    idProduit:number
    idClient :number
    quantite :number
    valide : Boolean
    date :Date
    datePaiement:Date
}

export interface facture{
    id: number,
    numero: string,
    idCommande: number,
    datePaiement: Date,
    payed: boolean,
    retard: boolean
}

export interface entreprise{
    id: number,
    nom: string,
    email: string,
    ref: string,
    activite: string
}

export interface minimizedProfessionModel{
    poste: string,
    entreprise?: entreprise
    idEntreprise?: number
}

export interface client{
    id: number,
    nom: string,
    email: string,
    telephone: string,
    idEntreprise: number
}

export interface conges{
    id   :number
    idUser :number
    dateDebut: Date
    dateFin: Date
}

export interface Profession{
    id: number,
    poste: string,
    salaire: number,
    idEntreprise: number
}

export interface activite{
    id: number,
    idUser: number,
    action: string,
    date: Date,
    superAdmin: boolean
}