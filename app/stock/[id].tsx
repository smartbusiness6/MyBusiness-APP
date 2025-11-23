import { BASE_URL, setHeader } from "@/config/config";
import { Produit } from "@/src/interfaces/models";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useAuth } from "../_layout";

export default function productIdScreen(){
    const { id } = useLocalSearchParams();
    const {user} = useAuth()
    const [product,setProduct] = useState<Produit>()

    useEffect(()=>{
        fetch(`${BASE_URL}/stock/produit/id/${id}`,
            {
                method:"GET",
                headers: setHeader(user?.token!)
            }
        ).then(async (res)=>{
            const body:Produit = await res.json()
            setProduct(body)
        })
    },[])

    return <View>
        <Text>
            {product?.nom}
        </Text>
    </View>
}