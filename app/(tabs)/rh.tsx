// app/rh/index.tsx
import { BASE_URL } from "@/config/config";
import { Personnel } from "@/src/interfaces/interfaces";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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

type FilterType = "all" | "admin" | "simple";

export default function RHScreen() {
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [filteredData, setFilteredData] = useState<Personnel[]>([]);
  const [data, setData] = useState<Personnel[]>([]);
  const [masseSalariale, setMasseSalariale] = useState(0);
  const [enConge, setEnConge] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  // Vérification ADMIN
  useEffect(() => {
    if (user?.user.role !== "ADMIN") {
      Alert.alert("Accès refusé", "Seul un administrateur peut accéder à cette page.", [
        { text: "Retour", onPress: () => router.replace("/(tabs)") },
      ]);
    }
  }, [user]);

  // Chargement des données
  const loadStaff = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      const response = await fetch(`${BASE_URL}/rh/staff`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur réseau");

      const staff: Personnel[] = await response.json();

      // Calculs
      const totalSalaire = staff.reduce((sum, p) => sum + p.profession.salaire, 0);
      const enCongeCount = staff.filter((p) =>
        p.conges.some((c) => new Date(c.dateFin) >= new Date())
      ).length;

      setData(staff);
      setFilteredData(staff);
      setMasseSalariale(totalSalaire);
      setEnConge(enCongeCount);
    } catch (err) {
      Alert.alert("Erreur", "Impossible de charger le personnel");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.token) loadStaff();
  }, [user?.token]);

  // Filtre + recherche
  const applyFilterAndSearch = (filter: FilterType, search: string) => {
    let filtered = [...data];

    if (filter === "admin") filtered = filtered.filter((p) => p.role === "ADMIN");
    if (filter === "simple") filtered = filtered.filter((p) => p.role === "USER");

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

  const moyenneSalariale = data.length > 0 ? Math.round(masseSalariale / data.length) : 0;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#18e2a6" />
        <Text style={styles.loadingText}>Chargement du personnel...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadStaff(true)} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats horizontales */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: "#18e2a6" }]}>
            <MaterialIcons name="people-alt" size={36} color="#fff" />
            <Text style={styles.statLabel}>Effectif</Text>
            <Text style={styles.statValue}>{data.length}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#088a63" }]}>
            <MaterialIcons name="account-balance-wallet" size={36} color="#fff" />
            <Text style={styles.statLabel}>Masse salariale</Text>
            <Text style={styles.statValue}>{masseSalariale.toLocaleString()} Ar</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#3cc3db" }]}>
            <MaterialIcons name="event-busy" size={36} color="#fff" />
            <Text style={styles.statLabel}>En congé</Text>
            <Text style={styles.statValue}>{enConge}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#f39c12" }]}>
            <MaterialIcons name="trending-up" size={36} color="#fff" />
            <Text style={styles.statLabel}>Moyenne</Text>
            <Text style={styles.statValue}>{moyenneSalariale.toLocaleString()} Ar</Text>
          </View>
        </ScrollView>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={24} color="#666" />
            <TextInput
              placeholder="Rechercher un employé..."
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
            <Text style={[styles.filterText, activeFilter === "all" && styles.activeText]}>Tous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === "admin" && styles.activeChip]}
            onPress={() => handleFilter("admin")}
          >
            <Text style={[styles.filterText, activeFilter === "admin" && styles.activeText]}>Admins</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === "simple" && styles.activeChip]}
            onPress={() => handleFilter("simple")}
          >
            <Text style={[styles.filterText, activeFilter === "simple" && styles.activeText]}>Assistants</Text>
          </TouchableOpacity>
        </View>

        {/* Liste des employés */}
        <View style={styles.list}>
          {filteredData.length === 0 ? (
            <Text style={styles.empty}>Aucun employé trouvé</Text>
          ) : (
            filteredData.map((emp) => {
              const estEnConge = emp.conges.some((c) => new Date(c.dateFin) >= new Date());
              return (
                <TouchableOpacity
                  key={emp.id}
                  style={styles.employeeCard}
                  onPress={() => router.push(`/rh/${emp.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.employeeInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {emp.nom.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.employeeName}>{emp.nom}</Text>
                      <Text style={styles.employeeRole}>{emp.profession.poste}</Text>
                    </View>
                  </View>
                  <View style={styles.employeeRight}>
                    {estEnConge && <Text style={styles.leaveBadge}>En congé</Text>}
                    <MaterialIcons name="chevron-right" size={28} color="#999" />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Bouton ajout */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/rh/add")}>
        <MaterialIcons name="person-add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#18e2a6", fontSize: 16 },
  statsContainer: { paddingVertical: 16, paddingHorizontal: 8 },
  statCard: {
    width: 180,
    height: 120,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 8,
    justifyContent: "center",
    elevation: 6,
  },
  statLabel: { color: "#fff", fontSize: 14, marginTop: 8, opacity: 0.9 },
  statValue: { color: "#fff", fontSize: 20, fontWeight: "bold", marginTop: 4 },
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
  activeChip: { backgroundColor: "#088a63" },
  filterText: { fontWeight: "600", color: "#666" },
  activeText: { color: "#fff" },
  list: { paddingHorizontal: 20 },
  employeeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },
  employeeInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#088a63",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  employeeName: { fontSize: 16, fontWeight: "600", color: "#2c3e50" },
  employeeRole: { fontSize: 13, color: "#7f8c8d", marginTop: 2 },
  employeeRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  leaveBadge: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontWeight: "bold",
  },
  empty: { textAlign: "center", color: "#999", fontSize: 16, marginTop: 40 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#088a63",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
});