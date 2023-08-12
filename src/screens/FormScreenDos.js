import {
  Layout,
  TopNav,
  Text,
  Button,
  themeColor,
  useTheme,
  TextInput,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useRoute } from '@react-navigation/native';

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  const [nameConsultancy, setNameConsultancy] = useState("");
  const [goals, setGoals] = useState([]);
  const [observationType, setObservationType] = useState("");
  const [gender, setGender] = useState([
    { value: "1", label: "Grabación de video" },
    { value: "2", label: "Entrevista" },
    { value: "3", label: "Chat" },
  ]);
  const { entidad, ueb, unidad, area, proc, trabajador } = useRoute().params;
  const [loading, setLoading] = useState(false);

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
          leftAction={() => navigation.goBack()}
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={true}
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
            <Text>Nombre</Text>
            <TextInput
              containerStyle={{ marginTop: 5 }}
              placeholder="Introduce un nombre"
              value={nameConsultancy}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={true}
              onChangeText={(text) => setNameConsultancy(text)}
            />

            <Text style={{ marginTop: 10 }}>Tipo de observación</Text>
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
              data={gender}
              search={true}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Selecciona el tipo de observación"
              searchPlaceholder="Buscar..."
              onChange={(item) => {
                setObservationType(item.label);
              }}
            />

            <Text style={{ marginTop: 10 }}>Objetivos</Text>
            <TextInput
              containerStyle={{ 
                marginTop: 5,
                height: 85,
                maxHeight: 85
              }}
              placeholder="Introduce los objetivos"
              value={goals.join("\n")}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={true}
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => {
                if (text.endsWith("\n")) {
                  setGoals(text.split("\n"));
                } else {
                  setGoals(text.split("\n").filter(goal => goal.trim() !== ""));
                }
              }}
              onFocus={() => {
                Keyboard.addListener("keyboardDidHide", setGoals(goals.join("\n").split("\n").filter(goal => goal.trim() !== "")));
              }}
              onBlur={() => {
                Keyboard.addListener("keyboardDidHide", setGoals(goals.join("\n").split("\n").filter(goal => goal.trim() !== ""))).remove();
              }}
            />

            <Button
              text={loading ? "Cargando" : "Siguiente"}
              onPress={() => {
                navigation.navigate("RecordScreen", {
                  nameConsultancy: nameConsultancy,
                  observationType: observationType,
                  goals: goals,
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
    backgroundColor: "#3E6EF7 ",
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
    marginTop: 10,
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
    marginBottom: 10,
    marginTop: 10,
    height: 40,
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
  },
  datePickerStyle: {
    width: 230,
    marginBottom: 10,
    marginTop: 10,
  },
  text: {
    marginBottom: 10,
    marginTop: 10,
    textAlign: "left",
    width: 230,
    fontSize: 16,
    color: "#000",
  },
});
