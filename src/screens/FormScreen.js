import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import React, {useEffect, useState} from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  const [uebData, setUebData] = useState([]);/*OK*/
  const [unidadData, setUnidadData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [procData, setProcData] = useState([]);
  const [trabajadoresData, setTrabajadoresData] = useState([]);
  const [entidadData, setEntidadData] = useState([]);
  const [ueb, setUeb] = useState(null);/*ok*/
  const [unidad, setUnidad] = useState(null);
  const [entidad, setEntidad] = useState(null);
  const [area, setArea] = useState(null);
  const [proc, setProc] = useState(null);
  const [trabajadores, setTrabajadores] = useState(null);
  const [uebName, setUebName] = useState(null);/*ok*/
  const [unidadName, setUnidadName] = useState(null);
  const [areaName, setAreaName] = useState(null);
  const [entidadName, setEntidadName] = useState(null);
  const [trabajadoresName, setTrabajadoresName] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  
  
  
  const procdata  =async () => {
    try {
      const response = await fetch('http://192.168.1.102:4000/api/procesos');
      const json = await response.json();
      setData(json.proc);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    var config = {
      method: 'get',
      url: "http://192.168.1.102:4000/api/procesos",
    };

    axios(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let procArray = [];
        for (var i = 0; i < count; i++) {
          procArray.push({
            value: response.data[i].id,
            label: response.data[i].label,
          });
        }
        setProcData(procArray);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  
  const uebdata  =async () => {
    try {
      const response = await fetch('http://192.168.1.102:4000/api/ueb');
      const json = await response.json();
      setData(json.ueb);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    var config = {
      method: 'get',
      url: "http://192.168.1.102:4000/api/ueb",
    };

    axios(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let uebArray = [];
        for (var i = 0; i < count; i++) {
          uebArray.push({
            value: response.data[i].codigo,
            label: response.data[i].nombre,
          });
        }
        setUebData(uebArray);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const entidaddata  =async () => {
    try {
      const response = await fetch('http://192.168.1.102:4000/api/entidad');
      const json = await response.json();
      setData(json.entidad);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    var config = {
      method: 'get',
      url: "http://192.168.1.102:4000/api/entidad",
    };

    axios(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let entidadArray = [];
        for (var i = 0; i < count; i++) {
          entidadArray.push({
            value: response.data[i].id,
            label: response.data[i].nombre,
          });
        }
        setEntidadData(entidadArray);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  const unidaddata  =async () => {
    try {
      const response = await fetch('http://192.168.1.102:4000/api/unidad');
      const json = await response.json();
      setData(json.unidad);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    var config = {
      method: 'get',
      url: "http://192.168.1.102:4000/api/unidad",
    };

    axios(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let unidadArray = [];
        for (var i = 0; i < count; i++) {
          unidadArray.push({
            value: response.data[i].id,
            label: response.data[i].Unidad,
          });
        }
        setUnidadData(unidadArray);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  
  const areadata  =async () => {
    try {
      const response = await fetch('http://192.168.1.102:4000/api/area');
      const json = await response.json();
      setData(json.area);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    var config = {
      method: 'get',
      url: "http://192.168.1.102:4000/api/area",
    };

    axios(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let areaArray = [];
        for (var i = 0; i < count; i++) {
          areaArray.push({
            value: response.data[i].EstNV1,
            label: response.data[i].Area,
          });
        }
        setAreaData(areaArray);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  
  const trabajadoresdata  =async () => {
    try {
      const response = await fetch('http://192.168.1.102:4000/api/trabajadores');
      const json = await response.json();
      setData(json.trabajadores);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    var config = {
      method: 'get',
      url: "http://192.168.1.102:4000/api/trabajadores",
    };

    axios(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let trabajadoresArray = [];
        for (var i = 0; i < count; i++) {
          trabajadoresArray.push({
            value: response.data[i].CI,
            label: response.data[i].Nombre,
          });
        }
        setTrabajadoresData(trabajadoresArray);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  return (
    <Layout>
      <TopNav
        middleContent="Nueva Observación"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.black}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 15}}>
      <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={entidadData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={ 'Selecciona la Entidad'}
          searchPlaceholder="Search..."
          value={entidad}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            
          }}
        />
      <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={uebData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={ 'Selecciona la UEB' }
          searchPlaceholder="Search..."
          value={ueb}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
          
          }}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={unidadData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={'Selecciona la Unidad' }
          searchPlaceholder="Search..."
          value={unidad}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            
          }}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={areaData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={ 'Selecciona el Area '}
          searchPlaceholder="Search..."
          value={area}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            
          }}
        />
         <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={procData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={ 'Selecciona el proceso' }
          searchPlaceholder="Search..."
          value={proc}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
          
          }}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={trabajadoresData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={ 'Selecciona el Trabajador '}
          searchPlaceholder="Search..."
          value={trabajadores}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#3E6EF7',
            padding: 20,
            borderRadius: 15,
            alignItems: 'center',
          }}
          onPress={() =>{
            navigation.navigate("FormScreenDos");
          }}>
          <Text
            style={{
              color: '#fff',
              fontWeight: '600',
            }}>
            Siguiente
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    justifyContent: 'center',
    alignContent: 'center',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
    
});
