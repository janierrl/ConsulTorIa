import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import { Feather } from "@expo/vector-icons";

const RenderHeaderLeft = ({ route, navigation }) => (
  route.name === "MainTopTab" ?
    <View style={styles.iconButton}>
      <TouchableOpacity 
        onPress={() => {
          navigation.openDrawer();
        }}
      >
        <Feather name="menu" size={25} color="black" />
      </TouchableOpacity>
    </View> :
    <View style={styles.iconButton}>
      <TouchableOpacity 
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Feather name="arrow-left" size={25} color="black" />
      </TouchableOpacity>
    </View>
);

const RenderHeaderRight = ({ route, navigation }) => (
  route.name === "MainTopTab" ?
    <View style={styles.headerRightContainer}>
      <View style={styles.iconButton}>
        <TouchableOpacity 
          onPress={() => {
            // Lógica para la acción de búsqueda
          }}
        >
          <Feather name="search" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity 
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Feather name="log-out" size={25} color="black" />
        </TouchableOpacity>
      </View>
    </View> :
    (route.name === "Details" ?
      (route.params.data.user === route.params.data.author ||
        route.params.data.collaborators.includes(route.params.data.user)) :
      "noRestrictions") && (
        <View>
          <TouchableOpacity 
            onPress={() => {
              route.name === "Details" ?
                navigation.navigate("UpdateDetails", { data: route.params.data, isConsultancy: route.params.isConsultancy }) :
                navigation.navigate("AccessAccount", { dataParams: route.params.data });
            }}
          >
            <Feather name="edit" size={25} color="black" />
          </TouchableOpacity>
        </View>
    )
);


export {
  RenderHeaderLeft,
  RenderHeaderRight,
};

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginRight: 25,
  },
});