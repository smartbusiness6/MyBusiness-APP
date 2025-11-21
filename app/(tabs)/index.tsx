// app/index.tsx
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../_layout";

const { width } = Dimensions.get("window");

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#05aa65"]} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header propre */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour {user?.user.nom || "l'ami"} !</Text>
        <Text style={styles.subtitle}>Voici votre tableau de bord</Text>
      </View>

      {/* Carte Revenus - Exactement comme ton mockup */}
      <View style={styles.revenueCard}>
        <View style={styles.revenueHeader}>
          <Text style={styles.revenueTitle}>Revenus cette semaine</Text>
          <MaterialIcons name="show-chart" size={24} color="#fff" />
        </View>
        <Text style={styles.revenueAmount}>250 000 Ar</Text>
        <View style={styles.growthBadge}>
          <MaterialIcons name="arrow-upward" size={16} color="#fff" />
          <Text style={styles.growthText}>+18.2%</Text>
        </View>
      </View>

      {/* 4 cartes stats - Style mockup */}
      <View style={styles.statsGrid}>
        {/* Ventes du jour */}
        <TouchableOpacity style={styles.statCard} onPress={() => router.push("/ventes")}>
          <View style={styles.statIconContainer}>
            <MaterialIcons name="receipt-long" size={28} color="#05aa65" />
          </View>
          <Text style={styles.statLabel}>Ventes du jour</Text>
          <Text style={styles.statValue}>0 Ar</Text>
        </TouchableOpacity>

        {/* Commandes */}
        <TouchableOpacity style={styles.statCard} onPress={() => router.push("/ventes")}>
          <View style={styles.statIconContainer}>
            <MaterialIcons name="shopping-cart" size={28} color="#3498db" />
          </View>
          <Text style={styles.statLabel}>Commandes</Text>
          <Text style={styles.statValue}>0</Text>
        </TouchableOpacity>

        {/* Produits */}
        <TouchableOpacity style={styles.statCard} onPress={() => router.push("/stock")}>
          <View style={styles.statIconContainer}>
            <MaterialIcons name="inventory-2" size={28} color="#05aa65" />
          </View>
          <Text style={styles.statLabel}>Produits</Text>
          <Text style={styles.statValue}>20</Text>
        </TouchableOpacity>

        {/* Alertes stock */}
        <TouchableOpacity style={styles.statCard} onPress={() => router.push("/stock")}>
          <View style={styles.statIconContainer}>
            <MaterialIcons name="warning" size={28} color="#e74c3c" />
          </View>
          <Text style={styles.statLabel}>Alertes stock</Text>
          <Text style={styles.statValue}>5</Text>
        </TouchableOpacity>
      </View>

      {/* Espace pour le FAB en bas */}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  // Header minimaliste
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 4,
  },

  // Carte revenus - 100% comme ton mockup
  revenueCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#05aa65",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  revenueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  revenueTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  revenueAmount: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 12,
  },
  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  growthText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 14,
  },

  // Grille de stats - Exactement comme ton mockup
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginTop: 20,
    gap: 16,
  },
  statCard: {
    backgroundColor: "#fff",
    width: width * 0.44,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f1f8f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 6,
  },
});