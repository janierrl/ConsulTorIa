import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Modal
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function ({ navigation }) {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const borderBottomWidth = Array.from({ length: 5 }, () => useSharedValue(1));
  const borderColor = Array.from({ length: 5 }, () => useSharedValue('#939393'));

  const isAnyFieldEmpty = () => {
    return !name || !lastname || !user || !email || !password;
  };

  const correctInput = (input) => {
    return input
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const removeSpace = (input) => {
    return input
      .replace(/\s+/g, '');
  };

  const correctEmail = (input) => {
    return input
      .toLowerCase()
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

  const register = async () => {
    const data = JSON.stringify({
      name: name,
      lastname: lastname,
      username: user,
      email: email,
      password: password
    });

    await axios.post("http://192.168.1.103:3004/verifyEmailRegister", data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => {
        setInfo(response.data);
        navigation.navigate("VerifyEmail", { email: email, role: 'register', data: data });
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
            <MaterialCommunityIcons name="account" style={styles.accountIcon} />
            <Text style={styles.titleHeader}>Registra una cuenta</Text>
          </View>
          <View style={styles.textInputContainer}>
            <View>
              <Animated.View
                style={[
                  styles.textInput,
                  textInputStyles(0),
                  styles.textInputNameView,
                ]}
              >
                <TextInput
                  placeholder="Introduce tu nombre"
                  value={name}
                  maxLength={50}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  onChangeText={(text) => {setName(correctInput(text))}}
                  onFocus={() => {handleFocus(0)}}
                  onBlur={() => {
                    setName(name.trim());
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
                  styles.textInputLastnameView,
                ]}
              >
                <TextInput
                  placeholder="Introduce tus apellidos"
                  value={lastname}
                  maxLength={50}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  onChangeText={(text) => {setLastname(correctInput(text))}}
                  onFocus={() => {handleFocus(1)}}
                  onBlur={() => {
                    setLastname(lastname.trim());
                    handleBlur(1);
                  }}
                />
              </Animated.View>
            </View>
            <View>
              <Animated.View
                style={[
                  styles.textInput,
                  textInputStyles(2),
                  styles.textInputUserView,
                ]}
              >
                <TextInput
                  placeholder="Introduce un nombre de usuario"
                  value={user}
                  maxLength={20}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  onChangeText={(text) => {setUser(removeSpace(text))}}
                  onFocus={() => {handleFocus(2)}}
                  onBlur={() => {
                    setUser(user.trim());
                    handleBlur(2);
                  }}
                />
              </Animated.View>
            </View>
            <View>
              <Animated.View
                style={[
                  styles.textInput,
                  textInputStyles(3),
                  styles.textInputEmailView,
                ]}
              >
                <TextInput
                  placeholder="Introduce un correo"
                  value={email}
                  maxLength={50}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={(text) => {setEmail(correctEmail(text))}}
                  onFocus={() => {handleFocus(3)}}
                  onBlur={() => {
                    setEmail(email.trim());
                    handleBlur(3);
                  }}
                />
              </Animated.View>
            </View>
            <View>
              <Animated.View
                style={[
                  styles.textInput,
                  textInputStyles(4),
                  styles.textInputPasswordView,
                ]}
              >
                <TextInput
                  style={styles.textInputPassword}
                  placeholder="Introduce una contraseña"
                  value={password}
                  maxLength={20}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  secureTextEntry={!passwordVisible}
                  onChangeText={(text) => setPassword(removeSpace(text))}
                  onFocus={() => {handleFocus(4)}}
                  onBlur={() => {
                    setPassword(password.trim());
                    handleBlur(4);
                  }}
                />
                <TouchableOpacity onPress={handleIconPress} style={styles.passwordVisibilityToggle}>
                  <Feather
                    name={passwordVisible ? "eye" : "eye-off"}
                    size={22}
                    color="#939393"
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            disabled={isAnyFieldEmpty()}
            onPress={() => {
              register();
            }}
          >
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <View style={styles.signupContainer}>
              <Text>¿Ya tienes una cuenta?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Text style={styles.linkText}>
                  Autentícate aquí
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
  accountIcon: {
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
  textInputNameView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  textInputLastnameView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
  },
  textInputUserView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
  },
  textInputEmailView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 150,
  },
  textInputPasswordView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 200,
  },
  textInputPassword: {
    width: '90%',
  },
  textInputContainer: {
    marginTop: 35,
    height: 250,
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