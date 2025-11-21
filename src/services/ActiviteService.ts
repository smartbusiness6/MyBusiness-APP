import { db } from "@/src/db";
import { activities, produit, utilisateur } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export const getAllActivities = async(idUser:number)=> await db.select().from(activities).where(eq(activities.idUser, idUser));


export const createActivity = async(idUser:number,action:string) =>{
    const user = db.select().from(utilisateur).where(eq(utilisateur.id,idUser)).get()
    return await db.insert(activities).values({
        idUser,
        action,
        superAdmin: user?.role.toString()==="SUPERADMIN"
    })
}