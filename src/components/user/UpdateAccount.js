import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Modal
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
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
  const [photo, setPhoto] = useState("");
  const [olduser, setOlduser] = useState("");
  const [oldemail, setOldemail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const { data } = useRoute().params;
  const [passwordVisible, setPasswordVisible] = useState(false);
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

  const openImagePicker = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.granted) {
      const picker =  await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        aspect: [1, 1],
        quality: 1,
      });
      
      if (!picker.cancelled) {
        setPhoto(picker.base64);
      }
    } else {
      setInfo('Se requieren permisos para acceder a la cámara');
    }
  } 

  const updateAccount = async () => {
    const data = JSON.stringify({
      username: user,
      email: email,
      olduser: olduser,
      oldemail: oldemail
    });
    const formData = new FormData();

    formData.append("name", name);
    formData.append("lastname", lastname);
    formData.append("username", user);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("photo", photo);
    formData.append("olduser", olduser);

    await axios.post("http://192.168.1.103:3004/verifyEmailUpdate", data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => {
        setInfo(response.data);
        navigation.navigate("VerifyEmail", {
          email: email,
          role: 'update',
          data: formData
        });
    }).catch(error => {
      setInfo(error.response.data);
    });
  };

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  useEffect(() => {
    setName(data.name);
    setLastname(data.lastname);
    setUser(data.user);
    setEmail(data.email);
    setPhoto(data.photo);
    setOlduser(data.user);
    setOldemail(data.email);
  }, []);

  return (
    <KeyboardAvoidingView behavior="height" style={{ flexGrow: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <View
                style={[
                  styles.avatarContainer,
                  !photo &&
                    styles.noPhoto
                ]}
              >
                {photo ?
                  <Image
                    source={{
                      uri: `data:image/png;base64,${photo}`,
                    }}
                    style={styles.image}
                  /> :
                  <MaterialCommunityIcons name="account" style={styles.accountIcon} />
                }
              </View>
              <TouchableOpacity
                style={styles.cameraIcon}
                touchSoundDisabled={true}
                activeOpacity={1}
                onPress={() => {
                  openImagePicker();
                }}
              >
                <Feather name="camera" size={20} color="white" />
              </TouchableOpacity>
            </View>
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
              updateAccount();
            }}
          >
            <Text style={styles.buttonText}>Actualizar</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    width: 130,
    height: 130,
    borderRadius: 70,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  noPhoto: {
    borderWidth: 2.5,
    borderColor: 'black',
    borderStyle: 'solid',
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 70,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: '#3366FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountIcon: {
    fontSize: 125,
    marginTop: '16%',
    color: 'black',
  },
  checkIcon: {
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
    marginTop: 10,
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