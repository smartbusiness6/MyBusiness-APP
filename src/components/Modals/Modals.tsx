import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Button, Modal, StyleSheet, Text, Touchable, TouchableHighlight, TouchableOpacity, View } from "react-native";

export const AlertModal=({title,text,confirm,closeModal}:{title:string,text:string,confirm:()=>void,closeModal:()=>void})=>{
    return <View style={styles.modalStyle} onPointerDown={()=>closeModal()}>
        <View style={styles.modalContainer}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent:"center",
                    gap: 12,
                    alignItems: "center"
                }}
            >
                <Text style={styles.containerTitle}>{title}</Text>
                <MaterialIcons name="notification-important" size={30} color={"#f10c04ff"}/>
            </View>
            <Text style={styles.containerText}>{text}</Text>
            <TouchableOpacity
                onPress={()=>confirm()}
                style={styles.buttonAccept}
            >
                <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
        </View>
    </View>
}

const styles = StyleSheet.create({
    modalStyle:{
        flex: 1,
        alignSelf: "center",
        height: "100%",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        left: 0,
        backdropFilter: ".1"
    },
    modalContainer:{
        backgroundColor: "#fff",
        borderRadius: 12,
        width: "65%",
        height: "30%",
        padding: 20,
        backdropFilter: ".1",
        boxShadow: "2px 3px #11040488"
    },
    containerTitle:{
        color: "#f10c04ff",
        fontWeight: "bold",
        fontSize: 18
    },
    containerText:{
        textAlign:"center",
        fontSize: 15,
        marginTop: 20
    },
    buttonAccept:{
        padding: 8,
        borderRadius: 8,
        marginTop: 10, 
        width: "auto"
    },
    buttonText:{
        textAlign: "center",
        color: "#070707ff",
        fontSize: 15,
        fontWeight: "bold"
    }
})