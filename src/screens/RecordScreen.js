import React, {
  useState,
  useEffect,
  useCallback,
  useRef
} from "react"
import { View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Modal
} from "react-native"
import { Ionicons } from "@expo/vector-icons";
import io from "socket.io-client";
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function ({ navigation }) {
  const socket = io.connect("http://192.168.1.103:3001");
  const [isStartedRequest, setIsStartedRequest] = useState(false);
  const [isPlayedRequest, setIsPlayedRequest] = useState(false);
  const [isPausedRequest, setIsPausedRequest] = useState(true);
  const [isStartedResponse, setIsStartedResponse] = useState(false);
  const [isPlayedResponse, setIsPlayedResponse] = useState(false);
  const [isPausedResponse, setIsPausedResponse] = useState(true);
  const [isModalSaveVisible, setIsModalSaveVisible] = useState(false);
  const [isModalFinishVisible, setIsModalFinishVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const [isDiscarded, setIsDiscarded] = useState(false);
  const [isStartedConsultancy, setIsStartedConsultancy] = useState(false);
  const [timer, setTimer] = useState(0);
  const [startDate, setStartDate] = useState("");
  const startDateRef = useRef(startDate);
  const [endDate, setEndDate] = useState("");
  const endDateRef = useRef(endDate);
  const [startDateConsultancy, setStartDateConsultancy] = useState("");
  const startDateConsultancyRef = useRef(startDateConsultancy);
  const [endDateConsultancy, setEndDateConsultancy] = useState("");
  const endDateConsultancyRef = useRef(endDateConsultancy);
  const [state, setState] = useState("");
  const [nameScreen, setNameScreen] = useState("");
  const nameScreenRef = useRef(nameScreen);
  const { dataParams } = useRoute().params;
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

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const start = async () => {
    setIsStartedRequest(true);
    setIsPlayedRequest(!isPlayedRequest);
    setIsPausedRequest(!isPausedRequest);
  }

  const stop = async () => {
    setIsModalSaveVisible(true);
  }

  const discard = async () => {
    setIsDiscarded(true);
    setIsStartedRequest(false);
  }

  const upload = async () => {
    const data = JSON.stringify({
      prefix: `Consultorías TI/${dataParams.nameConsultancy}/Observaciones/${nameScreenRef.current}`,
      bucket: dataParams.bucket
    });

    await axios.post("http://192.168.1.103:3002/nameFolders", data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(async response => {
      const folderNames = response.data;

      if (folderNames.includes(nameScreenRef.current)) {
        setInfo('La observación ya existe');
        setIsModalSaveVisible(false);
      } else {
        setIsDiscarded(false);
        setIsStartedRequest(false);
      }
    }).catch(error => {
      setInfo(error.response.data);
    });
  }

  const finish = async () => {
    setIsModalFinishVisible(false);
    navigation.navigate("Home");
  }
  
  const startMessage = async () => {
    socket.emit("start");
  };

  const stopMessage = async () => {
    socket.emit("stop");
  };

  const continueMessage = async () => {
    socket.emit("continua");
  };

  const pauseMessage = async () => {
    socket.emit("pausa");
  };

  const uploadMessage = async () => {
    socket.emit("upload", {
      nameScreen: nameScreenRef.current,
      startDate: startDateRef.current,
      endDate: endDateRef.current,
      nameConsultancy: dataParams.nameConsultancy,
      startDateConsultancy: startDateConsultancyRef.current,
      endDateConsultancy: endDateConsultancyRef.current,
      author: dataParams.author,
      entity: dataParams.entity, 
      ueb: dataParams.ueb, 
      unit: dataParams.unit, 
      area: dataParams.area, 
      process: dataParams.process, 
      worker: dataParams.worker,
      observationType: dataParams.observationType,
      view: dataParams.view,
      collaborators: dataParams.collaborators,
      goals: dataParams.goals,
      bucket: dataParams.bucket
    });
  };

  const startResponse = useCallback(() => {
    setIsStartedResponse(true);
    setIsPlayedResponse(!isPlayedResponse);
    setIsPausedResponse(!isPausedResponse);
  }, [isPlayedResponse, isPausedResponse]);

  const discardResponse =  useCallback(() => {
    setIsStartedResponse(false);
    setIsModalSaveVisible(false);
    setTimer(0);
  }, []);

  const uploadResponse = useCallback(() => {
    setIsStartedResponse(false);
    setIsModalSaveVisible(false);
    setIsModalFinishVisible(true);
    setTimer(0);
    uploadMessage();
  }, []);

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  useEffect(() => {
    if (state === 'start') {
        startMessage();
    } else if (state === 'stop') {
        stopMessage();
    } else if (state === 'continue') {
        continueMessage();
    } else if (state === 'pause') {
        pauseMessage();
    }
  }, [state]);

  useEffect(() => {
    let intervalId;

    if (isPlayedResponse) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    };

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlayedResponse]);

  useEffect(() => {
    if (isPlayedRequest) {
      setState('continue');
    }
  }, [isPlayedRequest]);

  useEffect(() => {
    if (isPausedRequest) {
      setState('pause');
    }
  }, [isPausedRequest]);

  useEffect(() => {
    if (isStartedRequest) {
      setState('start');
    } else {
      setState('stop');
    }
  }, [isStartedRequest]);

  useEffect(() => {
    let currentDate = new Date();
    let hour = currentDate.getHours();
    let minute = currentDate.getMinutes();
    let second = currentDate.getSeconds();
    let formattedHour = hour > 12 ? hour - 12 : hour;
    let period = hour >= 12 ? 'p.m.' : 'a.m.';
    let formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()} ${formattedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')} ${period}`;
    
    if (isStartedResponse) {
      setStartDate(formattedDate);
      startDateRef.current = formattedDate;

      if (!isStartedConsultancy) {
        setIsStartedConsultancy(true);
        setStartDateConsultancy(formattedDate);
        startDateConsultancyRef.current = formattedDate;
      }
    } else {
      if (isStartedConsultancy) {
        if (!isDiscarded) {
          setEndDateConsultancy(formattedDate);
          endDateConsultancyRef.current = formattedDate;
        }
      }
    }

    if (isPausedResponse) {
      setEndDate(formattedDate);
      endDateRef.current = formattedDate;
    }
  }, [isStartedResponse, isPausedResponse]);

  useEffect(() => {
    socket.on("started_record", startResponse);
    socket.on("paused_record", startResponse);

    if (isDiscarded) {
      socket.on("stopped_record", discardResponse);
    } else {
      socket.on("stopped_record", uploadResponse);
    }
  
    return () => {
      socket.off("started_record", startResponse);
      socket.off("paused_record", startResponse);
      
      if (isDiscarded) {
        socket.off("stopped_record", discardResponse);
      } else {
        socket.off("stopped_record", uploadResponse);
      }
    };
  }, [isDiscarded, startResponse, discardResponse, uploadResponse]);

  return(
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.counter}>
          {isStartedResponse &&
            <Text style={styles.counterText}>
              {formatTime(timer)}
            </Text>
          }
        </View>
        <View style={styles.containerControls}>
          <View style={styles.controls}>
            {isStartedResponse &&
              isPausedResponse &&
                <TouchableOpacity
                  style={[
                    styles.secondControl,
                    styles.reloadControl,
                  ]}
                  onPress={() => {
                    discard();
                  }}
                >
                  <Ionicons
                    name="reload-outline"
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
            }
            <TouchableOpacity
              style={styles.principalControl}
              onPress={() => {
                start();
              }}
            >
              {isPlayedResponse ?
                <Ionicons
                  name="pause-outline"
                  size={30}
                  color="black"
                /> :
                <View style={styles.playControl} />
              }
            </TouchableOpacity>
            {isStartedResponse &&
              isPausedResponse &&
                <TouchableOpacity
                  style={[
                    styles.secondControl,
                    styles.stopControl,
                  ]}
                  onPress={() => {
                    stop();
                  }}
                >
                  <Ionicons
                    name="stop"
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
            }
          </View>
          <Modal
            visible={isModalSaveVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {
              setIsModalSaveVisible(false);
            }}
          >
            <TouchableOpacity
              style={styles.modalInfoOut}
              activeOpacity={1}
              onPress={() => {
                setIsModalSaveVisible(false)
              }}
            >
              <TouchableOpacity
                style={styles.modalInfo}
                activeOpacity={1}
              >
                <Text style={styles.modalInfoTextHeader}>
                  ¿Desea guardar la grabación?
                </Text>
                <View style={styles.textInputContainer}>
                  <Animated.View
                    style={[
                      styles.textInput,
                      textInputStyles,
                    ]}
                  >
                    <TextInput
                      placeholder="Introduce un nombre"
                      value={nameScreen}
                      autoCapitalize="none"
                      autoCompleteType="off"
                      autoCorrect={true}
                      onChangeText={(text) => {
                        setNameScreen(text);
                        nameScreenRef.current = text;
                      }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </Animated.View>
                </View>
                <View style={styles.optionsModal}>
                  <TouchableOpacity
                    style={styles.modalInfoButton}
                    onPress={() => {
                      setIsModalSaveVisible(false);
                    }}
                  >
                    <Text>Cancelar</Text>
                  </TouchableOpacity>
                  <Text style={styles.separatorOptions}>
                    |
                  </Text>
                  <TouchableOpacity
                    style={styles.modalInfoButton}
                    onPress={() => {
                      discard();
                    }}
                  >
                    <Text>Descartar</Text>
                  </TouchableOpacity>
                  <Text style={styles.separatorOptions}>
                    |
                  </Text>
                  <TouchableOpacity
                    style={styles.modalInfoButton}
                    onPress={() => {
                      upload();
                    }}
                  >
                    <Text>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
          <Modal
            visible={isModalFinishVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {
              setIsModalFinishVisible(false);
            }}
          >
            <TouchableOpacity
              style={styles.modalInfoOut}
              activeOpacity={1}
              onPress={() => {
                setIsModalFinishVisible(false)
              }}
            >
              <TouchableOpacity
                style={styles.modalInfo}
                activeOpacity={1}
              >
                <Text style={styles.modalInfoTextHeader}>
                  ¿Desea finalizar la consultoría?
                </Text>
                <View style={styles.containerModalInfoButton}>
                  <TouchableOpacity
                    style={styles.modalInfoButton}
                    onPress={() => {
                      setIsModalFinishVisible(false);
                    }}
                  >
                    <Text>Continuar</Text>
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.separatorOptions,
                      styles.separatorOptionsFinish,
                    ]}
                  >
                    |
                  </Text>
                  <TouchableOpacity
                    style={styles.modalInfoButton}
                    onPress={() => {
                      finish();
                    }}
                  >
                    <Text>Finalizar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
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
                      setIsModalSaveVisible(true);
                    }}
                  >
                    <Text>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>
      </View>
    </ScrollView> 
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingBottom: 20,
      justifyContent: "center",
      alignContent: "center",
      backgroundColor: 'white',
    },
    counter:{
      flex: 1, 
      justifyContent: 'flex-end', 
      alignItems: 'center',
    },
    counterText:{
      fontSize: 55, 
      textAlign: 'center',
    },
    containerControls: {
      flex: 1, 
      justifyContent: 'flex-end', 
      alignItems: 'center',
    },
    controls: {
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'flex-end',
    },
    secondControl: {
      width: 40,
      height: 40,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
    },
    reloadControl: {
      marginRight: 70,
    },
    stopControl: {
      marginLeft: 70,
    },
    principalControl: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      borderWidth: 0.5,
      borderColor: '#6c6c6c',
      borderStyle: 'solid',
    },
    playControl: {
      width: 40,
      height: 40,
      borderRadius: 25,
      backgroundColor: '#FF3F35',
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
    optionsModal: {
      width: '100%',
      flexDirection: 'row', 
      justifyContent: 'space-between',
      marginTop: 10,
    },
    separatorOptions: {
      color: '#E5E5E5',
      justifyContent: 'center',
      alignItems: 'center',
    },
    separatorOptionsFinish: {
      marginLeft: 23,
      marginRight: 23,
    },
    textInputContainer: {
      width: '100%',
      marginVertical: 10,
      height: 30,
    },
    textInput: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
    },
});