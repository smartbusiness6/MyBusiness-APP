import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LoginResponse } from "../interfaces/interfaces";
import { AuthService } from "../services/AuthService";
import { BASE_URL } from "@/config/config";


export default function LoginScreen({ onLogin }: { onLogin: (body:LoginResponse) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  const handleLogin = () => {

    const formData:FormData = new FormData()
    formData.append("email",email)
    formData.append("password",password)

    console.log(formData.set("email",email),{email,password})

    fetch(`${BASE_URL}/auth/login`,{
      method:"POST",
      body:JSON.stringify({
        email,
        password
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(async (response:Response)=>{
      const body:LoginResponse = await response.json()
      if(body){
        onLogin(body)
      }
    })
  
  };

  // const handleLogin = ()=>{
  //     AuthService.login(email,password).then(async (response:LoginResponse)=>{
  //       const body = response
  //       if(body){
  //         onLogin(body)
  //       }
  //     })
  // }

  return (
    <View style={styles.loginContainer}>
      <Image
        source={require("../../assets/images/logo-smart.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.loginTitle}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Adresse email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholderTextColor={"#383736e0"}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={"#383736e0"}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <MaterialIcons name="login" size={22} color={"white"}/>
        <Text style={styles.loginButtonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
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
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#0cb89bff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});