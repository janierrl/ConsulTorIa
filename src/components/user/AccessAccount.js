import React, { useState, useEffect } from "react";
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
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function ({ navigation }) {
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const { dataParams } = useRoute().params;
  const borderBottomWidth = useSharedValue(1);
  const borderColor = useSharedValue('#939393');

  const isAnyFieldEmpty = () => {
    return !password;
  };

  const removeSpace = (input) => {
    return input
      .replace(/\s+/g, '');
  };

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

  const accessAccount = async () => {
    const data = JSON.stringify({
      username: user,
      password: password
    });

    await axios.post("http://192.168.1.103:3004/accessAccount", data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => {
      navigation.navigate("UpdateAccount", { data: dataParams })
    }).catch(error => {
      setInfo(error.response.data);
    });
  };

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then(async token => {
        await axios.get("http://192.168.1.103:3004/me", {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
        }).then(async response => {
          setUser(response.data.username);
        }).catch(error => {
          setInfo(error.response.data);
        });
      })
      .catch(error => {
        console.log('Error al recuperar el token:', error);
      });
  }, []);

  return (
    <KeyboardAvoidingView behavior="height" style={{ flexGrow: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="lock" style={styles.lockIcon} />
            <Text style={styles.titleHeader}>Accede a tu cuenta</Text>
          </View>
          <View style={styles.textInputContainer}>
            <View>
              <Animated.View
                style={[
                  styles.textInput,
                  textInputStyles,
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
                  onFocus={() => {handleFocus()}}
                  onBlur={() => {
                    setPassword(password.trim());
                    handleBlur();
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
              accessAccount();
            }}
          >
            <Text style={styles.buttonText}>Acceder</Text>
          </TouchableOpacity>
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
  textInputPasswordView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  textInputPassword: {
    width: '90%',
  },
  textInputContainer: {
    marginTop: 35,
    height: 50,
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