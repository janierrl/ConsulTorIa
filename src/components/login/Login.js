import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Modal,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function ({ navigation }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const borderBottomWidth = Array.from({ length: 2 }, () => useSharedValue(1));
  const borderColor = Array.from({ length: 2 }, () => useSharedValue('#939393'));

  const isAnyFieldEmpty = () => {
    return !user || !password;
  };

  const removeSpace = (input) => {
    return input
      .replace(/\s+/g, '');
  };

  const textInputStyles = (index) => {
    return useAnimatedStyle(() => {
      return {
        borderBottomWidth: borderBottomWidth[index].value,
        borderBottomColor: borderColor[index].value,
      };
    });
  };

  const animateBorder = (index, focused) => {
    borderBottomWidth[index].value = withTiming(focused ? 2 : 1, {
      duration: 75,
      easing: Easing.ease,
    });
    borderColor[index].value = focused ? 'blue' : '#939393';
  };

  const handleFocus = (index) => {
    animateBorder(index, true);
  };

  const handleBlur = (index) => {
    animateBorder(index, false);
  };

  const handleIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const login = async () => {
    const data = JSON.stringify({
      username: user,
      password: password
    });

    await axios.post("http://192.168.1.103:3004/signin", data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(async response => {
      const { auth, token } = response.data;
  
      if (auth) {
        await AsyncStorage.setItem('token', token)
          .then(() => {
            console.log('Token guardado exitosamente');
          })
          .catch(error => {
            console.log('Error al guardar el token:', error);
          });
          
          setInfo(`Bienvenido ${user} a ConsulTorIa`);
          navigation.navigate("OK")
      }
    }).catch(error => {
      setInfo(error.response.data);
    });
  };
  
  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  return (
    <KeyboardAvoidingView behavior="height" style={{ flexGrow: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="lock" style={styles.lockIcon} />
            <Text style={styles.titleHeader}>Inicia sesión</Text>
          </View>
          <View style={styles.textInputContainer}>
            <View>
              <Animated.View
                style={[
                  styles.textInput,
                  textInputStyles(0),
                  styles.textInputUserView,
                ]}
              >
                <TextInput
                  placeholder="Introduce tu usuario"
                  value={user}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  onChangeText={(text) => {setUser(removeSpace(text))}}
                  onFocus={() => {handleFocus(0)}}
                  onBlur={() => {
                    setUser(user.trim());
                    handleBlur(0);
                  }}
                />
              </Animated.View>
            </View>
            <View>
              <Animated.View
                style={[
                  styles.textInput,
                  textInputStyles(1),
                  styles.textInputPasswordView,
                ]}
              >
                <TextInput
                  style={styles.textInputPassword}
                  placeholder="Introduce tu contraseña"
                  value={password}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  secureTextEntry={!passwordVisible}
                  onChangeText={(text) => {setPassword(removeSpace(text))}}
                  onFocus={() => {handleFocus(1)}}
                  onBlur={() => {
                    setPassword(password.trim());
                    handleBlur(1);
                  }}
                />
                <TouchableOpacity onPress={handleIconPress} style={styles.passwordVisibilityToggle}>
                  <Feather
                    name={passwordVisible ? "eye" : "eye-off"}
                    size={22}
                    color="black"
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            disabled={isAnyFieldEmpty()}
            onPress={() => {
              login();
            }}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <View style={styles.signupContainer}>
              <Text>¿No tienes cuenta?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Register");
                }}
              >
                <Text style={styles.linkText}>
                  Regístrate aquí
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ForgetPassword");
                }}
              >
                <Text style={styles.linkText}>
                  ¿Has olvidado tu contraseña?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {
              setIsModalVisible(false);
            }}
          >
            <TouchableOpacity
              style={styles.modalInfoOut}
              activeOpacity={1}
              onPress={() => {
                setIsModalVisible(false);
              }}
            >
              <TouchableOpacity
                style={styles.modalInfo}
                activeOpacity={1}
              >
                <Text style={styles.modalInfoTextHeader}>{infoModal}</Text>
                <View style={styles.containerModalInfoButton}> 
                  <TouchableOpacity 
                    style={styles.modalInfoButton}
                    onPress={() => {
                      setIsModalVisible(false);
                    }}
                  >
                    <Text>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 48,
    color: 'black',
    marginBottom: 35,
  },
  titleHeader: {
    color: 'black',
    fontWeight: '500',
  },
  textInput: {
    marginBottom: 20,
  },
  textInputUserView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  textInputPasswordView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
  },
  textInputPassword: {
    width: '90%',
  },
  textInputContainer: {
    marginTop: 35,
    height: 100,
  },
  passwordVisibilityToggle: {
    
  },
  button: {
    marginTop: 35,
    backgroundColor: '#3366FF',
    borderRadius: 7,
    paddingVertical: 13,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
  },
  linkText: {
    marginLeft: 5,
    fontWeight: '500',
  },
  forgotPasswordContainer: {
    marginTop: 10,
  },
  textContainer: {
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInfoOut: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalInfo: {
    alignItems: 'center',
    backgroundColor: 'white',
    margin:20,
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  modalInfoTextHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  containerModalInfoButton: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 25,
  },
  modalInfoButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});