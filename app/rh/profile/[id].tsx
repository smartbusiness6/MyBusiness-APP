// app/rh/[id]/index.tsx
import { BASE_URL, setHeader } from "@/config/config";
import { synthetisedActivite, userById } from "@/src/interfaces/interfaces";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../_layout";
import { conges } from "@/src/interfaces/models";

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [utilisateur, setUtilisateur] = useState<userById | null>(null);
  const [activites, setActivites] = useState<synthetisedActivite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUser = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      const response = await fetch(`${BASE_URL}/rh/staff/profile/${id}`, {
        method: "GET",
        headers: setHeader(user?.token ?? ""),
      });

      if (!response.ok) {
        throw new Error("Impossible de charger l'employé");
      }

      const data: userById = await response.json();
      setUtilisateur(data);

      // Parse des activités
      const parsed = data.activities.map((act) => ({
        ...act,
        action: typeof act.action === "string" ? JSON.parse(act.action) : act.action,
      }));

      // Tri par date décroissante
      const sorted = parsed.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setActivites(sorted);
    } catch (err) {
      Alert.alert("Erreur", "Impossible de charger les données");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) loadUser();
  }, [id]);

  const onRefresh = () => loadUser(true);

  // États de chargement
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#02927aff" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  if (!utilisateur) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error-outline" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>Employé non trouvé</Text>
      </View>
    );
  }

  const initials = utilisateur.nom
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header fixe */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>

          <Text style={styles.name}>{utilisateur.nom}</Text>
          <Text style={styles.role}>{utilisateur.profession.poste}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <MaterialIcons name="email" size={18} color="#fff" />
              <Text style={styles.infoText}>{utilisateur.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="work" size={18} color="#fff" />
              <Text style={styles.infoText}>{utilisateur.profession.poste}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="attach-money" size={18} color="#fff" />
              <Text style={styles.infoText}>
                {utilisateur.profession.salaire.toLocaleString()} Ar
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push(`/rh/update/${id}`)}
          >
            <MaterialIcons name="edit" size={20} color="#fff" />
            <Text style={styles.editText}>Modifier</Text>
          </TouchableOpacity>
        </View>

        {/* Section Activités */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Activité récente</Text>

          {activites.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="history" size={50} color="#ddd" />
              <Text style={styles.emptyText}>Aucune activité récente</Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {activites.map((act) => {
                const actionType = act.action.type || "Action inconnue";
                const actionData = act.action.data
                  ? typeof act.action.data === "object"
                    ? JSON.stringify(act.action.data)
                    : act.action.data
                  : "";

                return (
                  <View key={act.id} style={styles.activityCard}>
                    <View style={styles.activityIcon}>
                      <MaterialCommunityIcons
                        name={
                          actionType.includes("vente") || actionType.includes("Facturation")
                            ? "cash-register"
                            : actionType.includes("Approvisionnement")
                            ? "truck-delivery"
                            : actionType.includes("congé")
                            ? "beach"
                            : actionType.includes("Validation") || actionType.includes("Annulation")
                            ? "check-circle"
                            : "circle-edit-outline"
                        }
                        size={22}
                        color="#ca8f21"
                      />
                    </View>

                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>{actionType}</Text>
                      {actionData ? (
                        <Text style={styles.activityDetail} numberOfLines={1}>
                          {actionData}
                        </Text>
                      ) : null}
                    </View>

                    <Text style={styles.activityDate}>
                      {new Date(act.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 12,
    color: "#02927aff",
    fontSize: 16,
  },
  errorText: {
    marginTop: 12,
    color: "#e74c3c",
    fontSize: 16,
  },
  header: {
    backgroundColor: "#02927aff",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 55,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
    borderRadius: 30,
    zIndex: 10,
  },
  avatarWrapper: {
    position: "relative",
    marginVertical: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#fff",
    elevation: 10,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#02927aff",
  },
  leaveBadge: {
    position: "absolute",
    bottom: -5,
    right: -10,
    backgroundColor: "#e74c3c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  leaveText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  role: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 16,
  },
  infoContainer: {
    width: "100%",
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 12,
  },
  infoText: {
    color: "#fff",
    marginLeft: 12,
    fontSize: 15,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 20,
  },
  editText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  activitySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 10,
  },
  emptyText: {
    marginTop: 12,
    color: "#999",
    fontSize: 16,
  },
  activityList: {
    gap: 12,
  },
  activityCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    alignItems: "center",
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff8e1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: "600",
    color: "#2c3e50",
    fontSize: 15,
  },
  activityDetail: {
    color: "#7f8c8d",
    fontSize: 13,
    marginTop: 4,
  },
  activityDate: {
    fontSize: 12,
    color: "#95a5a6",
    textAlign: "right",
  },
});