import {
  Layout,
  TopNav,
  Text,
  Button,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StatusBar,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  const [uebData, setUebData] = useState([]); /*OK*/
  const [unidadData, setUnidadData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [procData, setProcData] = useState([]);
  const [trabajadorData, setTrabajadorData] = useState([]);
  const [entidadData, setEntidadData] = useState([]);
  const [ueb, setUeb] = useState("");
  const [unidad, setUnidad] = useState("");
  const [entidad, setEntidad] = useState("");
  const [area, setArea] = useState("");
  const [proc, setProc] = useState("");
  const [trabajador, setTrabajador] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    var config = {
      method: "get",
      url: "http://192.168.1.103:4000/api/procesos",
    };

    axios(config)
      .then((response) => {
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
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    var config = {
      method: "get",
      url: "http://192.168.1.103:4000/api/ueb",
    };

    axios(config)
      .then((response) => {
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
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    var config = {
      method: "get",
      url: "http://192.168.1.103:4000/api/entidad",
    };

    axios(config)
      .then((response) => {
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
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    var config = {
      method: "get",
      url: "http://192.168.1.103:4000/api/unidad",
    };

    axios(config)
      .then((response) => {
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
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    var config = {
      method: "get",
      url: "http://192.168.1.103:4000/api/area",
    };

    axios(config)
      .then((response) => {
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
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    var config = {
      method: "get",
      url: "http://192.168.1.103:4000/api/trabajadores",
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let trabajadorArray = [];
        for (var i = 0; i < count; i++) {
          trabajadorArray.push({
            value: response.data[i].CI,
            label: response.data[i].Nombre,
          });
        }
        setTrabajadorData(trabajadorArray);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
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
          leftAction={() => navigation.navigate("Home")}
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
            <Text>Entidad</Text>
            <Dropdown
              style={{
                height: 50,
                borderColor: "#d8d8d8",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 20,
                marginTop: 5,
              }}
              placeholderStyle={{
                fontFamily: "Ubuntu_400Regular",
                fontSize: 14,
                color: "#939393",
              }}
              data={entidadData}
              search={true}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Selecciona la entidad"
              searchPlaceholder="Buscar..."
              onChange={(item) => {
                setEntidad(item.label);
              }}
            />

            <Text style={{ marginTop: 10 }}>UEB</Text>
            <Dropdown
              style={{
                height: 50,
                borderColor: "#d8d8d8",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 20,
                marginTop: 5,
              }}
              placeholderStyle={{
                fontFamily: "Ubuntu_400Regular",
                fontSize: 14,
                color: "#939393",
              }}
              data={uebData}
              search={true}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Selecciona la ueb"
              searchPlaceholder="Buscar..."
              onChange={(item) => {
                setUeb(item.label);
              }}
            />

            <Text style={{ marginTop: 10 }}>Unidad</Text>
            <Dropdown
              style={{
                height: 50,
                borderColor: "#d8d8d8",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 20,
                marginTop: 5,
              }}
              placeholderStyle={{
                fontFamily: "Ubuntu_400Regular",
                fontSize: 14,
                color: "#939393",
              }}
              data={unidadData}
              search={true}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Selecciona la unidad"
              searchPlaceholder="Buscar..."
              onChange={(item) => {
                setUnidad(item.label);
              }}
            />

            <Text style={{ marginTop: 10 }}>Área</Text>
            <Dropdown
              style={{
                height: 50,
                borderColor: "#d8d8d8",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 20,
                marginTop: 5,
              }}
              placeholderStyle={{
                fontFamily: "Ubuntu_400Regular",
                fontSize: 14,
                color: "#939393",
              }}
              data={areaData}
              search={true}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Selecciona el área"
              searchPlaceholder="Buscar..."
              onChange={(item) => {
                setArea(item.label);
              }}
            />

            <Text style={{ marginTop: 10 }}>Proceso</Text>
            <Dropdown
              style={{
                height: 50,
                borderColor: "#d8d8d8",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 20,
                marginTop: 5,
              }}
              placeholderStyle={{
                fontFamily: "Ubuntu_400Regular",
                fontSize: 14,
                color: "#939393",
              }}
              data={procData}
              search={true}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Selecciona el proceso"
              searchPlaceholder="Buscar..."
              onChange={(item) => {
                setProc(item.label);
              }}
            />

            <Text style={{ marginTop: 10 }}>Trabajador</Text>
            <Dropdown
              style={{
                height: 50,
                borderColor: "#d8d8d8",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 20,
                marginTop: 5,
              }}
              placeholderStyle={{
                fontFamily: "Ubuntu_400Regular",
                fontSize: 14,
                color: "#939393",
              }}
              data={trabajadorData}
              search={true}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Selecciona el trabajador"
              searchPlaceholder="Buscar..."
              onChange={(item) => {
                setTrabajador(item.label);
              }}
            />
            
            <Button
              text={loading ? "Cargando" : "Siguiente"}
              onPress={() => {
                navigation.navigate("FormScreenDos", {
                  entidad: entidad, 
                  ueb: ueb, 
                  unidad: unidad, 
                  area: area, 
                  proc: proc, 
                  trabajador: trabajador
                });
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
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
