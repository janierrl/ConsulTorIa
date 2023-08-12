import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
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
import { useRoute } from '@react-navigation/native';
import axios from "axios";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [password, setPassword] = useState("");
  const { email } = useRoute().params;
  const [loading, setLoading] = useState(false);

  const newPassword = async () => {
    const data = JSON.stringify({
      email: email,
      password: password
    });
  
    await axios.post("http://192.168.1.103:3004/recoverAccount", data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => {
      Alert.alert(
        response.data,
        navigation.navigate("Login")
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
              backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require("../../../assets/forget.png")}
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
              Cambiar contraseña
            </Text>
            <Text>Contraseña</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Introduce una contraseña nueva"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />

            <Button
              text={loading ? "Cargando" : "Aceptar"}
              onPress={() => {
                newPassword();
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