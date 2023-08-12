import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    const data = JSON.stringify({
      username: user,
      email: email,
      password: password
    });

    await axios.post("http://192.168.1.103:3004/verifyEmailRegister", data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => {
      Alert.alert(
        response.data,
        navigation.navigate("VerifyEmail", { email: email, role: 'register', data: data })
      );
    }).catch(error => {
      Alert.alert(error.response.data);
    });
  };

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
              backgroundColor: isDarkmode ? "#17171E" : themeColor.white,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 100,
                width: 100,
              }}
              source={require("../../../assets/register.png")}
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
              fontFamily="Lato-Regular"
              fontWeight="bold"
              size="h3"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
            >
              Registra una cuenta
            </Text>

            <Text fontFamily="Lato-Regular">
              Usuario
            </Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              fontFamily="Lato-Regular"
              placeholder="Introduce un nombre de usuario"
              value={user}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setUser(text)}
            />

            <Text fontFamily="Lato-Regular" style={{ marginTop: 15 }}>
              Correo
            </Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              fontFamily="Lato-Regular"
              placeholder="Introduce un correo"
              value={email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />

            <Text fontFamily="Lato-Regular" style={{ marginTop: 15 }}>
              Contraseña
            </Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              fontFamily="Lato-Regular"
              placeholder="Introduce una contraseña"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <Button
              fontFamily="Lato-Regular"
              text={loading ? "Cargando" : "Crear"}
              onPress={() => {
                register();
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
              <Text fontFamily="Lato-Regular" size="md">
                ¿Ya tienes una cuenta?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Login");
                }}
              >
                <Text
                  size="md"
                  fontFamily="Lato-Regular"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Autentícate aquí
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
                  fontFamily="Lato-Regular"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {isDarkmode ? "☀️ Tema claro" : "🌑 Tema oscuro"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}