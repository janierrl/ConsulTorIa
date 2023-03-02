import React from "react";
import { View, StyleSheet ,FlatList} from "react-native";
import {
  Layout,
  Button,
  Text,
  Section,
  SectionContent,
  useTheme,
  TopNav,
  ImageBackground,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign,Entypo } from '@expo/vector-icons';
import {
  Container,
  Card,
  ObservacionInfo,
  ObservationInfoText,
  ObservationName,
  DateTime,
  ObservationText,
  TextSection,
} from '../components/utils/ObservacionStyles';

export default function ({ navigation }) {
  const Observations = [
    {
      id: '1',
      ObservationName: 'Entrevista en direccion',
      ObservationType:"Entrevista",
      DateTime: '23-12-2022',
      Descripcion:
        'Análisis del proceso de gestion de procesos en el Dpto de Direccion General ',
    },

  ];

  return (
    <Layout>
    <TopNav
	        middleContent="ConsulTorIa"
	        leftContent={
            <Entypo name="user" size={24} color="black" />
          }
          leftAction={() => navigation.navigate("Profile")}
	    />
      <View
        style={{
          flexDirection:'row',
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 20,
        }}
      >
            <Button
              style={styles.buttons}
              text="Añadir"
              leftContent={
                <AntDesign name="pluscircleo" size={24} color="black" />
              }
              onPress={() => {
                navigation.navigate("FormScreen");
              }}
            >
            </Button>
            <Button
              style={styles.buttons}
              text="Capturar"
              onPress={() => {
                navigation.navigate("RecordScreen");
              }}
              leftContent={
              <AntDesign name="videocamera" size={24} color="black" />
              }
              />
      </View>
      
      <Section
         style={{
         marginTop:20,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
         style={{
          marginTop:50,
         }}>Observaciones Recientes</Text>
        <SectionContent
         style={{
          borderRadius: 20,
          padding:20
        }}>
            
            <FlatList 
              data={Observations}
              keyExtractor={item=>item.id}
              renderItem={({item}) => (
                <Card>
                  <ObservacionInfo>
                    <TextSection>
                      <ObservationInfoText>
                        <ObservationName>{item.ObservationName}</ObservationName>
                        <DateTime>{item.DateTime}</DateTime>
                      </ObservationInfoText>
                      <ObservationText>{item.ObservationType}</ObservationText>
                      <ObservationText>{item.Descripcion}</ObservationText>
                    </TextSection>
                  </ObservacionInfo>
                </Card>
              )}
            />
        </SectionContent>
    </Section>
      
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
      flexDirection:'column'
  },
  video:{
      flex:1,
      alignSelf:'stretch',
      borderColor:'black'
  },
  buttons:{
      margin:16,
      marginRight:20,
      marginTop:30,
      flexDirection:'row'
  }
});
