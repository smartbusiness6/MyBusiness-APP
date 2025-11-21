// app/(tabs)/rh/professions.tsx
import { useAuth } from "@/app/_layout";
import { BASE_URL, setHeader } from "@/config/config";
import { AlertModal } from "@/src/components/Modals/Modals";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Profession {
  id: number;
  poste: string;
  salaire: number;
  idEntreprise: number;
  nombreEmployes?: number;
}

export default function ProfessionsScreen() {
  const { user } = useAuth();
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [professionToDelete, setProfessionToDelete] = useState<Profession | null>(null);

  useEffect(() => {
    if (user?.user.role === "ADMIN" || user?.user.role === "SUPERADMIN") {
      setIsAdmin(true);
    }
    fetchProfessions();
  }, []);

  const fetchProfessions = async () => {
    try {
      const res = await fetch(`${BASE_URL}/rh/profession`, {
        headers: setHeader(user?.token!),
      });
      const data = await res.json();
      setProfessions(data);
    } catch (err) {
      console.log("Erreur chargement professions:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfessions();
  };

  const deleteProfession = async () => {
    if (!professionToDelete) return;

    try {
      await fetch(`${BASE_URL}/rh/profession/${professionToDelete.id}`, {
        method: "DELETE",
        headers: setHeader(user?.token!),
        body: JSON.stringify({
          idUser: user?.user.id,
          token: user?.token,
        }),
      });

      setProfessions((prev) => prev.filter((p) => p.id !== professionToDelete.id));
      setShowDeleteModal(false);
      setProfessionToDelete(null);
    } catch (err) {
      console.log("Erreur suppression:", err);
    }
  };

  const confirmDelete = (profession: Profession) => {
    setProfessionToDelete(profession);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#05aa65" />
        <Text style={styles.loadingText}>Chargement des professions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Professions & Postes</Text>
        {isAdmin && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push("/rh/profession/add")}
          >
            <MaterialIcons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Liste */}
      <FlatList
        data={professions}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#05aa65"]} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="work-off" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Aucune profession enregistrée</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.professionCard}>
            <View style={styles.info}>
              <Text style={styles.poste}>{item.poste}</Text>
              <Text style={styles.salaire}>
                {item.salaire.toLocaleString()} Ar/mois
              </Text>
              {item.nombreEmployes !== undefined && (
                <Text style={styles.employes}>
                  {item.nombreEmployes} employé{item.nombreEmployes > 1 ? "s" : ""}
                </Text>
              )}
            </View>

            {isAdmin && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => router.push(`/rh/profession/update/${item.id}`)}
                >
                  <MaterialIcons name="edit" size={22} color="#05aa65" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => confirmDelete(item)}
                >
                  <MaterialIcons name="delete" size={22} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
      
      {/* Modal de suppression */}
      {showDeleteModal && professionToDelete && (
        <AlertModal
          title="Supprimer la profession"
          text={`Voulez-vous vraiment supprimer le poste "${professionToDelete.poste}" ?`}
          closeModal={() => setShowDeleteModal(false)}
          confirm={deleteProfession}
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  addBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 30,
  },
  professionCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  info: {
    flex: 1,
  },
  poste: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  salaire: {
    fontSize: 16,
    color: "#05aa65",
    fontWeight: "600",
    marginTop: 4,
  },
  employes: {
    fontSize: 14,
    color: "#777",
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  editBtn: {
    backgroundColor: "#e8f5e8",
    padding: 10,
    borderRadius: 12,
  },
  deleteBtn: {
    backgroundColor: "#fdf2f2",
    padding: 10,
    borderRadius: 12,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
  },
});