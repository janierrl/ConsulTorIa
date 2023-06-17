import React, { useState, useEffect } from "react";
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
  TopNav,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [olduser, setOlduser] = useState("");
  const [oldemail, setOldemail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then(async token => {
        await axios.get("http://192.168.1.100:3004/me", {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
        }).then(async response => {
          setUser(response.data.username);
          setEmail(response.data.email);
          setOlduser(response.data.username);
          setOldemail(response.data.email);
        }).catch(error => {
          console.log(error.response.data);
        });
      })
      .catch(error => {
        console.log('Error al recuperar el token:', error);
      });
  }, []);

  const updateAccount = async () => {
    const data = JSON.stringify({
      username: user,
      email: email,
      password: password,
      olduser: olduser,
      oldemail: oldemail
    });

    await axios.post("http://192.168.1.100:3004/verifyEmailUpdate", data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => {
      Alert.alert(
        response.data,
        navigation.navigate("VerifyEmail", { email: email, role: 'update', data: data })
      );
    }).catch(error => {
      Alert.alert(error.response.data);
    });
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <TopNav
          middleContent="Actualizar cuenta"
          leftContent={
            <Ionicons
              name="chevron-back"
              size={20}
              color={isDarkmode ? themeColor.white100 : themeColor.black}
            />
          }
          leftAction={() => navigation.goBack()}
        />
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
              Actualiza tu cuenta
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
              text={loading ? "Cargando" : "Actualizar"}
              onPress={() => {
                updateAccount();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}