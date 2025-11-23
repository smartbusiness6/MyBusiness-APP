import { BASE_URL } from "@/config/config";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../_layout";

type FilterType = "all" | "low" | "alerted";

export default function rhScreen() {
    const [searchValue, setSearchValue] = useState<string>("")
    const [activeFilter, setActiveFilter] = useState<FilterType>("all")
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [data,setData] = useState<any[]>([])
    const { user } = useAuth()

    useEffect(() => {
        fetch(`${BASE_URL}/rh/staff`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                }
            }
        ).then(async (response) => {
            const body = await response.json()
            console.log(body)
            setData(body)
            setFilteredData(body)
        })
    }, [])

    const search = (word: string) => {
        applyFilterAndSearch(activeFilter, word)
    }

    const handleFilter = (filter: FilterType) => {
        setActiveFilter(filter);
        applyFilterAndSearch(filter, searchValue);
    };

    const applyFilterAndSearch = (filter: FilterType, search: string) => {
        // let filtered = [];

        // // Filtre
        // if (filter === "alerted") filtered = filtered.filter((s) => s.quantite === 0);
        // if (filter === "low") filtered = filtered.filter((s) => s.quantite > 0 && s.quantite <= 5);
        // if (filter === "all") filtered

        // // Recherche
        // if (search.trim()) {
        //     filtered = filtered.filter((s) =>
        //         s.nom.toLowerCase().includes(search.toLowerCase())
        //     );
        // }

        // setFilteredData(filtered);
    };
    return <View>
        <ScrollView horizontal style={styles.statsCard}>
            <View style={styles.statCard}>
                <MaterialIcons name="people" size={30} color={"#ffff"} />
                <View>
                    <Text style={styles.titleStat}>Employés actifs</Text>
                    <Text style={styles.valueStat}>3</Text>
                </View>
            </View>
            <View style={styles.statCard}>
                <MaterialIcons name="money" size={30} color={"#ffff"} />
                <View>
                    <Text style={styles.titleStat}>Masse salariale</Text>
                    <Text style={styles.valueStat}>2 250 000 Ar</Text>
                </View>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#3cc3dbb7", marginStart: 30 }]}>
                <MaterialIcons name="people" size={30} color={"#ffff"} />
                <View>
                    <Text style={styles.titleStat}>Employés actifs</Text>
                    <Text style={styles.valueStat}>3</Text>
                </View>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#dba33cb7" }]}>
                <MaterialIcons name="money" size={30} color={"#ffff"} />
                <View>
                    <Text style={styles.titleStat}>Masse salariale</Text>
                    <Text style={styles.valueStat}>2 250 000 Ar</Text>
                </View>
            </View>
        </ScrollView>
        {/* <View style={styles.titleList}>
            <Text style={styles.title}>Personnel ({data.length})</Text>
            <TouchableOpacity>
                <MaterialIcons name="expand" color={"#3cc3dbb7"} size={30}/>
            </TouchableOpacity>
        </View> */}
        <View style={styles.research}>
            <TextInput
                placeholder="Recherche"
                style={styles.input}
                value={searchValue}
                onChangeText={setSearchValue}
            />
            <TouchableOpacity
                onPress={() => search(searchValue)}
            >
                <MaterialIcons name="search" size={22} color={"black"} />
            </TouchableOpacity>
        </View>
        <View style={styles.filterContainer}>
            <TouchableOpacity
                style={[styles.filterChip, activeFilter === "all" && styles.filterChipActive]}
                onPress={() => handleFilter("all")}
            >
                <Text style={[styles.filterText, activeFilter === "all" && styles.filterTextActive]}>
                    Tous
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.filterChip, activeFilter === "low" && styles.filterChipActive]}
                onPress={() => handleFilter("low")}
            >
                <Text style={[styles.filterText, activeFilter === "low" && styles.filterTextActive]}>
                    Actifs
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.filterChip, activeFilter === "alerted" && styles.filterChipActive]}
                onPress={() => handleFilter("alerted")}
            >
                <Text style={[styles.filterText, activeFilter === "alerted" && styles.filterTextActive]}>
                    Inactifs
                </Text>
            </TouchableOpacity>
        </View>
        <ScrollView style={{height: 160}}>
            {filteredData.map((emp,index)=>
                <View key={index} style={styles.employeeCard}>
                    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                        <MaterialIcons name="people" size={30} color={"#000"}/>
                        <Text>{emp.nom}</Text>
                        <MaterialIcons name="phone" size={30} color={"#000"}/>
                    </View>
                    <View>
                        <Text><MaterialIcons name="email" size={20}/>{emp.email}</Text>
                        <Text><MaterialIcons name="wallet" size={20}/>{emp.profession.poste}</Text>
                    </View>
                    <View></View>
                </View>
            )}
        </ScrollView>
    </View>
}

const styles = StyleSheet.create({
    input: {
        padding: 5,
        borderWidth: .4,
        width: "80%",
        borderRadius: 12,
        color: "#302e30a9",
        borderColor: "#302e30a9"
    },
    research: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 23,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20
    },
    searchButton: {
        width: 30,
        height: 30,
        backgroundColor: "#070404ff",
        borderRadius: 50
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        gap: 20,
        maxWidth: 350,
        marginStart: 30
    },
    filterChip: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: "center",
        width: "auto"
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
    statsCard: {
        flex: 1,
        paddingStart: 30,
        paddingTop:10,
        paddingBottom: 60
    },
    statCard: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#18e2a6ff",
        borderRadius: 12,
        height: 100,
        width: 170,
        marginRight: 20
    },
    titleStat: {
        color: "#ffff",
        fontWeight: "200",
        fontSize: 12
    },
    valueStat: {
        color: "#ffff",
        fontWeight: "bold",
        fontSize: 13
    },
    titleList:{
        flexDirection: "row",
        justifyContent:"space-between",
        marginTop: 40
    },
    title:{
        fontWeight: "bold"
    },
    employeeCard:{
        backgroundColor:"#c9c2c4ff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    }
})