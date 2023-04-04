import {
    Layout,
    TopNav,
    Text,
    themeColor,
    useTheme,
    TextInput,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from 'react';
import {
    Alert,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import MyDatePicker from '../screens/utils/MyDateTimePicker'


export default function ({ navigation }) {
    const [genderOpen, setGenderOpen] = useState(false);
    const [genderValue, setGenderValue] = useState(null);
    const [gender, setGender] = useState([
        { label: "Grabación de video", value: "1" },
        { label: "Entrevista", value: "2" },
        { label: "Chat", value: "3" },
    ]);
    const [isFocus, setIsFocus] = useState(false);
    const { isDarkmode } = useTheme();
    const initalState = {
            name: "",
            email: "",
            phone: "",
        };
        const [state, setState] = useState(initalState);
    
        const handleChangeText = (value, name) => {
            setState({ ...state, [name]: value });
        };
    
        const saveNewUser = async () => {
            if (state.name === "") {
            alert("please provide a name");
            } else {

            }
        };

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
        
            <View style={styles.inputGroup}>
                <TextInput
                placeholder="Nombre"
                onChangeText={(value) => handleChangeText(value, "name")}
                value={state.name}
                />
            </View>
            <View style={styles.inputGroup}>
            <Dropdown
                style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                search
                open={genderOpen}
                value={genderValue} //genderValue
                data={gender}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Tipo de observacion' : '...'}
                searchPlaceholder="Search..."
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                
                }} 
            />
            </View>
          {/*  Input */}
        <View style={styles.inputGroup}>
            <TextInput
            placeholder="Objetivos"
            multiline={true}
            numberOfLines={4}
            />
        </View>
        <View style={styles.inputGroup}>
        <Text style={styles.text}>Fecha de inicio :</Text>
        <MyDatePicker/>
        </View>
        <View style={styles.inputGroup}>
        <Text style={styles.text}>Fecha de Fin :</Text>
        <MyDatePicker/>   
        </View>
        <TouchableOpacity
            style={{
            backgroundColor: '#3E6EF7',
            padding: 20,
            borderRadius: 15,
            alignItems: 'center',
            marginBottom:10,
            marginTop:30,
            }}
            onPress={() =>
            Alert.alert(
            "La observación  ha sido insertada con éxito ",
            navigation.navigate("Home"),
            )
    
            }>
            <Text
            style={{
                color: '#fff',
                fontWeight: '600',
            }}>
            Insertar 
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
    backgroundColor: '#3E6EF7 ',
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
    marginBottom:10,
    marginTop:10,
    
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
    marginBottom:10,
    marginTop:10,
    height: 40,
    fontSize: 16,
    },
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor : 'white'
    },
    title: {
        textAlign: 'left',
        fontSize: 20,
        fontWeight: 'bold',
    },
    datePickerStyle: {
        width: 230,
        marginBottom:10,
        marginTop:10,
    },
    text: {
        marginBottom:10,
        marginTop:10,
        textAlign: 'left',
        width: 230,
        fontSize: 16,
        color : "#000"
    }
});