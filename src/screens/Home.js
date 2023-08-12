import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";
import {
  Layout,
  Button,
  Text,
  Section,
  SectionContent,
  TopNav,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  ObservacionInfo,
  ObservationInfoText,
  ObservationName,
  DateTime,
  ObservationText,
  TextSection,
} from "../components/utils/ObservacionStyles";

export default function ({ navigation }) {
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <TopNav
          leftContent={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: 160,
              }}
            >
              <TouchableOpacity 
                onPress={() => 
                  navigation.navigate("Profile")
                }
              >
                <Ionicons name="menu-outline" size={28} color="black" />
              </TouchableOpacity>
              <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: -3 }}>ConsulTorIa</Text>
            </View>
          }

          rightContent={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: 75,
              }}
            >
              <TouchableOpacity 
                onPress={() => 
                  navigation.navigate("Profile")
                }
              >
                <Ionicons name="search-outline" size={28} color="black" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => 
                  navigation.navigate("Login")
                }
              >
                <Ionicons name="log-out-outline" size={28} color="black" />
              </TouchableOpacity>
            </View>
          }
        />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 20,
            }}
          >
          </View>
        </ScrollView>

        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: themeColor.primary,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 8,
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
          }}
          onPress={() => {
            navigation.navigate("FormScreen");
          }}
        >
          <Ionicons name="add-outline" size={30} color="white" />
        </TouchableOpacity>
      </Layout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  video: {
    flex: 1,
    alignSelf: "stretch",
    borderColor: "black",
  },
  buttons: {
    margin: 16,
    marginRight: 20,
    marginTop: 30,
    flexDirection: "row",
  },
});
