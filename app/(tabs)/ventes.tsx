import { BASE_URL } from "@/config/config";
import { CommandeResponse } from "@/src/interfaces/interfaces";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../_layout";

interface Vente {
  id: number;
  produit: string;
  prix: number;
  payed: boolean;
  quantite?: string;
}

const seedData: Vente[] = [
  { id: 1, produit: "Nike Air Force", prix: 40000, payed: true, quantite: "1 pièce" },
  { id: 2, produit: "T-Shirt", prix: 5000, payed: false, quantite: "4 pièces" },
  { id: 3, produit: "Pantalon", prix: 10000, payed: false, quantite: "2 pièces" },
  { id: 4, produit: "Chaussettes", prix: 2000, payed: true, quantite: "100 pièces" },
];

type FilterType = "all" | "paid" | "pending";

export default function VenteScreen() {
  const [filteredData, setFilteredData] = useState<CommandeResponse[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [commandes,setCommande] = useState<CommandeResponse[]>([])
  const {user} = useAuth()

  useEffect(() => {
    applyFilterAndSearch(activeFilter, searchValue);
  }, []);

  useEffect(()=>{
    fetch(`${BASE_URL}/vente/commande`,{
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
      }
    }).then(async (res:Response)=>{
      const commandes:CommandeResponse[] = await res.json()
      setCommande(commandes)
      setFilteredData(commandes)
    }).catch((error:any)=>{
      console.log(error.message)
    })
  },[])

  const applyFilterAndSearch = (filter: FilterType, search: string) => {
    let filtered = [...commandes];

    // Filtre
    if (filter === "paid") filtered = filtered.filter((s) => s.factures[0].payed);
    if (filter === "pending") filtered = filtered.filter((s) => !s.factures[0].payed);

    // Recherche
    if (search.trim()) {
      filtered = filtered.filter((s) =>
        s.produit.nom.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const handleFilter = (filter: FilterType) => {
    setActiveFilter(filter);
    applyFilterAndSearch(filter, searchValue);
  };

  const handleSearch = (text: string) => {
    setSearchValue(text);
    applyFilterAndSearch(activeFilter, text);
  };

  const getStatusStyle = (payed: boolean) => ({
    backgroundColor: payed ? "#d4edda" : "#f8d7da",
    color: payed ? "#155724" : "#721c24",
  });

  const getStatusText = (payed: boolean) => (payed ? "Payée" : "En attente");

  return (
          <View style={styles.container}>
        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Rechercher un produit..."
            style={styles.searchInput}
            value={searchValue}
            onChangeText={handleSearch}
          />
          {searchValue.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <MaterialIcons name="clear" size={22} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtres */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === "all" && styles.filterChipActive]}
            onPress={() => handleFilter("all")}
          >
            <Text style={[styles.filterText, activeFilter === "all" && styles.filterTextActive]}>
              Tous ({commandes.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeFilter === "paid" && styles.filterChipActive]}
            onPress={() => handleFilter("paid")}
          >
            <Text style={[styles.filterText, activeFilter === "paid" && styles.filterTextActive]}>
              Payés ({commandes.filter((s) => s.factures[0].payed).length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeFilter === "pending" && styles.filterChipActive]}
            onPress={() => handleFilter("pending")}
          >
            <Text style={[styles.filterText, activeFilter === "pending" && styles.filterTextActive]}>
              En attente ({commandes.filter((s) => !s.factures[0].payed).length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Liste des ventes */}
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filteredData.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucune vente trouvée</Text>
            </View>
          ) : (
            filteredData.map((vente) => (
              <View key={vente.id} style={styles.card}>
                <View style={styles.cardLeft}>
                  <View style={styles.productImagePlaceholder}>
                    <MaterialIcons name="shopping-bag" size={28} color="#fff" />
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.productName}>{vente.produit.nom}</Text>
                    <Text style={styles.price}>{vente.produit.prixVente.toLocaleString()} Ar</Text>
                  </View>

                  <Text style={styles.quantity}>{vente.quantite}</Text>

                  <View style={styles.cardFooter}>
                    <View style={[styles.statusBadge, getStatusStyle(vente.factures[0].payed)]}>
                      <Text style={styles.statusText}>{getStatusText(vente.factures[0].payed)}</Text>
                    </View>
                    <TouchableOpacity style={styles.viewButton}>
                      <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#e9ecef",
    borderRadius: 25,
    alignItems: "center",
  },
  filterChipActive: {
    backgroundColor: "#007bff",
  },
  filterText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
  },
  list: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardLeft: {
    marginRight: 16,
  },
  productImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  quantity: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  viewButton: {
    padding: 6,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});