// src/components/ProductCard.tsx
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Produit } from "../interfaces/models";

export default function ProductCard({ produit }: { produit: Produit }) {
  const isLow = produit.quantite > 0 && produit.quantite <= 5;
  const isOut = produit.quantite === 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/stock/${produit.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name="inventory-2" size={40} color="#05aa65" />
      </View>

      <View style={styles.details}>
        <Text style={styles.name}>{produit.nom}</Text>
        <Text style={styles.price}>Achat: {produit.prixAchat.toLocaleString()} Ar</Text>
        <Text style={styles.price}>Vente: {produit.prixVente.toLocaleString()} Ar</Text>
      </View>

      <View style={styles.right}>
        <View style={styles.quantityContainer}>
          <Text style={[
            styles.quantity,
            isOut && styles.outOfStock,
            isLow && styles.lowStock
          ]}>
            {produit.quantite}
          </Text>
          {isOut && <Text style={styles.statusText}>Épuisé</Text>}
          {isLow && !isOut && <Text style={styles.statusText}>Faible</Text>}
        </View>
        <MaterialIcons name="chevron-right" size={28} color="#999" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  details: { flex: 1 },
  name: { fontSize: 17, fontWeight: "600", color: "#2c3e50" },
  price: { fontSize: 14, color: "#7f8c8d", marginTop: 4 },
  right: { alignItems: "flex-end" },
  quantityContainer: { alignItems: "center" },
  quantity: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#05aa65",
  },
  lowStock: { color: "#f39c12" },
  outOfStock: { color: "#e74c3c" },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 4,
    color: "#e74c3c",
  },
});