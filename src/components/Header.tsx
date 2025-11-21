// components/Header.tsx
import { useAuth } from '@/app/_layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Pressable,
  Animated,
  Easing,
} from 'react-native';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogout = () => {
    toggleMenu();
    logout?.();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* Logo + Titre */}
      <View style={styles.left}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image
            source={require("../../assets/images/logo-smart.png")}
            style={styles.splashLogo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.title}>Smart Business</Text>
        </TouchableOpacity>
      </View>

      {/* Icônes droite */}
      <View style={styles.right}>
        <TouchableOpacity style={styles.iconButton}>
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
          <MaterialIcons name="notifications" size={26} color="#007bff" />
        </TouchableOpacity>

        {/* Avatar Profil */}
        <TouchableOpacity onPress={toggleMenu} style={styles.profileButton}>
          <View style={styles.profileCircle}>
            <MaterialIcons name="person" size={22} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Menu déroulant animé */}
      <Modal visible={menuVisible} transparent animationType="none">
        <Pressable style={styles.overlay} onPress={toggleMenu}>
          <Animated.View
            style={[
              styles.menuContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.userName}>{user?.user.nom || "Utilisateur"}</Text>
              <Text style={styles.userRole}>{user?.user.role}</Text>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  toggleMenu();
                  router.push(`/rh/${user?.user.id}`);
                }}
              >
                <MaterialIcons name="person-outline" size={22} color="#555" />
                <Text style={styles.menuText}>Mon Profil</Text>
              </TouchableOpacity>

              {user?.user.role === "ADMIN" && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    toggleMenu();
                    router.push('/abonnement');
                  }}
                >
                  <MaterialIcons name="card-membership" size={22} color="#555" />
                  <Text style={styles.menuText}>Abonnement</Text>
                </TouchableOpacity>
              )}

              <View style={styles.separator} />

              <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                <MaterialIcons name="logout" size={22} color="#e74c3c" />
                <Text style={[styles.menuText, { color: "#e74c3c" }]}>Déconnexion</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    zIndex: 1000,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  splashLogo: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  profileCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0056b3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Menu
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    top: 100,
    right: 16,
    width: 240,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  menuHeader: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  userRole: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 4,
  },
  menuItems: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
    marginHorizontal: 20,
  },
  logoutItem: {
    marginTop: 4,
  },
});