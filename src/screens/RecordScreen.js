import React from "react"
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Modal } from "react-native"
import  { useState, useEffect, useCallback, useRef } from 'react'
import { Ionicons } from "@expo/vector-icons";
import io from "socket.io-client";
import {
    Layout,
    Button,
    TopNav,
    Section,
    SectionContent,
    themeColor,
    useTheme,
    Text,
    TextInput,
} from "react-native-rapi-ui";
import { useRoute } from '@react-navigation/native';
//import {Video} from "expo-av"

const Record = ({navigation}) => {

  //const videoStream = new MediaStream();
  const ws= React.useRef()
  const [status,setStatus] = React.useState({})
  const socket = io.connect("http://192.168.1.103:3001");
  const [isStartedRequest, setIsStartedRequest] = useState(false);
  const [isPlayedRequest, setIsPlayedRequest] = useState(false);
  const [isPausedRequest, setIsPausedRequest] = useState(true);
  const [isStartedResponse, setIsStartedResponse] = useState(false);
  const [isPlayedResponse, setIsPlayedResponse] = useState(false);
  const [isPausedResponse, setIsPausedResponse] = useState(true);
  const [isModalSaveVisible, setIsModalSaveVisible] = useState(false);
  const [isModalFinishVisible, setIsModalFinishVisible] = useState(false);
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
  const {
    nameConsultancy,
    observationType,
    goals,
    entidad,
    ueb,
    unidad,
    area,
    proc,
    trabajador
  } = useRoute().params;
  const [nameScreen, setNameScreen] = useState("");
  const nameScreenRef = useRef(nameScreen);
  const { isDarkmode } = useTheme();

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

    if (isPlayedRequest) {
      setState('continue');
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlayedRequest, isPlayedResponse]);

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
    setIsDiscarded(false);
    setIsStartedRequest(false);
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
      nameConsultancy: nameConsultancy,
      startDateConsultancy: startDateConsultancyRef.current,
      endDateConsultancy: endDateConsultancyRef.current,
      observationType: observationType,
      goals: goals
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
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <TopNav
          middleContent="Grabación de pantalla"
          leftContent={
            isStartedConsultancy ?
              null :
              <Ionicons
                name="chevron-back"
                size={20}
                color={isDarkmode ? themeColor.white100 : themeColor.black}
              />
          }
          leftAction={() => {
            isStartedConsultancy ?
              undefined :
              navigation.goBack();
          }}
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              paddingBottom: 20,
              justifyContent: "center",
              alignContent: "center",
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
              {isStartedResponse ?
                <Text
                  style={{
                    fontSize: 55, 
                    textAlign: 'center',
                  }}
                >
                  {formatTime(timer)}
                </Text> :
                null
              }
            </View>
            <View
              style={{ 
                flex: 1, 
                justifyContent: 'flex-end', 
                alignItems: 'center' 
              }}
            >
              <View 
                style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'center', 
                  alignItems: 'flex-end' 
                }}
              >
                {isStartedResponse ?
                  isPausedResponse ?
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 30,
                        marginRight: 70,
                      }}
                      onPress={() => {
                        discard();
                      }}
                    >
                      <Ionicons
                        name="reload-outline"
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity> :
                    null :
                  null
                }

                <TouchableOpacity
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: themeColor.white,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                    borderWidth: 0.5,
                    borderColor: themeColor.gray,
                    borderStyle: 'solid',
                  }}
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
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 25,
                        backgroundColor: themeColor.danger,
                      }}
                    />
                  }
                </TouchableOpacity>

                {isStartedResponse ?
                  isPausedResponse ?
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 30,
                        marginLeft: 70,
                      }}
                      onPress={() => {
                        stop();
                      }}
                    >
                      <Ionicons
                        name="stop"
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity> :
                    null :
                  null
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
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                  }}
                  activeOpacity={1}
                  onPress={() =>
                    setIsModalSaveVisible(false)
                  }
                >
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
                      margin:20,
                      borderRadius: 16,
                      paddingHorizontal: 30,
                      paddingVertical: 20,
                      elevation: 8,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.5,
                      shadowRadius: 4,
                    }}
                    activeOpacity={1}
                  >
                    <Text
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      ¿Desea guardar la grabación?
                    </Text>
                    <TextInput
                      containerStyle={{
                        marginTop: 25,
                      }}
                      placeholder="Introduce un nombre"
                      value={nameScreen}
                      autoCapitalize="none"
                      autoCompleteType="off"
                      autoCorrect={true}
                      onChangeText={(text) => {
                        setNameScreen(text);
                        nameScreenRef.current = text;
                      }}
                    />
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          setIsModalSaveVisible(false);
                        }}
                      >
                        <Text>Cancelar</Text>
                      </TouchableOpacity>
                      <Text
                        style={{ 
                          color: '#c0c0c0',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        |
                      </Text>
                      <TouchableOpacity
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          discard();
                        }}
                      >
                        <Text>Descartar</Text>
                      </TouchableOpacity>
                      <Text
                        style={{ 
                          color: '#c0c0c0',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        |
                      </Text>
                      <TouchableOpacity
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
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
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                  }}
                  activeOpacity={1}
                  onPress={() =>
                    setIsModalFinishVisible(false)
                  }
                >
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
                      margin:20,
                      borderRadius: 16,
                      paddingHorizontal: 30,
                      paddingVertical: 20,
                      elevation: 8,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.5,
                      shadowRadius: 4,
                    }}
                    activeOpacity={1}
                  >
                    <Text
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      ¿Desea finalizar la consultoría?
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row', 
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        marginTop: 25,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          setIsModalFinishVisible(false);
                        }}
                      >
                        <Text>Continuar</Text>
                      </TouchableOpacity>
                      <Text
                        style={{ 
                          color: '#c0c0c0',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginLeft: 23,
                          marginRight: 23,
                        }}
                      >
                        |
                      </Text>
                      <TouchableOpacity
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
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
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>  
  )
}
export default Record 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video:{
        flex:1,
        alignSelf:'stretch',
        borderColor:'black'
    },
    buttons:{
        margin:16,
        marginRight:20,
        flexDirection:'row'
    }
});