import {  MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, SectionListRenderItem, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../_layout";
import { BASE_URL, setHeader } from "@/config/config";
import { router } from "expo-router";
import { Produit } from "@/src/interfaces/models";
import { AlertModal } from "@/src/components/Modals/Modals";

export default function productForm(){
    const {user} = useAuth()
    const [numero,SetNumero] = useState<string>("")
    const [numeroEmpty,SetNumeroEmpty] = useState<boolean>(false)
    const [nom,setNom] = useState<string>("")
    const [nomEmpty,SetNomEmpty] = useState<boolean>(false)
    const [type,setType] = useState<string>("")
    const [typeEmpty,SetTypeEmpty] = useState<boolean>(false)
    const [quantite,setQuantite] = useState<string>("")
    const [quantiteEmpty,SetQuantiteEmpty] = useState<boolean>(false)
    const [prix,setPrix] = useState<string>("")
    const [prixEmpty,SetPrixEmpty] = useState<boolean>(false)
    const [modal,setModal] = useState<boolean>(false)

    const submit = ()=>{
        if(numeroEmpty || nomEmpty || typeEmpty || quantiteEmpty || prixEmpty){
            Alert.alert("Tous les champs doivent être remplis")
        }else{
            fetch(`${BASE_URL}/stock/produit`,{
                method: "POST",
                headers: setHeader(user?.token!),
                body:JSON.stringify({
                    numero,
                    nom,
                    type,
                    quantite: parseInt(quantite),
                    prix: parseInt(prix),
                    idEntreprise: user?.user.profession.entreprise?.id!
                })
            }).then(async(response)=>{
                console.log(response.status)
                if(response.status === 201){
                    const createdProduct:Produit = await response.json()
                    router.push('/stock')
                }
            })
        }
    }

 


    return <>
        <View style={styles.formContainer}>
            <View style={styles.formBox}>
                <View style={styles.headerTitle}>
                    <Text style={styles.titleForm}>Nouveau produit</Text>
                    <MaterialIcons name="article" size={30} color={"#048c91e5"}/>
                </View>
                <TextInput
                    placeholder="Numéro du produit*"
                    value={numero}
                    onChangeText={SetNumero}
                    style={styles.input}
                    placeholderTextColor={"#666666c0"}
                    onBlur={()=>SetNumeroEmpty(numero.trim()==="")}
                />
                {numeroEmpty && <Text style={styles.errorText}>Vous devez remplir ce champ pour pouvoir continuer</Text>}
                <TextInput
                    placeholder="Nom du produit*"
                    value={nom}
                    onChangeText={setNom}
                    style={styles.input}
                    placeholderTextColor={"#666666c0"}
                    onBlur={()=>SetNomEmpty(nom.trim()==="")}
                />
                {nomEmpty && <Text style={styles.errorText}>Vous devez remplir ce champ pour pouvoir continuer</Text>}
                <TextInput
                    placeholder="Type du produit*"
                    value={type}
                    onChangeText={setType}
                    style={styles.input}
                    placeholderTextColor={"#666666c0"}
                    onBlur={()=>SetTypeEmpty(type.trim()==="")}
                />
                {typeEmpty && <Text style={styles.errorText}>Vous devez remplir ce champ pour pouvoir continuer</Text>}
                <TextInput
                    placeholder="Prix d'achat du produit*"
                    value={prix}
                    onChangeText={setPrix}
                    keyboardType="numeric"
                    style={styles.input}
                    defaultValue="0"
                    placeholderTextColor={"#666666c0"}
                    onBlur={()=>SetPrixEmpty(prix.trim()==="")}
                />
                {prixEmpty && <Text style={styles.errorText}>Vous devez remplir ce champ pour pouvoir continuer</Text>}
                <TextInput
                    placeholder="Quantité*"
                    value={quantite}
                    onChangeText={setQuantite}
                    keyboardType="numeric"
                    style={styles.input}
                    placeholderTextColor={"#666666c0"}
                    defaultValue="0"
                    onBlur={()=>SetQuantiteEmpty(quantite.trim()==="")}
                />
                {quantiteEmpty && <Text style={styles.errorText}>Vous devez remplir ce champ pour pouvoir continuer</Text>}
                <View style={styles.buttons}>
                    <TouchableOpacity 
                        onPress={(e)=>{
                            e.preventDefault()
                            submit()
                        }}
                        style={styles.confirmButton}
                    >
                        <Text style={[styles.buttonText,{color: "#fff"}]}>Confirmer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={(e)=>{
                            e.preventDefault()
                            router.back()
                        }}
                        style={styles.cancelButton}
                    >
                        <Text style={styles.buttonText}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        {
            modal && <AlertModal 
                title="Ajout de produit" 
                text="Ajout de produit réussie"
                closeModal={()=>{
                    setModal(false)
                    router.push('/stock')
                }}
            />
        }
    </>
}

const styles = StyleSheet.create({
    formContainer:{
        flexDirection: "column",
        gap: 15,
        alignItems: "center",
        marginTop: 30
    },
    headerTitle:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20
    },
    titleForm:{
        fontFamily: "sans-serif",
        fontWeight: "condensedBold",
        fontSize: 17
    },
    formBox:{
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        borderRadius: 20,
        backgroundColor: "#e4dfdfb9",
        padding: 12,
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        width: "90%",
        marginTop: 10
    },
    input:{
        padding: 8,
        backgroundColor: "#fff",
        borderRadius: 12,
        width: 330,
        height: 50
    },
    buttons:{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap:40
    },
    confirmButton:{
        padding: 8,
        backgroundColor: "#03a768ff",
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        borderRadius: 12
    },
    cancelButton:{
        padding: 8,
        backgroundColor: "#cedbd6ff",
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        borderRadius: 12
    },
    buttonText:{
        fontWeight: "bold",
        fontSize: 15
    },
    errorText:{
        color: "#ff0000ff",
        fontSize: 11,
        fontWeight: "300",
        textAlign: "center"
    }
})