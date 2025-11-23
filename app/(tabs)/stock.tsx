import { BASE_URL } from "@/config/config";
import ProductCard from "@/src/components/ProductCard";
import { Produit } from "@/src/interfaces/models";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../_layout";

type FilterType = "all" |"low"| "alerted";

export default function stockScreen(){
    const [searchValue,setSearchValue] = useState<string>('')
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    const[data,setData] = useState<Produit[] | []>([])
    const [filteredData,setFilteredData] = useState<Produit[]|[]>([])
    const {user} = useAuth()

    useEffect(()=>{
        fetch(`${BASE_URL}/stock/produit`,{
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
            }
        }).then(async (res:Response)=>{
            const produits:Produit[] = await res.json()
            console.log(produits)
            setData(produits)
            setFilteredData(produits)
        }).catch((error:any)=>{
            console.log(error.message)
        })
    },[])
    const search = (word:string)=>{
        applyFilterAndSearch(activeFilter,word)
    }

     const handleFilter = (filter: FilterType) => {
        setActiveFilter(filter);
        applyFilterAndSearch(filter, searchValue);
    };

    const applyFilterAndSearch = (filter: FilterType, search: string) => {
        let filtered = [...data];

        // Filtre
        if (filter === "alerted") filtered = filtered.filter((s) => s.quantite===0);
        if (filter === "low") filtered = filtered.filter((s) => s.quantite>0 && s.quantite <= 5);
        if (filter === "all") filtered 

        // Recherche
        if (search.trim()) {
            filtered = filtered.filter((s) =>
                s.nom.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredData(filtered);
    };
    return <View>
        <View style={styles.research}>
            <TextInput 
                placeholder="Recherche" 
                style={styles.input}
                value={searchValue}
                onChangeText={setSearchValue}
            />
            <TouchableOpacity
                onPress={()=>search(searchValue)}
            >
                <MaterialIcons name="search" size={22} color={"black"}/>
            </TouchableOpacity>
        </View>
         <View style={styles.filterContainer}>
            <TouchableOpacity
            style={[styles.filterChip, activeFilter === "all" && styles.filterChipActive]}
            onPress={() => handleFilter("all")}
            >
            <Text style={[styles.filterText, activeFilter === "all" && styles.filterTextActive]}>
                Tous ({data.length})
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[styles.filterChip, activeFilter === "low" && styles.filterChipActive]}
            onPress={() => handleFilter("low")}
            >
                <Text style={[styles.filterText, activeFilter === "low" && styles.filterTextActive]}>
                    Faible ({data.filter((s) => s.quantite>0 && s.quantite <= 5).length})
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[styles.filterChip, activeFilter === "alerted" && styles.filterChipActive]}
            onPress={() => handleFilter("alerted")}
            >
            <Text style={[styles.filterText, activeFilter === "alerted" && styles.filterTextActive]}>
                Epuisés ({data.filter((s) => s.quantite === 0).length})
            </Text>
            </TouchableOpacity>
        </View>
        <ScrollView
            style={styles.scrollView}
        >
            {
                filteredData.map((produit,index)=>
                    <ProductCard key={index} produit={produit}/>
                )
            }
        </ScrollView>
    </View>
}

const styles = StyleSheet.create({
    input:{
        padding: 5,
        borderWidth: .4,
        width: "80%",
        borderRadius: 12,
        color: "#302e30a9",
        borderColor: "#302e30a9"
    },
    research:{
        flexDirection:"row",
        justifyContent: "center",
        gap:23,
        alignItems: "center",
        marginTop: 40,
        marginBottom: 20
    },
    searchButton:{
        width: 30,
        height: 30,
        backgroundColor: "#070404ff",
        borderRadius: 50
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        gap: 20,
        maxWidth: 350,
        marginStart: 30
    },
    filterChip: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: "center",
        width:"auto"
    },
    filterChipActive: {
        borderBottomColor: "#05573eff",
        borderBottomWidth: 1
    },
    filterText: {
        fontSize: 14,
        color: "#555",
        fontWeight: "500",
    },
    filterTextActive: {
        color: "#05573eff",
    },
    scrollView:{
        maxHeight: 320,
        paddingStart: 50,
        paddingTop: 10,
        paddingBottom: 10
    }
})