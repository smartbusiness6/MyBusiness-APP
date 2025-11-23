// app/(tabs)/_layout.tsx
import Header from '@/src/components/Header';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarActiveTintColor: '#058a5eff',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }
      }}
    >
      <Tabs.Screen
        name="ventes"
        options={{
          title: 'Ventes',
          tabBarIcon: ({ focused }) => (
            <View style={[focused && styles.homeIconContainer, focused && styles.homeIconActive]}>
              <MaterialIcons name="shopping-bag" size={32} color={focused ? "#fff" : "#888"} />
            </View>
          ),
          tabBarLabel: 'Ventes',
        }}
      />
      <Tabs.Screen
        name="stock"
        options={{
          title: 'Stocks',
          tabBarIcon: ({ focused }) => (
            <View style={[focused && styles.homeIconContainer, focused && styles.homeIconActive]}>
              <MaterialIcons name="inventory-2" size={32} color={focused ? "#fff" : "#888"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused }) => (
            <View style={[focused && styles.homeIconContainer, focused && styles.homeIconActive]}>
              <MaterialIcons name="home" size={32} color={focused ? "#fff" : "#888"} />
            </View>
          ),
          tabBarLabel: 'Accueil',
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: 'Finance',
          tabBarIcon:({ focused }) => (
            <View style={[focused && styles.homeIconContainer, focused && styles.homeIconActive]}>
              <MaterialIcons name="account-balance-wallet" size={32} color={focused ? "#fff" : "#888"} />
            </View>
          ),
          tabBarLabel: 'Finance',
        }}
      />
      <Tabs.Screen
        name="rh"
        options={{
          title: 'RH',
          tabBarIcon:({ focused }) => (
            <View style={[focused && styles.homeIconContainer, focused && styles.homeIconActive]}>
              <MaterialIcons name="people" size={32} color={focused ? "#fff" : "#888"} />
            </View>
          ),
          tabBarLabel: 'RH',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabBarItem: {
    flex: 1,
  },
  homeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    borderWidth: 5,
    borderColor: '#fff',
    elevation: 10,
    transitionDelay: ".8sec"
  },
  homeIconActive: {
    backgroundColor: '#058a5eff',
  },
});