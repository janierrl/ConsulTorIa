import React from "react"
import { View ,StyleSheet,} from "react-native"
import  { useState, useEffect } from 'react'
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
} from "react-native-rapi-ui";
//import {Video} from "expo-av"
import { AntDesign ,Entypo,FontAwesome} from '@expo/vector-icons';
//import { contains } from "@firebase/util";

const Record =  ({navigation})=>{


    //const videoStream = new MediaStream();
    const ws= React.useRef()
    const [status,setStatus] = React.useState({})
    const socket = io.connect("http://192.168.1.100:3001");
    const { isDarkmode } = useTheme();

    
    const startMessage =()=>{
        socket.emit("start");
        console.log("Comienza");
    };
    const pausaMessage =()=>{
      socket.emit("pausa");
      console.log("PAUSA");
    };
   const continuaMessage =()=>{
    socket.emit("continua");
    console.log("CONTINUA");
  };
    const stopMessage =()=>{
        socket.emit("stop");
        console.log("Stop");
    };
    const downloadMessage =()=>{
      socket.emit("stream");
      console.log("Bajalo");
    };
    return(
    
        <Layout>
        <TopNav
        middleContent="Grabación de pantalla"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.black}
          />
        }
        leftAction={() => navigation.goBack()}
      />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 20,
          }}
        >
          <Section>
            <SectionContent>
              <Button
                style={{ marginTop: 10 }}
                text="Comenzar Grabación" onPress={startMessage}
                leftContent={
                  <Entypo name="controller-play" size={24} color="black" />
                }
              />
              <Button
                style={{ marginTop: 10 }}
                text="Pausar Grabación" onPress={pausaMessage}
                leftContent={
                  <AntDesign name="pausecircle" size={24} color="black" />
                }
              />
              <Button
                style={{ marginTop: 10 }}
                text="Continuar Grabación" onPress={continuaMessage}
                leftContent={
                  <AntDesign name="stepforward" size={24} color="black" />
                }
              />
              <Button
                text="Finalizar Grabación" onPress={stopMessage}
                style={{
                  marginTop: 10,
                }}
                leftContent={
                  <Entypo name="controller-stop" size={24} color="black" />
                }
              />
              <Button
                style={{ marginTop: 10 }}
                text="Descargar Archivo" onPress={downloadMessage}
                leftContent={
                  <Entypo name="arrow-down" size={24} color="black" />
                }
              />

              <Button
              text="Chat"
              onPress={() => {
                navigation.navigate("Chat");
              }}
              style={{
                marginTop: 10,
              }}
              leftContent={
                <FontAwesome name="commenting" size={24} color="black" />
              }
            />
            </SectionContent>
          </Section>
        </View>
      </Layout>
    
            
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