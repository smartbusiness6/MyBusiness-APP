// app/vente/commande/[id].tsx
import { useAuth } from "@/app/_layout";
import { BASE_URL, setHeader } from "@/config/config";
import { AlertModal } from "@/src/components/Modals/Modals";
import { identifiedProduct } from "@/src/interfaces/interfaces";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CommandForm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [product, setProduct] = useState<identifiedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);

  // Client
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [datePaiement, setDatePaiement] = useState("");

  // Quantité
  const [quantite, setQuantite] = useState(1);

  // Erreurs
  const [errors, setErrors] = useState({
    nom: false,
    email: false,
    telephone: false,
    date: false,
    quantite: false,
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/stock/produit/id/${id}`, {
          headers: setHeader(user?.token!),
        });
        if (!res.ok) throw new Error();
        const data: identifiedProduct = await res.json();
        setProduct(data);
      } catch (err) {
        Alert.alert("Erreur", "Impossible de charger le produit");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  const updateQuantity = (value: number) => {
    if (value >= 1 && value <= (product?.quantite || 0)) {
      setQuantite(value);
      setErrors((e) => ({ ...e, quantite: false }));
    }
  };

  const validateAndSubmit = async () => {
    const newErrors = {
      nom: nom.trim() === "",
      email: !/^\S+@\S+\.\S+$/.test(email.trim()),
      telephone: telephone.trim() === "",
      date: datePaiement.trim() === "",
      quantite: quantite < 1 || quantite > (product?.quantite || 0),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((v) => v)) {
      Alert.alert("Erreur", "Veuillez corriger les champs en rouge");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${BASE_URL}/vente/commande`, {
        method: "POST",
        headers: setHeader(user?.token!),
        body: JSON.stringify({
          idProduit: parseInt(id),
          quantite,
          client: {
            nom: nom.trim(),
            email: email.trim(),
            telephone: telephone.trim(),
          },
          datePaiement: new Date(datePaiement.split("/").reverse().join("-")).toISOString(),
        }),
      });

      if (res.ok) {
        setModal(true);
        console.log(res.body)
      } else {
        const err = await res.json();
        Alert.alert("Erreur", err.message || "Échec de la commande");
      }
    } catch (err) {
      Alert.alert("Erreur", "Problème de connexion");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#05aa65" />
        <Text style={styles.loadingText}>Chargement du produit...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8f9fa" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Commande</Text>
          <MaterialIcons name="shopping-cart-checkout" size={32} color="#fff" />
        </View>

        {/* Produit sélectionné */}
        <View style={styles.productCard}>
          <View style={styles.productHeader}>
            <MaterialIcons name="inventory-2" size={28} color="#05aa65" />
            <Text style={styles.productName}>{product?.nom}</Text>
          </View>

          <View style={styles.productInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Numéro :</Text>
              <Text style={styles.infoValue}>{product?.numero}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Stock actuel :</Text>
              <Text style={styles.infoValue}>{product?.quantite.toLocaleString()} unité(s)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Prix de vente :</Text>
              <Text style={styles.infoValueBold}>{product?.prixVente.toLocaleString()} Ar</Text>
            </View>
          </View>

          {/* Contrôle quantité */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantité à commander</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={() => updateQuantity(quantite - 1)} style={styles.qtyBtn}>
                <MaterialCommunityIcons name="minus-box" size={36} color="#e74c3c" />
              </TouchableOpacity>

              <View style={styles.quantityBox}>
                <Text style={styles.quantityText}>{quantite}</Text>
              </View>

              <TouchableOpacity onPress={() => updateQuantity(quantite + 1)} style={styles.qtyBtn}>
                <MaterialCommunityIcons name="plus-box" size={36} color="#05aa65" />
              </TouchableOpacity>
            </View>
            {errors.quantite && (
              <Text style={styles.errorText}>Quantité invalide (max: {product?.quantite})</Text>
            )}
            <Text style={styles.totalPrice}>
              Total : {(quantite * (product?.prixVente || 0)).toLocaleString()} Ar
            </Text>
          </View>
        </View>

        {/* Informations client */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="person-outline" size={28} color="#05aa65" />
            <Text style={styles.sectionTitle}>Informations du client</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet *</Text>
            <TextInput
              style={[styles.input, errors.nom && styles.inputError]}
              placeholder="Ex: Jean Dupont"
              value={nom}
              onChangeText={setNom}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="jean@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone *</Text>
            <TextInput
              style={[styles.input, errors.telephone && styles.inputError]}
              placeholder="Ex: 033 33 333 33"
              value={telephone}
              onChangeText={setTelephone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date de paiement * (jj/mm/aaaa)</Text>
            <TextInput
              style={[styles.input, errors.date && styles.inputError]}
              placeholder="25/12/2025"
              value={datePaiement}
              onChangeText={setDatePaiement}
            />
          </View>

          {/* Boutons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, saving && styles.confirmBtnDisabled]}
              onPress={()=>validateAndSubmit()}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="send" size={22} color="#fff" />
                  <Text style={styles.confirmText}>Passer la commande</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal succès */}
      {modal && (
        <AlertModal
          title="Commande enregistrée !"
          text="La commande a été passée avec succès."
          closeModal={() => {
            setModal(false);
            router.back();
          }}
          confirm={() => {
            setModal(false);
            router.back();
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#05aa65" },

  header: {
    backgroundColor: "#05aa65",
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: {
    padding: 5,
    paddingStart: 7,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
    marginRight: 40,
  },

  productCard: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: -10,
    borderRadius: 24,
    padding: 20,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  productInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 15,
    color: "#666",
  },
  infoValue: {
    fontSize: 15,
    color: "#2c3e50",
  },
  infoValueBold: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#05aa65",
  },

  quantityContainer: {
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  qtyBtn: {
    padding: 8,
  },
  quantityBox: {
    backgroundColor: "#05aa65",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  totalPrice: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#05aa65",
  },

  formCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 24,
    padding: 24,
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },

  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#e74c3c",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 13,
    marginTop: 6,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginRight: 12,
  },
  cancelText: {
    color: "#7f8c8d",
    fontWeight: "bold",
    fontSize: 16,
  },
  confirmBtn: {
    flex: 2,
    backgroundColor: "#05aa65",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    elevation: 6,
  },
  confirmBtnDisabled: { opacity: 0.7 },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});