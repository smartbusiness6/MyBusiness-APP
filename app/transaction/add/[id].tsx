// app/transaction/add/[id].tsx
import { BASE_URL, setHeader } from "@/config/config";
import { AlertModal } from "@/src/components/Modals/Modals";
import { identifiedProduct } from "@/src/interfaces/interfaces";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/app/_layout";

export default function AddTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [product, setProduct] = useState<identifiedProduct | null>(null);
  const [quantite, setQuantite] = useState("");
  const [prixUnitaire, setPrixUnitaire] = useState("");
  const [reference, setReference] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({ quantite: false, prixUnitaire: false });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${BASE_URL}/stock/produit/id/${id}`, {
        headers: setHeader(user?.token!),
      });
      const data: identifiedProduct = await res.json();
      setProduct(data);
    } catch (err) {
      console.log("Erreur chargement produit:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const qty = parseInt(quantite);
    const prix = parseFloat(prixUnitaire);

    const newErrors = {
      quantite: !quantite || qty <= 0,
      prixUnitaire: !prixUnitaire || prix <= 0,
    };
    setErrors(newErrors);

    if (newErrors.quantite || newErrors.prixUnitaire) return;

    setSaving(true);

    try {
      const payload = {
        type: "ENTREE",
        quantite: qty,
        prixUnitaire: prix,
        produitId: parseInt(id),
        ref: reference.trim() || null,
      };

      const res = await fetch(`${BASE_URL}/stock/mouvement/`, {
        method: "POST",
        headers: setHeader(user?.token!),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowSuccess(true);
      } else {
        const error = await res.json();
        alert(error.error || "Erreur lors de l'enregistrement");
      }
    } catch (err:any) {
      alert("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#05aa65" />
        <Text style={styles.loadingText}>Chargement du produit...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#f8f9fa" }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Nouvelle entrée stock</Text>
        </View>

        {/* Card produit */}
        <View style={styles.productCard}>
          <MaterialIcons name="inventory-2" size={40} color="#05aa65" />
          <Text style={styles.productName}>{product.nom}</Text>
          <Text style={styles.productRef}>Ref: {product.numero}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stock actuel</Text>
            <Text style={styles.infoValue}>{product.quantite.toLocaleString()} unités</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dernier prix d'achat</Text>
            <Text style={styles.infoValue}>{product.prixAchat.toLocaleString()} Ar</Text>
          </View>
        </View>

        {/* Formulaire */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="add-circle" size={28} color="#05aa65" />
            <Text style={styles.sectionTitle}>Approvisionnement</Text>
          </View>

          {/* Quantité */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantité à ajouter *</Text>
            <TextInput
              style={[styles.input, errors.quantite && styles.inputError]}
              placeholder="Ex: 100"
              value={quantite}
              onChangeText={setQuantite}
              keyboardType="numeric"
            />
            {errors.quantite && <Text style={styles.errorText}>Quantité invalide</Text>}
          </View>

          {/* Prix unitaire */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prix unitaire d'achat (Ar) *</Text>
            <TextInput
              style={[styles.input, errors.prixUnitaire && styles.inputError]}
              placeholder="Ex: 85000"
              value={prixUnitaire}
              onChangeText={setPrixUnitaire}
              keyboardType="numeric"
            />
            {errors.prixUnitaire && <Text style={styles.errorText}>Prix invalide</Text>}
          </View>

          {/* Référence */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Référence (facture, bon...)</Text>
            <TextInput
              style={styles.input}
              placeholder="Optionnel"
              value={reference}
              onChangeText={setReference}
            />
          </View>

          {/* Résumé */}
          {quantite && prixUnitaire && (
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                Montant total :{" "}
                <Text style={styles.summaryBold}>
                  {(parseInt(quantite) * parseFloat(prixUnitaire)).toLocaleString()} Ar
                </Text>
              </Text>
              <Text style={styles.summaryText}>
                Nouveau stock :{" "}
                <Text style={styles.summaryBold}>
                  {(product.quantite + parseInt(quantite)).toLocaleString()} unités
                </Text>
              </Text>
            </View>
          )}

          {/* Boutons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={saving}
            >
              <MaterialIcons name="save" size={20} color="#fff" />
              <Text style={styles.saveText}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal succès */}
      {showSuccess && (
        <AlertModal
          title="Approvisionnement enregistré"
          text={`+${quantite} unités ajoutées avec succès !\nNouveau stock : ${(product.quantite + parseInt(quantite)).toLocaleString()} unités`}
          closeModal={() => {
            setShowSuccess(false);
            router.back();
          }}
          confirm={()=>router.back()}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#f8f9fa" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa" },
  loadingText: { marginTop: 16, fontSize: 16, color: "#666" },
  header: {
    backgroundColor: "#05aa65",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backBtn: { backgroundColor: "rgba(255,255,255,0.2)", padding: 10, borderRadius: 30 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", flex: 1 },
  productCard: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: -30,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  productName: { fontSize: 22, fontWeight: "bold", color: "#2c3e50", marginTop: 12 },
  productRef: { fontSize: 15, color: "#666", marginBottom: 20 },
  infoRow: { alignItems: "center", marginBottom: 16 },
  infoLabel: { fontSize: 14, color: "#777" },
  infoValue: { fontSize: 26, fontWeight: "bold", color: "#05aa65" },
  formCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#2c3e50" },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  inputError: { borderColor: "#e74c3c", backgroundColor: "#fdf2f2" },
  errorText: { color: "#e74c3c", fontSize: 13, marginTop: 6 },
  summary: {
    backgroundColor: "#e8f5e8",
    padding: 16,
    borderRadius: 14,
    marginVertical: 20,
  },
  summaryText: { fontSize: 16, textAlign: "center", color: "#2c3e50" },
  summaryBold: { fontWeight: "bold", color: "#05aa65", fontSize: 18 },
  buttonRow: { flexDirection: "row", gap: 16, marginTop: 10 },
  saveBtn: {
    flex: 1,
    backgroundColor: "#05aa65",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  saveText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ddd",
  },
  cancelText: { color: "#666", fontSize: 17, fontWeight: "600" },
});