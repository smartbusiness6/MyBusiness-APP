// components/Header.tsx
import { useAuth } from '@/app/_layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Header() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const {user} = useAuth()
  const [openProfile,setOpenProfile] = useState<boolean>(false)

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.title}>Smart Business</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.right}>
        {/* Notifications */}
        <TouchableOpacity style={styles.iconButton}>
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
          <MaterialIcons name="notifications" size={26} color="#007bff" />
        </TouchableOpacity>

        {/* Profil */}
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={()=>{
            setOpenProfile(!openProfile)
          }}
        >
          <View style={styles.profileCircle}>
            <MaterialIcons name="person" size={22} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {
        openProfile && <View
          style={{
            position: "absolute",
            right: 0,
            top: 70,
            backgroundColor: "#ffff"
          }}
        >
          <Text>{user?.user.nom}</Text>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    position: "relative"
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    width: 180,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0056b3',
    justifyContent: 'center',
    alignItems: 'center',
  },
});