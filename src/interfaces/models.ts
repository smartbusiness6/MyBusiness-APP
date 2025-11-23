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
    entreprise: entreprise
}

export interface client{
    id: number,
    nom: string,
    email: string,
    telephone: string,
    idEntreprise: number
}