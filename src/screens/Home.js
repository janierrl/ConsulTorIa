import React, {
  useState,
  useEffect,
  useCallback,
  useRef
} from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
  Modal
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

export default function ({ route, navigation }) {
  const [folders, setFolders] = useState([]);
  const [folderData, setFolderData] = useState([]);
  const [folderContent, setFolderContent] = useState({});
  const [folderThumbnail, setFolderThumbnail] = useState({});
  const [user, setUser] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const [optionsTop, setOptionsTop] = useState(0);
  const [optionsLeft, setOptionsLeft] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [isUpdateFolderData, setIsUpdateFolderData] = useState(false);
  const [isDisableDelete, setIsDisableDelete] = useState(false);
  const { isUpdateFolderDataParams } = route.params;
  const iconRefs = useRef([]);

  const getFoldersData = async () => {
    const data = JSON.stringify({
      prefix: 'Consultorías TI/',
      routeName: route.name,
      user: user,
      isConsultancy: true
    });

    console.log(data);

    await axios.post('http://192.168.1.103:3002/getFoldersData', data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => {
      setFolders(response.data.folderNames);
      setFolderContent(response.data.folderContent);
      setFolderThumbnail(response.data.folderThumbnail);
      })
      .catch(error => {
        setInfo(error.response.data);
      });
  };

  const parseDateString = (dateString) => {
    const parts = dateString.split(" ");
    const datePart = parts[0].split("/");
    const timePart = parts[1].split(":");
    return new Date(
      parseInt(datePart[2], 10),
      parseInt(datePart[1], 10) - 1,
      parseInt(datePart[0], 10),
      parseInt(timePart[0], 10),
      parseInt(timePart[1], 10),
      parseInt(timePart[2], 10)
    );
  };

  const calculateDuration = (startDate, endDate) => {
    const startParts = startDate.match(/(\d+)/g);
    const endParts = endDate.match(/(\d+)/g);

    const start = new Date(
      startParts[2], startParts[1] - 1, startParts[0],
      startParts[3], startParts[4], startParts[5]
    );
  
    const end = new Date(
      endParts[2], endParts[1] - 1, endParts[0],
      endParts[3], endParts[4], endParts[5]
    );
  
    const durationInMillis = end - start;
  
    const seconds = Math.floor(durationInMillis / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
  
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = remainingMinutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const onIconPress = (index) => {
    const iconRef = iconRefs.current[index];
    iconRef.measure((x, y, width, height, pageX, pageY) => {
      setOptionsTop(pageY + height);
      setOptionsLeft(pageX + width);
      setSelectedItemIndex(index);
      setShowOptions(true);
    });
  };

  const downloadConsultancy = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const data = JSON.stringify({
      prefix: `Consultorías TI/${folderName}/`,
      nameZip: folderName,
    });

    await axios.post("http://192.168.1.103:3002/downloadFolder", data, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer',
    }).then(async response => {
      setIsUpdateFolderData(true);
      setShowOptions(false);

      const base64Data = Buffer.from(response.data, 'binary').toString('base64');
  
      const directoryUri = `${FileSystem.documentDirectory}ConsulTorIa/Consultoría TI`;
      await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
  
      const zipFileName = `${folderName}.zip`;
      const zipFilePath = `${directoryUri}/${zipFileName}`;
  
      await FileSystem.writeAsStringAsync(zipFilePath, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      console.log('Zip file downloaded and saved:', zipFilePath);

      try {
        const files = await FileSystem.readDirectoryAsync(directoryUri);

        for (const fileName of files) {
          const fileInfo = await FileSystem.getInfoAsync(`${directoryUri}/${fileName}`);
          console.log(`File ${fileName} - Size: ${fileInfo.size} bytes`);
        }
      } catch (error) {
        setInfo(error.response.data);
      }
    }).catch(error => {
      setInfo(error.response.data);
    });
  };

  const deleteConsultancy = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const data = JSON.stringify({
      prefix: `Consultorías TI/${folderName}/`,
    });

    await axios.post("http://192.168.1.103:3002/deleteFile", data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(async response => {
      setIsUpdateFolderData(true);
      setShowOptions(false);
      getFoldersData();
    }).catch(error => {
      setInfo(error.response.data);
    });
  };

  const detailsConsultancy = async () => {
    setShowOptions(false);

    const folderName = folderData[selectedItemIndex].name;
    navigation.navigate("Details", {
      data: {
        user: user,
        thumbnail: folderThumbnail[folderName],
        nameConsultancy: folderName,
        startDateConsultancy: folderContent[folderName]?.startDateConsultancy,
        endDateConsultancy: folderContent[folderName]?.endDateConsultancy,
        duration: calculateDuration(
          folderContent[folderName]?.startDateConsultancy,
          folderContent[folderName]?.endDateConsultancy
        ),
        author: folderContent[folderName]?.author,
        view: folderContent[folderName]?.view,
        observationType: folderContent[folderName]?.observationType,
        entity: folderContent[folderName]?.entity,
        ueb: folderContent[folderName]?.ueb,
        unit: folderContent[folderName]?.unit,
        area: folderContent[folderName]?.area,
        process: folderContent[folderName]?.process,
        worker: folderContent[folderName]?.worker,
        collaborators: folderContent[folderName]?.collaborators,
        goals: folderContent[folderName]?.goals
      },
      isConsultancy: true
    });
  };
  
  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        getFoldersData();
      }
    }, [user])
  );

  useEffect(() => {
    const preparedFolderData = folders.map((folderName) => ({
      name: folderName,
      endDate: parseDateString(folderContent[folderName]?.endDateConsultancy),
    }));
    preparedFolderData.sort((a, b) => b.endDate - a.endDate);

    setFolderData(preparedFolderData);
  }, [folderThumbnail]);

  useEffect(() => {
    setIsUpdateFolderData(isUpdateFolderDataParams);
  }, [isUpdateFolderDataParams]);

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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {folderData.map((folderName, index) => (
          <TouchableOpacity
            key={folderName.name}
            style={[
              styles.containerItemList,
              { borderBottomWidth: index !== folders.length - 1 ? 1 : 0 },
            ]}
            onPress={() => {
              navigation.navigate("Consultancies", {
                nameConsultancy: folderData[index].name,
                author: folderContent[folderName.name].author,
                collaborators: folderContent[folderName.name].collaborators,
                user: user
              });
            }}
          >
            {folderThumbnail[folderName.name] && (
              <Image
                source={{
                  uri: `data:image/png;base64,${folderThumbnail[folderName.name]}`,
                }}
                style={styles.image}
              />
            )}
            <View style={styles.containerElementsItemList}>
              {folderContent[folderName.name] && (
                <View>
                  <View style={styles.headerElements}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode='middle'
                      style={styles.titleHeaderElements}
                    >
                      {folderContent[folderName.name]?.nameConsultancy}
                    </Text>
                    <Feather
                      name={folderContent[folderName.name]?.view === "Privada" ? "eye-off" : "eye"}
                      size={16}
                      color="black"
                      style={styles.edgeViewIcon}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode='middle'
                    style={[
                      styles.detailsElements,
                      styles.detailsAuthorElements
                    ]}
                  >
                    {folderContent[folderName.name]?.author}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode='middle'
                    style={[
                      styles.detailsElements,
                      styles.detailsEntityElements
                    ]}
                  >
                    {folderContent[folderName.name]?.entity}
                  </Text>
                  <View style={styles.containerDate}>
                    {folderContent[folderName.name]?.startDateConsultancy &&
                      folderContent[folderName.name]?.endDateConsultancy && (
                      <>
                        <Text
                          style={[
                            styles.detailsElements,
                            styles.detailsDateElements
                          ]}
                        >
                          {folderContent[folderName.name]?.endDateConsultancy.split(" ")[0]}
                        </Text>
                        <Text
                          style={[
                            styles.detailsElements,
                            styles.detailsDateElements,
                            styles.detailsSeparatorElements,
                          ]}
                        >
                          {" • "}
                        </Text>
                        <Text
                          style={[
                            styles.detailsElements,
                            styles.detailsDateElements
                          ]}
                        >
                          {folderContent[folderName.name]?.startDateConsultancy &&
                          folderContent[folderName.name]?.endDateConsultancy
                            ? calculateDuration(
                                folderContent[folderName.name]?.startDateConsultancy,
                                folderContent[folderName.name]?.endDateConsultancy
                              )
                            : "N/A"}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              )}
            </View>
            <TouchableOpacity
              ref={(ref) => {
                console.log(isUpdateFolderData);
                const oldIconRef = iconRefs.current[0];
                iconRefs.current[index] = ref;

                if (isUpdateFolderData) {
                  console.log(isUpdateFolderData);
                  const nullIndex = iconRefs.current.findIndex((ref) => ref === null);

                  if (nullIndex !== -1) {
                    console.log('AA');
                    iconRefs.current.splice(nullIndex, 1);
                  } else if (iconRefs.current[0] !== null) {
                    console.log('BB');
                    iconRefs.current.unshift(null);
                    iconRefs.current[index] = ref;
                    iconRefs.current[1] = oldIconRef;
                  }
                }
              }}
              onPress={() => {
                if (user !== folderContent[folderName.name]?.author) {
                  setIsDisableDelete(true);
                } else {
                  setIsDisableDelete(false);
                }
                onIconPress(index);
              }}
            >
              <Feather
                name="more-vertical"
                size={22}
                color="black"
                style={styles.moreIcon}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
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
      <Modal
        visible={showOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowOptions(false);
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}
          activeOpacity={1}
          onPress={() =>
            setShowOptions(false)
          }
        >
          <View
            style={{
              position: "absolute",
              overflow: 'hidden',
              top: optionsTop,
              left: optionsLeft - 130,
              backgroundColor: 'white',
              borderRadius: 20,
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              width: 130,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                downloadConsultancy();
              }}
              style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'white' }}
            >
              <Text>Descargar</Text>
            </TouchableOpacity>
            {!isDisableDelete &&
              <TouchableOpacity
                onPress={() => {
                  deleteConsultancy();
                }}
                style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'white' }}
              >
                <Text>Eliminar</Text>
              </TouchableOpacity>
            }
            <TouchableOpacity
              onPress={() => {
                detailsConsultancy();
              }}
              style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'white' }}
            >
              <Text>Detalles</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  containerItemList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomColor: "#E5E5E5",
    paddingVertical: 10,
  },
  image: {
    width: 100,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  containerElementsItemList: {
    flex: 1,
  },
  headerElements: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleHeaderElements: {
    fontSize: 16,
    fontWeight: "bold",
    maxWidth: '90%',
  },
  edgeViewIcon: {
    marginLeft: 5,
  },
  detailsElements: {
    color: "#888888",
  },
  detailsAuthorElements: {
    fontSize: 14,
  },
  detailsEntityElements: {
    fontSize: 13,
  },
  containerDate: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsDateElements: {
    fontSize: 12,
  },
  detailsSeparatorElements: {
    marginHorizontal: 5,
  },
  moreIcon: {
    marginLeft: 10,
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