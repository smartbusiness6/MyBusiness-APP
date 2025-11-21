import { db } from "@/src/db";
import { produit } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { ProductPost } from "../interfaces/interfaces";

export const getAllproducts = async(idCompany:number)=> db.select().from(produit).where(eq(produit.idEntreprise, idCompany)).all();

export const getProductById = async(idCompany:number,idProduct:number)=> await db.select().from(produit).where(and(eq(produit.id,idProduct),eq(produit.idEntreprise,idCompany)))

export const updateProduct = async (idProduit:number,productPost:ProductPost)=>{
    const {idEntreprise,nom,numero,quantite,prix,prixV,type} = productPost
    return await db.update(produit).set({
        nom,
        numero,
        idEntreprise,
        quantite,
        prixAchat:prix,
        prixVente:prixV,
        type
    }).where(
        and(
            eq(produit.id,idProduit),
            eq(produit.idEntreprise,idEntreprise)
        )
    )
}

export const addNewProduct = async (data:ProductPost)=>{
    const {idEntreprise,nom,numero,quantite,prix,type} = data
    return await db.insert(produit).values({
        idEntreprise,
        nom,
        numero,
        quantite,
        prixAchat: prix,
        prixVente: 0,
        type
    })
}
