// src/components/CommandCard.tsx
import { useAuth } from "@/app/_layout";
import { BASE_URL, setHeader } from "@/config/config";
import { CommandeResponse } from "@/src/interfaces/interfaces";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AlertModal } from "./Modals/Modals";

interface CommandCardProps {
  vente: CommandeResponse;
  viewCommand?: () => void;
}

export default function CommandCard({ vente }: CommandCardProps) {
  const { user } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const isPaid = vente.factures[0]?.payed;
  const isDelivered = vente.valide;

  const cancelCommand = async () => {
    try {
      const res = await fetch(`${BASE_URL}/vente/commande/${vente.id}`, {
        method: "DELETE",
        headers: setHeader(user?.token!),
      });

      if (res.ok || res.status === 201) {
        router.replace("/(tabs)/ventes"); // Rafraîchir la liste
      }
    } catch (err) {
      console.log("Erreur annulation:", err);
    }
  };

  return (
    <>
      <View style={styles.card}>
        {/* Image placeholder */}
        <View style={styles.imageContainer}>
          <MaterialIcons name="shopping-bag" size={32} color="#fff" />
        </View>

        {/* Contenu */}
        <View style={styles.content}>
          {/* Nom produit + prix */}
          <View style={styles.header}>
            <Text style={styles.productName} numberOfLines={2}>
              {vente.produit.nom}
            </Text>
            <Text style={styles.price}>
              {vente.produit.prixVente.toLocaleString()} Ar
            </Text>
          </View>

          {/* Quantité */}
          <Text style={styles.quantity}>Quantité : {vente.quantite}</Text>

          {/* Statuts + actions */}
          <View style={styles.footer}>
            {/* Statut paiement */}
            <View style={[styles.statusBadge, isPaid ? styles.paidBadge : styles.pendingBadge]}>
              <MaterialIcons
                name={isPaid ? "check-circle" : "schedule"}
                size={14}
                color={isPaid ? "#155724" : "#721c24"}
              />
              <Text style={[styles.statusText, isPaid ? styles.paidText : styles.pendingText]}>
                {isPaid ? "Payée" : "En attente"}
              </Text>
            </View>

            {/* Statut livraison */}
            <View style={[styles.statusBadge, isDelivered ? styles.deliveredBadge : styles.pendingBadge]}>
              <MaterialIcons
                name={isDelivered ? "local-shipping" : "access-time"}
                size={14}
                color={isDelivered ? "#155724" : "#721c24"}
              />
              <Text style={[styles.statusText, isDelivered ? styles.paidText : styles.pendingText]}>
                {isDelivered ? "Livrée" : "En cours"}
              </Text>
            </View>

            {/* Boutons d'action */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push(`/commande/update/${vente.id}`)}
              >
                <MaterialIcons name="edit" size={20} color="#05aa65" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setShowCancelModal(true)}
              >
                <MaterialIcons name="cancel" size={22} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Modal d'annulation */}
      {showCancelModal && (
        <AlertModal
          title="Annuler la commande"
          text={`Voulez-vous vraiment annuler la commande de "${vente.produit.nom}" ?`}
          closeModal={() => {
            setShowCancelModal(false);
            cancelCommand();
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: {
    width: 68,
    height: 68,
    borderRadius: 16,
    backgroundColor: "#05aa65",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  productName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2c3e50",
    flex: 1,
    marginRight: 12,
  },
  price: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#05aa65",
  },
  quantity: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  paidBadge: {
    backgroundColor: "#d4edda",
  },
  deliveredBadge: {
    backgroundColor: "#d1ecf1",
  },
  pendingBadge: {
    backgroundColor: "#f8d7da",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  paidText: {
    color: "#155724",
  },
  pendingText: {
    color: "#721c24",
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  actionBtn: {
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
});