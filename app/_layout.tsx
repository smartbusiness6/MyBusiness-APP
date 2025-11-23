import Header from '@/src/components/Header';
import { AuthContextType, LoginResponse } from '@/src/interfaces/interfaces';
import LoginScreen from '@/src/screen/auth';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
  anchor: '(tabs)',
};

export const context = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
})

export const useAuth = () => useContext(context);

export default function RootLayout({children}:{children:LoginResponse}) {

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<LoginResponse | null>(null);
  
  const handleLogin = (body:LoginResponse)=>{
    console.log(body)
    setUser(body)
    loadUser(body)
    setIsLoggedIn(true)
  }

  useEffect(() => {    
    // Simule un chargement de 2 secondes pour le splash
    setTimeout(async () => {
      setIsLoading(false);
      await SplashScreen.hideAsync();
    }, 2000);
  }, []);

  // useEffect(()=>{
  //   loadUser();
  // },[])

  if (isLoading) {
    return <Splash />;
  }

  const loadUser = async (body:LoginResponse) => {
    const saved = body;
    console.log(body)
    if (saved) setUser(body);
  };

  const login = async (token: string, userData: LoginResponse) => {
    const userObj = { ...userData, token };
    setUser(userObj)
  };

  const logout = async () => {
    setUser(null);
  };

  // return (
  //   <context.Provider value={userInfo}>
  //     <ThemeProvider value={DefaultTheme}>
        // {
        //   isLoggedIn ? 
        //     <Stack>
        //       <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
        //     </Stack> : 

        //     <LoginScreen onLogin={(e)=>handleLogin(e)}/>
        // }
  //       <StatusBar style="auto" />
  //     </ThemeProvider>
  //   </context.Provider>
  // );

  //Debug
   return (
    <context.Provider value={{user,logout,login}}>
          {
            isLoggedIn ? 
              <ThemeProvider value={DefaultTheme}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
                  <Stack.Screen 
                    name="stock/[id]" 
                    options={{ 
                      headerShown: true,
                      header: ()=> <Header/>
                    }}
                  />
                </Stack> 
              </ThemeProvider>:

              <LoginScreen onLogin={(e)=>handleLogin(e)}/>
          }
        <StatusBar style="auto" />
    </context.Provider>
  );
}


// Écran Splash
function Splash() {
  return (
    <View style={styles.splash}>
      <Image
        source={require("../assets/images/logo-smart.png")}
        style={styles.splashLogo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },

  // Splash
  splash: {
    flex: 1,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogo: { width: 120, height: 120, marginBottom: 20 },
  splashText: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  loading: { marginTop: 20, color: "#fff", fontSize: 16 },

  // Login
  loginContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  logo: { width: 100, height: 100, marginBottom: 40 },
  loginTitle: { fontSize: 28, fontWeight: "bold", marginBottom: 40, color: "#333" },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});