// app/stock/update/[id].tsx
import { useAuth } from "@/app/_layout";
import { BASE_URL, setHeader } from "@/config/config";
import { AlertModal } from "@/src/components/Modals/Modals";
import { identifiedProduct } from "@/src/interfaces/interfaces";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductUpdate() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<identifiedProduct | null>(null);
  const [modal, setModal] = useState(false);

  const [nom, setNom] = useState("");
  const [numero, setNumero] = useState("");
  const [quantite, setQuantite] = useState("");
  const [type, setType] = useState("");
  const [prixA, setPrixA] = useState("");
  const [prixV, setPrixV] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/stock/produit/id/${id}`, {
      headers: setHeader(user?.token!),
    })
      .then((res) => res.json())
      .then((body: identifiedProduct) => {
        setProduct(body);
        setNom(body.nom);
        setNumero(body.numero);
        setQuantite(body.quantite.toString());
        setPrixA(body.prixAchat.toString());
        setPrixV(body.prixVente.toString());
        setType(body.type);
      });
  }, [id]);

  const submit = () => {
    fetch(`${BASE_URL}/stock/produit/${id}`, {
      method: "PATCH",
      headers: setHeader(user?.token!),
      body: JSON.stringify({
        nom,
        numero,
        quantite: parseInt(quantite) || 0,
        prixAchat: parseInt(prixA) || 0,
        prixVente: parseInt(prixV) || 0,
        type,
      }),
    })
      .then(() => setModal(true))
      .catch((err) => console.log(err));
  };

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={()=>router.back()}>
          <MaterialIcons name="arrow-back" size={25} color={"#fff"} style={styles.btnBack}/>
        </TouchableOpacity>
        <Text style={styles.title}>Modifier le produit</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Numéro</Text>
          <TextInput style={styles.input} value={numero} onChangeText={setNumero} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom du produit</Text>
          <TextInput style={styles.input} value={nom} onChangeText={setNom} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantité en stock</Text>
          <TextInput
            style={styles.input}
            value={quantite}
            onChangeText={setQuantite}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroupHalf}>
            <Text style={styles.label}>Prix d'achat</Text>
            <TextInput
              style={styles.input}
              value={prixA}
              onChangeText={setPrixA}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroupHalf}>
            <Text style={styles.label}>Prix de vente</Text>
            <TextInput
              style={styles.input}
              value={prixV}
              onChangeText={setPrixV}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type / Catégorie</Text>
          <TextInput style={styles.input} value={type} onChangeText={setType} />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={submit}>
          <MaterialIcons name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>
      </View>

      {modal && (
        <AlertModal
          title="Succès"
          text="Produit modifié avec succès !"
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  btnBack:{
    position: "absolute",
    left: 30,
    backgroundColor: "#079e7dff",
    padding: 5,
    borderRadius: 50
  },
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#fff", margin: 15, borderRadius: 16, padding: 20, elevation: 3 },
  title: { fontSize: 22, fontWeight: "bold", color: "#079e7dff", marginBottom: 20, textAlign: "center" },
  inputGroup: { marginBottom: 16 },
  inputGroupHalf: { flex: 1, marginBottom: 16, marginRight: 8 },
  label: { fontSize: 14, color: "#555", marginBottom: 6 },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  row: { flexDirection: "row" },
  saveButton: {
    backgroundColor: "#079e7dff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 8 },
});