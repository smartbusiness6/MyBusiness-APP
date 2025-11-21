// app/rh/add.tsx
import { useAuth } from "@/app/_layout";
import { BASE_URL, setHeader } from "@/config/config";
import { AlertModal } from "@/src/components/Modals/Modals";
import { ProfessionGet } from "@/src/interfaces/interfaces";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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

export default function AddEmployeeScreen() {
  const { user } = useAuth();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [salaire, setSalaire] = useState("");
  const [mdp, setMdp] = useState("");
  const [confMdp, setConfMdp] = useState("");

  const [errors, setErrors] = useState({
    nom: false,
    email: false,
    profession: false,
    salaire: false,
    mdp: false,
    confMdp: false,
    mdpMatch: false,
  });

  const [professions, setProfessions] = useState<ProfessionGet[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/rh/profession/`, {
      headers: setHeader(user?.token!),
    })
      .then((res) => res.json())
      .then((data: ProfessionGet[]) => setProfessions(data))
      .catch(() => {});
  }, [user?.token]);

  const validateAndSubmit = async () => {
    const newErrors = {
      nom: !nom.trim(),
      email: !email.trim() || !email.includes("@"),
      profession: !profession.trim(),
      salaire: !salaire.trim() || isNaN(Number(salaire)),
      mdp: !mdp.trim() || mdp.length < 6,
      confMdp: !confMdp.trim(),
      mdpMatch: mdp !== confMdp,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) {
      Alert.alert("Erreur", "Veuillez corriger les champs en surbrillance");
      return;
    }

    setLoading(true);

    try {
      let professionData = professions.find(
        (p) => p.poste.toLowerCase() === profession.toLowerCase().trim()
      );

      if (!professionData) {
        const res = await fetch(`${BASE_URL}/rh/profession`, {
          method: "POST",
          headers: setHeader(user?.token!),
          body: JSON.stringify({
            poste: profession.trim(),
            salaire: Number(salaire),
            idEntreprise: user?.user.profession.entreprise?.id,
          }),
        });

        if (!res.ok) throw new Error("Impossible de créer le poste");
        professionData = await res.json();
      }

      const registerRes = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: setHeader(user?.token!),
        body: JSON.stringify({
          nom: nom.trim(),
          email: email.trim().toLowerCase(),
          password: mdp,
          idProfession: professionData!.id,
          role: "USER",
        }),
      });

      if (!registerRes.ok) {
        const err = await registerRes.json();
        throw new Error(err.error || "Échec de création de l’employé");
      }

      // Afficher le modal de succès
      setShowSuccessModal(true);
    } catch (err: any) {
      Alert.alert("Erreur", err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="people-alt" size={32} color="#05aa65" />
          <Text style={styles.title}>Nouvel employé</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet *</Text>
            <TextInput
              style={[styles.input, errors.nom && styles.inputError]}
              placeholder="Jean Dupont"
              value={nom}
              onChangeText={setNom}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email professionnel *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="jean@entreprise.com"
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Poste / Profession *</Text>
            <TextInput
              style={[styles.input, errors.profession && styles.inputError]}
              placeholder="Vendeur, Comptable..."
              value={profession}
              onChangeText={setProfession}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Salaire mensuel (Ar) *</Text>
            <TextInput
              style={[styles.input, errors.salaire && styles.inputError]}
              placeholder="250000"
              value={salaire}
              keyboardType="numeric"
              onChangeText={setSalaire}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe *</Text>
            <TextInput
              style={[styles.input, errors.mdp && styles.inputError]}
              placeholder="6 caractères minimum"
              value={mdp}
              secureTextEntry
              onChangeText={setMdp}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe *</Text>
            <TextInput
              style={[
                styles.input,
                (errors.confMdp || errors.mdpMatch) && styles.inputError,
              ]}
              placeholder="Répéter le mot de passe"
              value={confMdp}
              secureTextEntry
              onChangeText={setConfMdp}
            />
            {errors.mdpMatch && (
              <Text style={styles.errorText}>
                Les mots de passe ne correspondent pas
              </Text>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, loading && { opacity: 0.7 }]}
              onPress={validateAndSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>
                {loading ? "Création..." : "Créer l’employé"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de succès – sans prop "visible" */}
      {showSuccessModal && (
        <AlertModal
          title="Employé ajouté"
          text="L’employé a été créé avec succès !"
          closeModal={() => {
            setShowSuccessModal(false);
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
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#05aa65",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
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
    marginTop: 30,
    gap: 16,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#05aa65",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: {
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