import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

enum types{
    "alimentaire",
    "construction",
    "scolaire",
    "medicinale",
    "autres"
}
export default function IconDefiner(type:string){
    return <MaterialIcons 
        name={
            type!=="construction" ? "build" : "article"
        }
        size={30}
    />
}