import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useRoute } from '@react-navigation/native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function ({ navigation }) {
  const [nameScreen, setNameScreen] = useState("");
  const [nameConsultancy, setNameConsultancy] = useState("");
  const [goals, setGoals] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const [folders, setFolders] = useState([]);
  const { data, isConsultancy } = useRoute().params;
  const borderBottomWidth = Array.from({ length: 2 }, () => useSharedValue(1));
  const borderColor = Array.from({ length: 2 }, () => useSharedValue('#939393'));

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

  const sendUpdate = async (newData) => {
    await axios.post("http://192.168.1.103:3002/modifyJson", newData, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(async response => {
        if (isConsultancy) {
          folders.map(async folderName => {
            const sendData = JSON.stringify({
              prefix: `Consultorías TI/${nameConsultancy}/Observaciones/${folderName}/`,
              modifications: [ { field: "nameConsultancy", value: nameConsultancy } ],
              notRecursive: false,
            });

            await axios.post("http://192.168.1.103:3002/modifyJson", sendData, {
              headers: {
                'Content-Type': 'application/json'
              },
            }).then(async response => {
                navigation.navigate("Home");
              }).catch(error => {
                console.log(error.response.data);
              });
          });
        }

        navigation.navigate("Home");
      }).catch(error => {
        setInfo(error.response.data);
      });
  };

  const updateDetails = async () => {
    const verifyData = JSON.stringify({
      prefix: 
        isConsultancy ? 
          `Consultorías TI/${nameConsultancy}` : 
          `Consultorías TI/${data.nameConsultancy}/Observaciones/${nameScreen}`,
    });

    await axios.post("http://192.168.1.103:3002/nameFolders", verifyData, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(async response => {
        const newData = JSON.stringify({
          prefix: 
            isConsultancy ? 
              `Consultorías TI/${data.nameConsultancy}/` : 
              `Consultorías TI/${data.nameConsultancy}/Observaciones/${data.nameScreen}/`,
          modifications:
            isConsultancy ? 
              [
                { field: "nameConsultancy", value: nameConsultancy },
                { field: "goals", value: goals }
              ] :
              [
                { field: "nameScreen", value: nameScreen }
              ],
          notRecursive: true,
        });
        const folderNames = response.data;

        if (isConsultancy ? data.nameConsultancy !== nameConsultancy : data.nameScreen !== nameScreen) {
          if (isConsultancy ? folderNames.includes(nameConsultancy) : folderNames.includes(nameScreen)) {
            isConsultancy ? setInfo("La consultoría ya existe") : setInfo("La observación ya existe")
          } else {
            sendUpdate(newData);
          }
        } else {
          sendUpdate(newData);
        }
      }).catch(error => {
        setInfo(error.response.data);
      });
  };
  
  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  useEffect(() => {
    if (isConsultancy) {
      setNameConsultancy(data.nameConsultancy);
      setGoals(data.goals);
    } else {
      setNameScreen(data.nameScreen);
    }
  }, []);

  useEffect(() => {
    if (isConsultancy) {
      const sendData = JSON.stringify({
        prefix: `Consultorías TI/${data.nameConsultancy}/Observaciones/`,
      });

      axios.post('http://192.168.1.103:3002/nameFolders', sendData, {
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(response => {
          setFolders(response.data);
        })
        .catch(error => {
          setInfo(error.response.data);
        });
    }
  }, []);

  return (
    <KeyboardAvoidingView behavior="height" style={{ flexGrow: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="folder-information" style={styles.lockIcon} />
            <Text style={styles.titleHeader}>Modifica info</Text>
          </View>
          <View style={[
            styles.textInputContainer,
            isConsultancy ?
              { height: 100 } :
              { height: 50 }
            ]}
          >
            <View>
              <Animated.View
                style={[
                  styles.textInput,
                  textInputStyles(0),
                  styles.textInputNameView,
                ]}
              >
                <TextInput
                  placeholder={`Introduce un nombre de ${isConsultancy ? 'consultoría' : 'observación'}`}
                  value={isConsultancy ? nameConsultancy : nameScreen}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={true}
                  onChangeText={(text) => isConsultancy ? setNameConsultancy(text) : setNameScreen(text)}
                  onFocus={() => {handleFocus(0)}}
                  onBlur={() => {handleBlur(0)}}
                />
              </Animated.View>
            </View>
            {isConsultancy ?
              <View>
                <Animated.View
                  style={[
                    styles.textInput,
                    textInputStyles(1),
                    styles.textInputGoalsView,
                  ]}
                >
                  <TextInput
                    placeholder="Introduce los objetivos"
                    value={goals.join("\n")}
                    autoCapitalize="sentences"
                    autoCompleteType="off"
                    autoCorrect={true}
                    multiline={true}
                    onChangeText={(text) => {
                      if (text.endsWith("\n")) {
                        setGoals(text.split("\n"));
                      } else {
                        setGoals(text.split("\n").filter(goal => goal.trim() !== ""));
                      }
                    }}
                    onFocus={() => {
                      handleFocus(1);
                      Keyboard.addListener("keyboardDidHide", setGoals(goals.join("\n").split("\n").filter(goal => goal.trim() !== "")));
                    }}
                    onBlur={() => {
                      handleBlur(1);
                      Keyboard.addListener("keyboardDidHide", setGoals(goals.join("\n").split("\n").filter(goal => goal.trim() !== ""))).remove();
                    }}
                  />
                </Animated.View>
              </View> :
              null
            }
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              updateDetails();
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
  },
  lockIcon: {
    fontSize: 48,
    marginVertical: 20,
    color: 'black',
  },
  titleHeader: {
    color: 'black',
    fontWeight: '500',
    marginBottom: 15,
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
  textInputGoalsView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
    maxHeight: 35,
  },
  textInputPassword: {
    width: '90%',
  },
  textInputContainer: {
    marginTop: 10,
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