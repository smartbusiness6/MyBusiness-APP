import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Produit } from "../interfaces/models";
import { router, useNavigation } from "expo-router";

export default function ProductCard({key,produit}:{key:number,produit:Produit}){


    return <TouchableOpacity 
        key={key}
        onPress={()=>router.push(`/stock/${produit.id}`)}
    >
        <View style={styles.cardProduct}>
            <Text>
                <MaterialIcons name="list" size={50}/>
            </Text>
            <View style={styles.cardDetails}>
                <Text>{produit.nom}</Text>
                <Text>
                Prix:  {produit.prixAchat} Ar
                </Text>
                <Text>
                Sold:  {produit.prixVente} Ar
                </Text>
                <Text>
                Quantity:  {produit.quantite}
                </Text>
            </View>
            <TouchableOpacity>
                <MaterialIcons name="add" size={22} color={"#08803eff"}/>
            </TouchableOpacity>
        </View>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    cardProduct:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent: "space-around",
        padding: 12,
        marginBottom: 20,
        width: "90%",
        borderRadius: 12,
        boxShadow: ".5px .3px black"
    },
    cardDetails:{

    }
})