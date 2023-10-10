import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Modal,
  Keyboard,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function ({ navigation }) {
  const [nameConsultancy, setNameConsultancy] = useState("");
  const [goals, setGoals] = useState([]);
  const [observationType, setObservationType] = useState("");
  const [author, setAuthor] = useState("");
  const [view, setView] = useState("");
  const [consultants, setConsultants] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const [observationTypeData, setObservationTypeData] = useState([
    { value: "Grabación de video", label: "Grabación de video" },
    { value: "Entrevista", label: "Entrevista" },
    { value: "Chat", label: "Chat" },
  ]);
  const [viewData, setViewData] = useState([
    { value: "Pública", label: "Pública" },
    { value: "Privada", label: "Privada" },
  ]);
  const { dataParams } = useRoute().params;
  const borderBottomWidth = Array.from({ length: 5 }, () => useSharedValue(1));
  const borderColor = Array.from({ length: 5 }, () => useSharedValue('#939393'));

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

  const getConsultants = async () => {
    await axios.get("http://192.168.1.103:3004/getUsers")
      .then(async response => {
        const arrayResponse = response.data.filter((consultant) => consultant !== author);
        const dataArray = arrayResponse.map(item => ({
          value: item.trim(),
          label: item.trim()
        }));
        setConsultants(dataArray);
      }).catch(error => {
        setInfo(error.response.data);
      });
  };

  const sendData = async () => {
    const data = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}`,
    });

    await axios.post("http://192.168.1.103:3002/nameFolders", data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(async response => {
        const folderNames = response.data;

        if (folderNames.includes(nameConsultancy)) {
          setInfo('La consultoría ya existe');
        } else {
          navigation.navigate("RecordScreen", {
            dataParams: {
              nameConsultancy: nameConsultancy,
              author: author,
              observationType: observationType,
              view: view,
              collaborators: collaborators,
              goals: goals,
              entity: dataParams.entity, 
              ueb: dataParams.ueb, 
              unit: dataParams.unit, 
              area: dataParams.area, 
              process: dataParams.process, 
              worker: dataParams.worker
            }
          });
        }
      }).catch(error => {
        setInfo(error.response.data);
      });
  };
  
  const RenderRightIcon = () => (
    <View style={styles.chevronIcon}>
      <Feather
        name="chevron-down"
        size={22}
        color={'black'}
      />
    </View>
  );

  const RenderInputSearch = ({ onSearch }) => (
    <View style={styles.containerInputSearch}>
      <View style={styles.inputSearch}>
        <TextInput
          placeholder="Buscar"
          onChangeText={(text) => {
            onSearch(text);
          }}
        />
        </View>
    </View>
  );

  const RenderItem = ({ item, selected }) => (
    <View
      style={[
        styles.containerItem,
        { backgroundColor: selected ? 'lightblue' : null },
      ]}
    >
      <Text style={styles.dataItem}>{item.label}</Text>
      {selected && <Feather name="check" size={18} color="green" />}
    </View>
  );

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
          setAuthor(response.data.username);
        }).catch(error => {
          console.log(error.response.data);
        });
      })
      .catch(error => {
        setInfo(error.response.data);
      });
  }, []);

  useEffect(() => {
    getConsultants();
  }, [author]);

  return (
    <KeyboardAvoidingView behavior="height" style={{ flexGrow: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="folder-eye" style={styles.eyeIcon} />
            <Text style={styles.titleHeader}>Crea observaciones</Text>
          </View>
          <View style={styles.dataInputContainer}>
            <View>
              <Animated.View
                style={[
                  styles.textInput,
                  textInputStyles(0),
                  styles.textInputConsultancy,
                ]}
              >
                <TextInput
                  placeholder="Introduce un nombre de consultoría"
                  value={nameConsultancy}
                  autoCapitalize="sentences"
                  autoCompleteType="off"
                  autoCorrect={true}
                  onChangeText={(text) => setNameConsultancy(text)}
                  onFocus={() => {handleFocus(0)}}
                  onBlur={() => {handleBlur(0)}}
                />
              </Animated.View>
            </View>
            <View>
              <Animated.View
                style={[
                  styles.dropDown,
                  textInputStyles(1),
                  styles.dropDownObservationType,
                ]}
              >
                <Dropdown
                  selectedTextStyle={{
                    fontSize: 14,
                    color: "black",
                  }}
                  placeholderStyle={{
                    fontSize: 14,
                    color: "#939393",
                  }}
                  selectedTextProps={{
                    numberOfLines: 1,
                    ellipsizeMode: 'tail',
                  }}
                  containerStyle={styles.containerDropDownMenu}
                  placeholder="Selecciona un tipo de observación"
                  value={observationType}
                  data={observationTypeData}
                  search={true}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  renderRightIcon={() => (
                    <RenderRightIcon />
                  )}
                  renderInputSearch={(onSearch) => (
                    <RenderInputSearch onSearch={onSearch} />
                  )}
                  renderItem={(item, selected) => (
                    <RenderItem item={item} selected={selected} />
                  )}
                  onChange={(item) => setObservationType(item.label)}
                  onFocus={() => {handleFocus(1)}}
                  onBlur={() => {handleBlur(1)}}
                />
              </Animated.View>
            </View>
            <View>
              <Animated.View
                style={[
                  styles.dropDown,
                  textInputStyles(2),
                  styles.dropDownView,
                ]}
              >
                <Dropdown
                  selectedTextStyle={{
                    fontSize: 14,
                    color: "black",
                  }}
                  placeholderStyle={{
                    fontSize: 14,
                    color: "#939393",
                  }}
                  selectedTextProps={{
                    numberOfLines: 1,
                    ellipsizeMode: 'tail',
                  }}
                  containerStyle={styles.containerDropDownMenu}
                  placeholder="Selecciona un tipo de visualización"
                  value={view}
                  data={viewData}
                  search={true}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  renderRightIcon={() => (
                    <RenderRightIcon />
                  )}
                  renderInputSearch={(onSearch) => (
                    <RenderInputSearch onSearch={onSearch} />
                  )}
                  renderItem={(item, selected) => (
                    <RenderItem item={item} selected={selected} />
                  )}
                  onChange={(item) => setView(item.label)}
                  onFocus={() => {handleFocus(2)}}
                  onBlur={() => {handleBlur(2)}}
                />
              </Animated.View>
            </View>
            <View>
              <Animated.View
                style={[
                  styles.dropDown,
                  textInputStyles(3),
                  styles.dropDownCollaborators,
                ]}
              >
                <MultiSelect
                  placeholderStyle={{
                    fontSize: 14,
                    color: `${collaborators.length > 0 ? "black" : "#939393"}`,
                  }}
                  containerStyle={styles.containerDropDownMenu}
                  placeholder={`${collaborators.length > 0 ? "Ha seleccionado colaboradores" : "Selecciona uno o varios colaboradores"}`}
                  value={collaborators}
                  data={consultants}
                  search={true}
                  visibleSelectedItem={false}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  renderRightIcon={() => (
                    <RenderRightIcon />
                  )}
                  renderInputSearch={(onSearch) => (
                    <RenderInputSearch onSearch={onSearch} />
                  )}
                  renderItem={(item, selected) => (
                    <RenderItem item={item} selected={selected} />
                  )}
                  onChange={(item) => setCollaborators(item)}
                  onFocus={() => {handleFocus(3)}}
                  onBlur={() => {handleBlur(3)}}
                />
              </Animated.View>
            </View>
            <View>
              <Animated.View
                style={[
                  styles.textInput,
                  textInputStyles(4),
                  styles.textInputGoals,
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
                    handleFocus(4);
                    Keyboard.addListener("keyboardDidHide", setGoals(goals.join("\n").split("\n").filter(goal => goal.trim() !== "")));
                  }}
                  onBlur={() => {
                    handleBlur(4);
                    Keyboard.addListener("keyboardDidHide", setGoals(goals.join("\n").split("\n").filter(goal => goal.trim() !== ""))).remove();
                  }}
                />
              </Animated.View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              sendData();
            }}
          >
            <Text style={styles.buttonText}>Siguiente</Text>
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
  eyeIcon: {
    fontSize: 48,
    marginVertical: 20,
    color: 'black',
  },
  chevronIcon: {
    marginLeft: 13,
  },
  titleHeader: {
    color: 'black',
    fontWeight: '500',
    marginBottom: 15,
  },
  textInput: {
    marginBottom: 20,
  },
  dropDown: {
    marginBottom: 20,
  },
  textInputConsultancy: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  dropDownObservationType: {
    position: 'absolute',
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 50,
  },
  dropDownView: {
    position: 'absolute',
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 100,
  },
  dropDownCollaborators: {
    position: 'absolute',
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 150,
  },
  textInputGoals: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 200,
    maxHeight: 35,
  },
  dataInputContainer: {
    marginTop: 10,
    height: 250,
  },
  containerInputSearch: {
    paddingHorizontal: 10,
  },
  inputSearch: {
    marginVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#939393',
  },
  containerDropDownMenu: {
    overflow: 'hidden',
    marginVertical: 5,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  dataItem: {
    width: '90%',
  },
  containerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
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