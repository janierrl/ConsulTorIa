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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function ({ navigation }) {
  const [password, setPassword] = useState("");
  const { email } = useRoute().params;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const borderBottomWidth = useSharedValue(1);
  const borderColor = useSharedValue('#939393');

  const textInputStyles = useAnimatedStyle(() => {
    return {
      borderBottomWidth: borderBottomWidth.value,
      borderBottomColor: borderColor.value,
    };
  });

  const animateBorder = (focused) => {
    borderBottomWidth.value = withTiming(focused ? 2 : 1, {
      duration: 75,
      easing: Easing.ease,
    });
    borderColor.value = focused ? 'blue' : '#939393';
  };

  const handleFocus = () => {
    animateBorder(true);
  };

  const handleBlur = () => {
    animateBorder(false);
  };

  const handleIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

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
        setInfo(response.data);
        navigation.navigate("Login");
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
            <MaterialCommunityIcons name="form-textbox-password" style={styles.passwordIcon} />
            <Text style={styles.titleHeader}>Cambia tu contraseña</Text>
          </View>
          <View style={styles.textInputContainer}>
            <View>
              <Animated.View
                style={[
                  styles.textInput,
                  textInputStyles,
                  styles.textInputPassword,
                ]}
              >
                <TextInput
                  placeholder="Introduce una contraseña"
                  value={password}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  secureTextEntry={!passwordVisible}
                  onChangeText={(text) => setPassword(text)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <TouchableOpacity onPress={handleIconPress} style={styles.passwordVisibilityToggle}>
                  <MaterialCommunityIcons
                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                    size={25}
                    color="#939393"
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              newPassword();
            }}
          >
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <View style={styles.signupContainer}>
              <Text>¿Ya tienes una cuenta?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Login");
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
  passwordIcon: {
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
  textInputPassword: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    down: 0,
  },
  textInputContainer: {
    marginTop: 35,
    height: 50,
  },
  passwordVisibilityToggle: {
    position: 'absolute',
    right: 0,
    top: 0,
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