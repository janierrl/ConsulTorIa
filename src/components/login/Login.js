import React, { useState } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert, Keyboard, TouchableWithoutFeedback, ScrollView,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Image } from "react-native";
import {Layout,Text,TextInput,Button,useTheme,themeColor,} from "react-native-rapi-ui";
//import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
//import {initializeApp} from "firebase/app";
//import {firebaseConfig} from "../../../firebase-config";
const appId = "1047121222092614";

export default function ({ navigation }) {
    
  const { isDarkmode, setTheme } = useTheme();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //const app=initializeApp(firebaseConfig);
  //const auth = getAuth(app);
  const prueb=()=>{
    if (email == "gdzayas@gmail.com" && password =="123456"){
      Alert.alert(
        "Bienvenido Giovanni , a la herramienta ConsulTorIa ",
        navigation.navigate("OK"),)
    }else {
      Alert.alert(
        "Credenciales incorrectas ",
        )
    }
    }
  /*const createAccount=()=>{
    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
      console.log("Cuenta creada")
      const user= userCredential.user;
      console.log(user)
    })
    .catch(error =>{
      console.log(error)
    })
  }

  const login=()=>{
    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
      console.log("Se ha autenticado")
      const user= userCredential.user;
      console.log(user)
    })
    .catch(error =>{
      console.log(error)
    })
  }*/

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require("../../../assets/login.png")}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <Text
              fontWeight="bold"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
              size="h3"
            >
              Login
            </Text>
            <Text>Email</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your email"
              value={email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />

            <Text style={{ marginTop: 15 }}>Password</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your password"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <Button
              text={loading ? "Loading" : "Continue"}
              onPress={() => {
                prueb();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                justifyContent: "center",
              }}
            >
              <Text size="md">Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Register");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Register here
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ForgetPassword");
                }}
              >
                <Text size="md" fontWeight="bold">
                  Forget password
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 30,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  isDarkmode ? setTheme("light") : setTheme("dark");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {isDarkmode ? "☀️ light theme" : "🌑 dark theme"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
    );
    
}
