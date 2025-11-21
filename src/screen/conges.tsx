// app/conges/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  RefreshControl,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { Calendar } from "react-native-calendars";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CongeLocalService from "../services/CongeService";
import { format } from "date-fns";

export default function CongesScreen() {
  const [conges, setConges] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  // Charger les congés
  const loadConges = async () => {
    try {
      const data = await CongeLocalService.getAllConges();
      setConges(data);
    } catch (err) {
      Alert.alert("Erreur", "Impossible de charger les congés");
    }
  };

  useEffect(() => {
    loadConges();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConges();
    setRefreshing(false);
  };

  const ajouterConge = async () => {
    if (!selectedUserId || !dateDebut || !dateFin) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    try {
      await CongeLocalService.ajouterConge({
        idUser: parseInt(selectedUserId),
        dateDebut,
        dateFin,
      });
      setModalVisible(false);
      loadConges();
      setSelectedUserId("");
      setDateDebut("");
      setDateFin("");
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    }
  };

  const annulerConge = (id: number) => {
    Alert.alert("Confirmer", "Annuler ce congé ?", [
      { text: "Non" },
      {
        text: "Oui",
        onPress: async () => {
          try {
            await CongeLocalService.annulerConge(id);
            loadConges();
          } catch (err: any) {
            Alert.alert("Erreur", err.message);
          }
        },
      },
    ]);
  };

  // Marquer les dates de congés sur le calendrier
  const markedDates: any = {};
  conges.forEach((c) => {
    const start = c.dateDebut.split("T")[0];
    const end = c.dateFin.split("T")[0];
    const dates = getDatesInRange(start, end);
    dates.forEach((d) => {
      markedDates[d] = {
        marked: true,
        dotColor: "#e74c3c",
        selected: true,
        selectedColor: "rgba(231, 76, 60, 0.2)",
      };
    });
  });

  function getDatesInRange(start: string, end: string) {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      dates.push(format(current, "yyyy-MM-dd"));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Congés</Text>

      <Calendar markedDates={markedDates} theme={{ todayTextColor: "#05aa65" }} />

      <FlatList
        data={conges}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>Aucun congé enregistré</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.user}>Employé ID: {item.idUser}</Text>
              <Text>
                Du {format(new Date(item.dateDebut), "dd MMM yyyy")} au{" "}
                {format(new Date(item.dateFin), "dd MMM yyyy")}
              </Text>
            </View>
            <TouchableOpacity onPress={() => annulerConge(item.id)}>
              <MaterialIcons name="delete" size={28} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Modal Ajout */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouveau Congé</Text>

            <TextInput
              placeholder="ID Employé"
              value={selectedUserId}
              onChangeText={setSelectedUserId}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.label}>Date de début</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={dateDebut}
              onChangeText={setDateDebut}
              style={styles.input}
            />

            <Text style={styles.label}>Date de fin</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={dateFin}
              onChangeText={setDateFin}
              style={styles.input}
            />

            <View style={styles.buttons}>
              <Button title="Annuler" onPress={() => setModalVisible(false)} color="#95a5a6" />
              <Button title="Ajouter" onPress={ajouterConge} color="#05aa65" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", paddingTop: 40 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 20 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 3,
  },
  user: { fontWeight: "bold", fontSize: 16 },
  empty: { textAlign: "center", marginTop: 50, color: "#777", fontSize: 16 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#05aa65",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "90%",
    elevation: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  label: { marginBottom: 5, color: "#555", fontWeight: "600" },
  buttons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
});