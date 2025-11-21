// app/stock/update/[id].tsx
import { useAuth } from "@/app/_layout";
import { BASE_URL, setHeader } from "@/config/config";
import { AlertModal } from "@/src/components/Modals/Modals";
import { userById } from "@/src/interfaces/interfaces";
import { Profession } from "@/src/interfaces/models";
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

export default function UserUpdate() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [personnel, setPersonnel] = useState<userById | null>(null);
  const [modal, setModal] = useState(false);

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [type, setType] = useState("");
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [salaire, setSalaire] = useState("");

  useEffect(() => {
    Promise.all([
        fetch(`${BASE_URL}/rh/staff/${id}`, {
            headers: setHeader(user?.token!),
        })
        .then((res) => res.json())
        .then((body: userById) => {
            setPersonnel(body);
            setNom(body.nom);
            setEmail(body.email);
            setProfession(body.profession.poste.toString());
            setSalaire(body.profession.salaire.toString())
        }),
        fetch(`${BASE_URL}/rh/profession/`, {
            headers: setHeader(user?.token!),
        })
        .then((res) => res.json())
        .then((body: Profession[]) => {
            setProfessions(body);
        }),
    ])
  }, [id]);

  const submit = () => {

    let concernedProfession = professions.find(p=>p.poste.toLowerCase()===profession.toLowerCase())
    if(!concernedProfession){
        fetch(`${BASE_URL}/rh/profession`,
            {
                method: "POST",
                headers: setHeader(user?.token!),
                body: JSON.stringify({
                    poste: profession,
                    salaire: parseInt(salaire),
                    idEntreprise: user?.user.profession.entreprise?.id!
                })
            }
        )
        .then(res=>res.json())
        .then((body:Profession)=>{
            concernedProfession = body
        })
    }
    fetch(`${BASE_URL}/stock/produit/${id}`, {
      method: "PATCH",
      headers: setHeader(user?.token!),
      body: JSON.stringify({
        nom,
        email,
        idProfession: concernedProfession?.id
      }),
    })
      .then(() => setModal(true))
      .catch((err) => console.log(err));
  };

  if (!personnel) {
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
        <Text style={styles.title}>Modifier les informations du personnel</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom</Text>
          <TextInput style={styles.input} value={nom} onChangeText={setNom} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} textContentType="emailAddress"/>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Profession</Text>
          <TextInput
            style={styles.input}
            value={profession}
            onChangeText={setProfession}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Salaire</Text>
          <TextInput
            style={styles.input}
            value={salaire}
            onChangeText={setSalaire}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={submit}>
          <MaterialIcons name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>
      </View>

      {modal && (
        <AlertModal
          title="Succès"
          text="Informations modifié avec succès !"
          closeModal={() => {
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