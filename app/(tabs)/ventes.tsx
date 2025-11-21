// app/(tabs)/ventes.tsx
import { BASE_URL } from "@/config/config";
import CommandCard from "@/src/components/CommandCard";
import { CommandeResponse } from "@/src/interfaces/interfaces";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../_layout";

type FilterType = "all" | "paid" | "pending";

export default function VentesScreen() {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState<CommandeResponse[]>([]);
  const [filteredData, setFilteredData] = useState<CommandeResponse[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);

  // Charger les commandes
  useEffect(() => {
    fetch(`${BASE_URL}/vente/commande`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data: CommandeResponse[]) => {
        setCommandes(data);
        setFilteredData(data);
      })
      .catch((err) => console.log("Erreur chargement commandes:", err))
      .finally(() => setLoading(false));
  }, [user?.token]);

  // Filtre + recherche
  const applyFilterAndSearch = (filter: FilterType, search: string) => {
    let filtered = [...commandes];

    if (filter === "paid") filtered = filtered.filter((c) => c.factures[0]?.payed);
    if (filter === "pending") filtered = filtered.filter((c) => !c.factures[0]?.payed);

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter((c) =>
        c.produit.nom.toLowerCase().includes(query) ||
        c.client?.nom?.toLowerCase().includes(query)
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

  const paidCount = commandes.filter((c) => c.factures[0]?.payed).length;
  const pendingCount = commandes.filter((c) => !c.factures[0]?.payed).length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#05aa65" />
        <Text style={styles.loadingText}>Chargement des ventes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="shopping-bag" size={32} color="#05aa65" />
        <Text style={styles.title}>Mes Ventes</Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Rechercher un produit ou client..."
          style={styles.searchInput}
          value={searchValue}
          onChangeText={handleSearch}
          placeholderTextColor="#aaa"
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
          <MaterialIcons
            name="check-circle"
            size={18}
            color={activeFilter === "paid" ? "#fff" : "#05aa65"}
            style={styles.filterIcon}
          />
          <Text style={[styles.filterText, activeFilter === "paid" && styles.filterTextActive]}>
            Payées ({paidCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, activeFilter === "pending" && styles.filterChipActive]}
          onPress={() => handleFilter("pending")}
        >
          <MaterialIcons
            name="schedule"
            size={18}
            color={activeFilter === "pending" ? "#fff" : "#e67e22"}
            style={styles.filterIcon}
          />
          <Text style={[styles.filterText, activeFilter === "pending" && styles.filterTextActive]}>
            En attente ({pendingCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {filteredData.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory-2" size={64} color="#ddd" />
            <Text style={styles.emptyTitle}>Aucune vente trouvée</Text>
            <Text style={styles.emptySubtitle}>
              {searchValue ? "Essayez une autre recherche" : "Les ventes apparaîtront ici"}
            </Text>
          </View>
        ) : (
          filteredData.map((commande) => (
            <CommandCard
              key={commande.id}
              vente={commande}
              viewCommand={() => router.push(`/commande/${commande.id}`)}
            />
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
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#05aa65",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  filterChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  filterChipActive: {
    backgroundColor: "#05aa65",
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  filterTextActive: {
    color: "#fff",
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#999",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#bbb",
    marginTop: 8,
  },
});