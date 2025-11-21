// app/stock/[id].tsx
import { BASE_URL, setHeader } from "@/config/config";
import { AlertModal } from "@/src/components/Modals/Modals";
import { identifiedProduct } from "@/src/interfaces/interfaces";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../_layout";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [product, setProduct] = useState<identifiedProduct | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.user.role === "ADMIN" || user?.user.role === "SUPERADMIN") {
      setIsAdmin(true);
    }
  }, [user]);

  useEffect(() => {
    fetch(`${BASE_URL}/stock/produit/id/${id}`, {
      headers: setHeader(user?.token!),
    })
      .then((res) => res.json())
      .then((data: identifiedProduct) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, user?.token]);

  const validateCommand = async (commandId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/vente/commande/valid/${commandId}`, {
        headers: setHeader(user?.token!),
      });
      if (res.ok) {
        setProduct((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            commandes: prev.commandes.map((c) =>
              c.id === commandId ? { ...c, valide: true } : c
            ),
          };
        });
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.log("Erreur validation:", err);
    }
  };

  const deleteProduct = async () => {
    try {
      await fetch(`${BASE_URL}/stock/produit/${id}`, {
        method: "DELETE",
        headers: setHeader(user?.token!),
      });
      router.replace("/(tabs)/stock");
    } catch (err) {
      console.log("Erreur suppression:", err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#05aa65" />
        <Text style={styles.loadingText}>Chargement du produit...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{product.nom}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Card produit */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="inventory-2" size={32} color="#05aa65" />
            <Text style={styles.cardTitle}>Détails du produit</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Numéro</Text>
            <Text style={styles.value}>{product.numero}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Stock actuel</Text>
            <Text style={styles.valueBold}>{product.quantite.toLocaleString()} unités</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Prix de vente</Text>
            <Text style={styles.price}>{product.prixVente.toLocaleString()} Ar</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Prix d'achat</Text>
            <Text style={styles.value}>{product.prixAchat.toLocaleString()} Ar</Text>
          </View>

          {/* BOUTONS D'ACTION */}
          <View style={styles.actionButtons}>
            {/* Bouton Réapprovisionner - Visible pour tous */}
            <TouchableOpacity
              style={styles.restockBtn}
              onPress={() => router.push(`/transaction/add/${id}`)}
            >
              <MaterialIcons name="add-box" size={24} color="#fff" />
              <Text style={styles.btnText}>Réapprovisionner</Text>
            </TouchableOpacity>

            {/* Boutons Admin */}
            {isAdmin && (
              <>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => router.push(`/stock/update/${id}`)}
                >
                  <MaterialIcons name="edit" size={20} color="#fff" />
                  <Text style={styles.btnText}>Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => setShowDeleteModal(true)}
                >
                  <MaterialIcons name="delete-forever" size={20} color="#fff" />
                  <Text style={styles.btnText}>Supprimer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Section commandes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Commandes en cours</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push(`/commande/add/${id}`)}
            >
              <MaterialIcons name="add-shopping-cart" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {product.commandes.length === 0 ? (
            <Text style={styles.emptyText}>Aucune commande pour ce produit</Text>
          ) : (
            product.commandes.map((cmd) => (
              <View key={cmd.id} style={styles.commandItem}>
                <MaterialIcons name="shopping-cart" size={22} color="#05aa65" />
                <View style={styles.commandInfo}>
                  <Text style={styles.commandQty}>Quantité : {cmd.quantite}</Text>
                  <Text style={styles.commandDate}>
                    {new Date(cmd.date).toLocaleDateString("fr-FR")}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.status,
                    cmd.valide ? styles.statusValid : styles.statusPending,
                  ]}
                >
                  {cmd.valide ? "Livrée" : "En attente"}
                </Text>
                {!cmd.valide && (
                  <TouchableOpacity
                    style={styles.validateBtn}
                    onPress={() => validateCommand(cmd.id)}
                  >
                    <MaterialIcons name="check-circle" size={26} color="#05aa65" />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>

        {/* Section transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historique des mouvements</Text>
          {product.transactions.length === 0 ? (
            <Text style={styles.emptyText}>Aucune transaction enregistrée</Text>
          ) : (
            product.transactions.map((t, i) => (
              <View key={i} style={styles.transactionItem}>
                <MaterialIcons
                  name={t.type.toString() === "SORTIE" ? "arrow-upward" : "arrow-downward"}
                  size={24}
                  color={t.type.toString() === "SORTIE" ? "#05aa65" : "#e74c3c"}
                />
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionType}>
                    {t.type.toString() === "SORTIE" ? "Vente" : "Réapprovisionnement"}
                  </Text>
                  <Text style={styles.transactionQty}>Qté : {t.quantite}</Text>
                </View>
                <Text style={styles.transactionDate}>
                  {new Date(t.date).toLocaleDateString("fr-FR")}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      {showDeleteModal && (
        <AlertModal
          title="Supprimer le produit"
          text={`Êtes-vous sûr de vouloir supprimer "${product.nom}" ? Cette action est irréversible.`}
          closeModal={() => setShowDeleteModal(false)}
          confirm={deleteProduct}
        />
      )}

      {showSuccessModal && (
        <AlertModal
          title="Commande validée"
          text="La commande a été marquée comme livrée avec succès !"
          closeModal={() => setShowSuccessModal(false)}
          confirm={()=>setShowSuccessModal(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
    backgroundColor: "#05aa65",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 15,
    color: "#2c3e50",
    fontWeight: "600",
  },
  valueBold: {
    fontSize: 18,
    color: "#05aa65",
    fontWeight: "bold",
  },
  price: {
    fontSize: 18,
    color: "#05aa65",
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
    justifyContent: "space-between",
  },
  restockBtn: {
    flex: 1,
    backgroundColor: "#05aa65",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    minWidth: "100%",
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#3498db",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#e74c3c",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  addBtn: {
    backgroundColor: "#05aa65",
    padding: 12,
    borderRadius: 30,
  },
  commandItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: "#f8fff8",
    borderRadius: 14,
    marginBottom: 10,
  },
  commandInfo: {
    flex: 1,
    marginLeft: 12,
  },
  commandQty: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
  },
  commandDate: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  status: {
    fontSize: 13,
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusValid: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  statusPending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  validateBtn: {
    padding: 8,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 14,
    marginBottom: 10,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionType: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
  },
  transactionQty: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: "#777",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 15,
    marginTop: 20,
    fontStyle: "italic",
  },
});