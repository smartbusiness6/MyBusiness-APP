// app/stock/index.tsx
import { BASE_URL } from "@/config/config";
import ProductCard from "@/src/components/ProductCard";
import { Produit } from "@/src/interfaces/models";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../_layout";
import { router } from "expo-router";

type FilterType = "all" | "low" | "alerted";

export default function StockScreen() {
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [data, setData] = useState<Produit[]>([]);
  const [filteredData, setFilteredData] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const loadProducts = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await fetch(`${BASE_URL}/stock/produit`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) throw new Error("Erreur de chargement");

      const produits: Produit[] = await res.json();
      setData(produits);
      setFilteredData(produits);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.token) loadProducts();
  }, [user?.token]);

  const applyFilterAndSearch = (filter: FilterType, search: string) => {
    let filtered = [...data];

    if (filter === "alerted") filtered = filtered.filter((p) => p.quantite === 0);
    if (filter === "low") filtered = filtered.filter((p) => p.quantite > 0 && p.quantite <= 5);

    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.nom.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const handleSearch = () => applyFilterAndSearch(activeFilter, searchValue);
  const handleFilter = (filter: FilterType) => {
    setActiveFilter(filter);
    applyFilterAndSearch(filter, searchValue);
  };

  // Stats
  const total = data.length;
  const lowStock = data.filter((p) => p.quantite > 0 && p.quantite <= 5).length;
  const outOfStock = data.filter((p) => p.quantite === 0).length;

  return (
    <View style={styles.container}>

      {/* Recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={24} color="#666" />
          <TextInput
            placeholder="Rechercher un produit..."
            value={searchValue}
            onChangeText={setSearchValue}
            onSubmitEditing={handleSearch}
            style={styles.searchInput}
          />
          {searchValue ? (
            <TouchableOpacity onPress={() => { setSearchValue(""); handleSearch(); }}>
              <MaterialIcons name="clear" size={22} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filtres */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === "all" && styles.activeChip]}
          onPress={() => handleFilter("all")}
        >
          <Text style={[styles.filterText, activeFilter === "all" && styles.activeText]}>
            Tous ({total})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, activeFilter === "low" && styles.activeChip]}
          onPress={() => handleFilter("low")}
        >
          <Text style={[styles.filterText, activeFilter === "low" && styles.activeText]}>
            Faible ({lowStock})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, activeFilter === "alerted" && styles.activeChip]}
          onPress={() => handleFilter("alerted")}
        >
          <Text style={[styles.filterText, activeFilter === "alerted" && styles.activeText]}>
            Épuisés ({outOfStock})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste des produits */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#05aa65" />
        </View>
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadProducts(true)} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {filteredData.length === 0 ? (
            <Text style={styles.empty}>Aucun produit trouvé</Text>
          ) : (
            filteredData.map((produit) => (
              <ProductCard key={produit.id} produit={produit} />
            ))
          )}
        </ScrollView>
      )}

      {/* Bouton ajout */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/stock/add")}>
        <MaterialIcons name="add" size={34} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: { padding: 24, paddingTop: 50, backgroundColor: "#fff", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", color: "#2c3e50" },
  subtitle: { fontSize: 16, color: "#7f8c8d", marginTop: 4 },
  searchContainer: { paddingHorizontal: 20, marginVertical: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    elevation: 4,
    height: 50,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16 },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 30,
    alignItems: "center",
    elevation: 3,
  },
  activeChip: { backgroundColor: "#05aa65" },
  filterText: { fontWeight: "600", color: "#666" },
  activeText: { color: "#fff" },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", color: "#999", fontSize: 16, marginTop: 40 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#05aa65",
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});