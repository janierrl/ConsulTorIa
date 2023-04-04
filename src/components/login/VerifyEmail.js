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
  const [code, setCode] = useState("");
  const { email, isRecoverAccount, data } = useRoute().params;
  const [loading, setLoading] = useState(false);

  const verifyEmail = async () => {
    const temp = JSON.stringify({
      email: email,
      code: code
    });

    await axios.post("http://192.168.1.100:3004/verifyCode", temp, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(async response => {
      Alert.alert(response.data);

      if (isRecoverAccount === false) {
        await axios.post("http://192.168.1.100:3004/signup", data, {
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(response => {
          const { auth, token } = response.data;
          if (auth) { navigation.navigate("Login") };
        });
      } else {
        navigation.navigate("NewPassword", { email: email })
      }
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
              Verificar correo
            </Text>
            <Text>Código</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Introduce tu código"
              value={code}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              onChangeText={(text) => setCode(text)}
            />

            <Button
              text={loading ? "Cargando" : "Verificar"}
              onPress={() => {
                verifyEmail();
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
