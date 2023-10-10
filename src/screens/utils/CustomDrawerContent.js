import React, {
  useState,
  useEffect, 
  useCallback
} from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
  Modal
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default ({ navigation }) => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const detailsAccount = async () => {
    navigation.navigate('Profile', {
      data: {
        name: name,
        lastname: lastname,
        user: user,
        email: email,
        photo: photo
      }
    });
    navigation.closeDrawer();
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
          setName(response.data.name);
          setLastname(response.data.lastname);
          setUser(response.data.username);
          setEmail(response.data.email);
          setPhoto(response.data.photo);
        }).catch(error => {
          setInfo(error.response.data);
        });
      })
      .catch(error => {
        console.log('Error al recuperar el token:', error);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('hola');
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerElements}>
          <TouchableOpacity
            style={[
              styles.avatarContainer,
              !photo &&
                styles.noPhoto
            ]}
            touchSoundDisabled={true}
            activeOpacity={1}
            onPress={() => {
              detailsAccount();
            }}
          >
            {photo ?
              <Image
                source={{
                  uri: `data:image/png;base64,${photo}`,
                }}
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: 35,
                }}
              /> :
              <MaterialCommunityIcons name="account" style={styles.accountIcon} />
            }
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.themeSwitcher}
            touchSoundDisabled={true}
            activeOpacity={1}
            onPress={() => {
              setIsDarkMode(!isDarkMode);
            }}
          >
            <Ionicons name={isDarkMode ? "ios-sunny" : "ios-moon"} size={24} color="white" style={{ transform: [{ scaleX: -1 }] }} />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.username}>{user}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity
          onPress={() => {
            detailsAccount();
          }}
          style={styles.menuOption}
        >
          <Feather name="user" size={24} color="#333" />
          <Text style={styles.menuText}>Cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
            navigation.closeDrawer();
          }}
          style={styles.lastMenuOption}
        >
          <Feather name="log-out" size={24} color="#333" />
          <Text style={styles.menuText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity
        onPress={() => {
          setInfo('ConsulTorIa\n\nHerramienta para la gestión de observaciones para equipos de Consultoria TI');
        }}
          style={styles.menuOption}
        >
          <Feather name="info" size={24} color="#333" />
          <Text style={styles.menuText}>Acerca de</Text>
        </TouchableOpacity>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  headerElements: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  header: {
    paddingTop: 25,
    paddingHorizontal: 18,
    backgroundColor: '#3366FF',
  },
  avatarContainer: {
    width: 65,
    height: 65,
    borderRadius: 35,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  noPhoto: {
    borderWidth: 2.5,
    borderColor: 'white',
    borderStyle: 'solid',
  },
  accountIcon: {
    fontSize: 60,
    marginTop: '16%',
    color: 'black',
  },
  username: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  email: {
    fontSize: 13.5,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 10,
  },
  themeSwitcher: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    paddingVertical: 20,
    paddingHorizontal: 18,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  lastMenuOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 25,
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