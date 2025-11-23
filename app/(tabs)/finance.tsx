// screens/FinanceScreen.tsx
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../_layout";

type FilterType = "MENSUELLE" |"HEBDOMADAIRE"| "ANNUELLE";

export default function FinanceScreen() {
    const { user } = useAuth();
    const [searchValue,setSearchValue] = useState<string>('')
    const [activeFilter, setActiveFilter] = useState<FilterType>("HEBDOMADAIRE");
    const [data,setData] = useState([])
    useEffect(()=>{
        console.log({user})
    },[])

    const handleFilter = (filter: FilterType) => {
        setActiveFilter(filter);
        applyFilterAndSearch(filter, searchValue);
    };

    const applyFilterAndSearch = (filter: FilterType, search: string) => {
        let filtered = [...data];

        // // Filtre
        // if (filter === "HEBDOMADAIRE") filtered = filtered.filter((s) => s.quantite===0);
        // if (filter === "MENSUELLE") filtered = filtered.filter((s) => s.quantite>0 && s.quantite <= 5);
        // if (filter === "ANNUELLE") filtered 

        // // Recherche
        // if (search.trim()) {
        //     filtered = filtered.filter((s) =>
        //         s.nom.toLowerCase().includes(search.toLowerCase())
        //     );
        // }

        // setFilteredData(filtered);
    };

  return (
    <>
        {/* Période */}
        <View style={styles.periodTabs}>
            <TouchableOpacity
                style={[styles.filterChip, activeFilter === "HEBDOMADAIRE" && styles.filterChipActive]}
                onPress={() => handleFilter("HEBDOMADAIRE")}
                >
                <Text style={[styles.filterText, activeFilter === "HEBDOMADAIRE" && styles.filterTextActive]}>
                    Hebdomadaire
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterChip, activeFilter === "MENSUELLE" && styles.filterChipActive]}
                onPress={() => handleFilter("MENSUELLE")}
                >
                <Text style={[styles.filterText, activeFilter === "MENSUELLE" && styles.filterTextActive]}>
                    Mensuelle
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterChip, activeFilter === "ANNUELLE" && styles.filterChipActive]}
                onPress={() => handleFilter("ANNUELLE")}
                >
                <Text style={[styles.filterText, activeFilter === "ANNUELLE" && styles.filterTextActive]}>
                    Annuelle
                </Text>
            </TouchableOpacity>
        </View>

        <ScrollView style={styles.container}>
        {/* Solde actuel */}
        <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Solde actuel</Text>
            <Text style={styles.balanceAmount}>700 000 Ar</Text>
            <Text style={styles.balanceChange}>+26% </Text>
        </View>

        {/* Revenus / Dépenses */}
        <View style={styles.row}>
            <View style={styles.smallCard}>
            <MaterialIcons name="trending-up" size={28} color="#28a745" />
            <Text style={styles.smallCardTitle}>Revenus</Text>
            <Text style={styles.smallCardAmount}>250 000 Ar</Text>
            </View>
            <View style={styles.smallCard}>
            <MaterialIcons name="trending-down" size={28} color="#dc3545" />
            <Text style={styles.smallCardTitle}>Dépenses</Text>
            <Text style={styles.smallCardAmount}>180 000 Ar</Text>
            </View>
        </View>

        {/* Résumé cette semaine */}
        <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Résumé cette semaine</Text>
            <View style={styles.progressItem}>
            <Text>Ventes totales</Text>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "84%" }]} />
            </View>
            <Text style={styles.progressText}>84%</Text>
            </View>
            <View style={styles.progressItem}>
            <Text>Ticket moyen</Text>
            <Text style={styles.progressText}>86 333 Ar</Text>
            </View>
        </View>

        {/* Répartition par catégorie */}
        <View style={styles.categoryCard}>
            <Text style={styles.sectionTitle}>Répartition par catégorie</Text>
            <View style={styles.categoryItem}>
            <View style={[styles.dot, { backgroundColor: "#007bff" }]} />
            <Text>Ventes</Text>
                <Text style={styles.categoryAmount}>250 000 Ar</Text>
            </View>
            <View style={styles.categoryItem}>
            <View style={[styles.dot, { backgroundColor: "#28a745" }]} />
            <Text>Achats</Text>
                <Text style={styles.categoryAmount}>180 000 Ar</Text>
            </View>
        </View>

        {/* Transactions récentes */}
        <View style={styles.transactions}>
            <View style={styles.transactionHeader}>
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
            <TouchableOpacity>
                <Text style={styles.exportText}>Export</Text>
            </TouchableOpacity>
            </View>

            <View style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: "#d4edda" }]}>
                <MaterialIcons name="check-circle" size={20} color="#155724" />
            </View>
            <View>
                <Text>Vente - Ranto Jean</Text>
                <Text style={styles.transactionDate}>Il y a 2h</Text>
            </View>
            <Text style={styles.positive}>+250 000 Ar</Text>
            </View>

            <View style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: "#f8d7da" }]}>
                <MaterialIcons name="cancel" size={20} color="#721c24" />
            </View>
            <View>
                <Text>Achat marchandises</Text>
            </View>
            <Text style={styles.negative}>-180 000 Ar</Text>
            </View>
        </View>
        </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", color: "#007bff" },
  periodTabs: { flexDirection: "row", justifyContent: "space-around", backgroundColor: "#fff", margin: 15, borderRadius: 12, padding: 10 },
  activeTab: { fontWeight: "bold", color: "#007bff", borderBottomWidth: 2, borderColor: "#007bff", paddingBottom: 8 },
  tab: { color: "#888" },
  balanceCard: { margin: 15, borderRadius: 20, padding: 20, backgroundColor: "#00d4ff" },
  balanceLabel: { color: "#fff", fontSize: 16 },
  balanceAmount: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  balanceChange: { color: "#fff", fontSize: 16, marginTop: 5 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 15 },
  smallCard: { backgroundColor: "#fff", padding: 20, borderRadius: 16, width: "48%", alignItems: "center", elevation: 3 },
  smallCardTitle: { marginTop: 10, color: "#666" },
  smallCardAmount: { marginTop: 5, fontSize: 18, fontWeight: "bold" },
  summaryCard: { backgroundColor: "#fff", margin: 15, borderRadius: 16, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  progressItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10 },
  progressBar: { flex: 1, height: 8, backgroundColor: "#eee", borderRadius: 4, marginHorizontal: 10 },
  progressFill: { height: "100%", backgroundColor: "#007bff", borderRadius: 4 },
  progressText: { color: "#007bff", fontWeight: "bold" },
  categoryCard: { backgroundColor: "#fff", margin: 15, borderRadius: 16, padding: 20 },
  categoryItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 8 },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  categoryAmount: { fontWeight: "bold" },
  transactions: { padding: 15 },
  transactionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  exportText: { color: "#007bff" },
  transactionItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 10 },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginRight: 15 },
  transactionDate: { color: "#888", fontSize: 12 },
  positive: { marginLeft: "auto", color: "#28a745", fontWeight: "bold" },
  negative: { marginLeft: "auto", color: "#dc3545", fontWeight: "bold" },
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
});