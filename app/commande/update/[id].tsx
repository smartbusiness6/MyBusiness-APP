// app/commande/update/[id].tsx
import { useAuth } from "@/app/_layout";
import { BASE_URL, setHeader } from "@/config/config";
import { AlertModal } from "@/src/components/Modals/Modals";
import { CommandeResponse } from "@/src/interfaces/interfaces";
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

export default function UpdateCommandScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [commande, setCommande] = useState<CommandeResponse | null>(null);
  const [quantite, setQuantite] = useState(1);

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [datePaiement, setDatePaiement] = useState("");

  const [errors, setErrors] = useState({
    nom: false,
    email: false,
    telephone: false,
    date: false,
    quantite: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/vente/commande/${id}`, {
      headers: setHeader(user?.token!),
    })
      .then((res) => res.json())
      .then((data: CommandeResponse) => {
        setCommande(data);
        setQuantite(data.quantite);

        setNom(data.client.nom);
        setEmail(data.client.email || "");
        setTelephone(data.client.telephone || "");

        const date = new Date(data.datePaiement);
        setDatePaiement(
          `${date.getDate().toString().padStart(2, "0")}/${(
            date.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`
        );

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, user?.token]);

  const updateQuantity = (delta: number) => {
    const newQty = quantite + delta;
    if (newQty > 0 && newQty <= (commande?.produit.quantite || 0)) {
      setQuantite(newQty);
    }
  };

  const handleQuantityChange = (text: string) => {
    const num = parseInt(text) || 0;
    if (num > 0 && num <= (commande?.produit.quantite || 0)) {
      setQuantite(num);
    }
  };

  const submit = async () => {
    const newErrors = {
      nom: !nom.trim(),
      email: !email.trim() || !email.includes("@"),
      telephone: !telephone.trim(),
      date: !datePaiement.trim(),
      quantite: quantite <= 0 || quantite > (commande?.produit.quantite || 0),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) {
      return;
    }

    setSaving(true);

    try {
      const [day, month, year] = datePaiement.split("/");
      const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      const res = await fetch(`${BASE_URL}/vente/commande/${id}`, {
        method: "PUT",
        headers: setHeader(user?.token!),
        body: JSON.stringify({
          quantite,
          client: { nom: nom.trim(), email: email.trim(), telephone: telephone.trim() },
          datePaiement: isoDate,
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
      }
    } catch (err) {
      console.log("Erreur mise à jour:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !commande) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#05aa65" />
        <Text style={styles.loadingText}>Chargement de la commande...</Text>
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
          <MaterialIcons name="shopping-cart" size={32} color="#fff" />
          <Text style={styles.title}>Modifier la commande</Text>
        </View>

        {/* Card produit */}
        <View style={styles.productCard}>
          <Text style={styles.productName}>{commande.produit.nom}</Text>
          <View style={styles.productInfo}>
            <Text style={styles.infoLabel}>Référence</Text>
            <Text style={styles.infoValue}>{commande.produit.numero}</Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.infoLabel}>Stock disponible</Text>
            <Text style={styles.infoValueBold}>
              {commande.produit.quantite.toLocaleString()} unités
            </Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.infoLabel}>Prix unitaire</Text>
            <Text style={styles.price}>
              {commande.produit.prixVente.toLocaleString()} Ar
            </Text>
          </View>

          {/* Compteur de quantité */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantité commandée</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => updateQuantity(-1)}
              >
                <MaterialIcons name="remove" size={28} color="#fff" />
              </TouchableOpacity>

              <TextInput
                style={styles.counterInput}
                value={quantite.toString()}
                onChangeText={handleQuantityChange}
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => updateQuantity(1)}
              >
                <MaterialIcons name="add" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            {errors.quantite && (
              <Text style={styles.errorText}>
                Quantité invalide (max: {commande.produit.quantite})
              </Text>
            )}
            <Text style={styles.totalPrice}>
              Total : {(quantite * commande.produit.prixVente).toLocaleString()} Ar
            </Text>
          </View>
        </View>

        {/* Informations client */}
        <View style={styles.clientCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="person" size={28} color="#05aa65" />
            <Text style={styles.sectionTitle}>Client</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet *</Text>
            <TextInput
              style={[styles.input, errors.nom && styles.inputError]}
              value={nom}
              onChangeText={setNom}
              placeholder="Jean Dupont"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="jean@example.com"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone *</Text>
            <TextInput
              style={[styles.input, errors.telephone && styles.inputError]}
              value={telephone}
              onChangeText={setTelephone}
              keyboardType="phone-pad"
              placeholder="03X XXX XXXX"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date de paiement * (jj/mm/aaaa)</Text>
            <TextInput
              style={[styles.input, errors.date && styles.inputError]}
              value={datePaiement}
              onChangeText={setDatePaiement}
              placeholder="25/12/2025"
            />
          </View>
        </View>

        {/* Boutons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={submit}
            disabled={saving}
          >
            <Text style={styles.saveText}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal succès */}
      {showSuccess && (
        <AlertModal
          title="Commande mise à jour"
          text="La commande a été modifiée avec succès !"
          closeModal={() => {
            setShowSuccess(false);
            router.back();
          }}
          confirm={() => {
            setShowSuccess(false);
            router.back();
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  loading: {
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: -30,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 16,
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: "#666",
  },
  infoValue: {
    fontSize: 15,
    color: "#2c3e50",
    fontWeight: "600",
  },
  infoValueBold: {
    fontSize: 17,
    color: "#05aa65",
    fontWeight: "bold",
  },
  price: {
    fontSize: 18,
    color: "#05aa65",
    fontWeight: "bold",
  },
  quantitySection: {
    marginTop: 20,
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#05aa65",
    borderRadius: 16,
    padding: 8,
  },
  counterBtn: {
    padding: 12,
  },
  counterInput: {
    backgroundColor: "#fff",
    width: 80,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#05aa65",
    borderRadius: 12,
    paddingVertical: 12,
  },
  totalPrice: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "bold",
    color: "#05aa65",
  },
  clientCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#e74c3c",
    backgroundColor: "#fdf2f2",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 10,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#05aa65",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ddd",
  },
  cancelText: {
    color: "#666",
    fontSize: 17,
    fontWeight: "600",
  },
});