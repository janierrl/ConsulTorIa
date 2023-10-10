import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from "../components/login/Login";
import Register from "../components/login/Register";
import VerifyEmail from "../components/login/VerifyEmail";
import ForgetPassword from "../components/login/ForgetPassword";
import NewPassword from "../components/login/NewPassword";
import RecordScreen from "../screens/RecordScreen";
import FormScreen from "../screens/FormScreen";
import FormScreenDos from "../screens/FormScreenDos";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import AccessAccount from "../components/user/AccessAccount";
import UpdateAccount from "../components/user/UpdateAccount";
import Details from "../screens/Details";
import Consultancies from "../screens/Consultancies";
import UpdateDetails from "../screens/UpdateDetails";
import CustomDrawerContent from "../screens/utils/CustomDrawerContent";
import { RenderHeaderLeft, RenderHeaderRight } from "../screens/utils/CustomStackContent";

const AuthStack = createNativeStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="VerifyEmail" component={VerifyEmail} />
      <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
      <AuthStack.Screen name="NewPassword" component={NewPassword} />
      <AuthStack.Screen name="OK" component={MainDrawers} />
    </AuthStack.Navigator>
  );
};

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      initialRouteName="MainTopTab"
      screenOptions={{
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        }
      }}
    >
      <MainStack.Screen 
        name="MainTopTab" 
        component={MainTopTab} 
        options={({ route, navigation }) => ({
          title: "ConsulTorIa",
          headerShadowVisible: true,
          headerLeft: () => (
            <RenderHeaderLeft route={route} navigation={navigation} />
          ),
          headerRight: () => (
            <RenderHeaderRight route={route} navigation={navigation} />
          )
        })}
      />
      <MainStack.Screen 
        name="Consultancies" 
        component={Consultancies} 
        options={({ route, navigation }) => ({
          title: route.params.nameConsultancy,
          headerLeft: () => (
            <RenderHeaderLeft route={route} navigation={navigation} />
          )
        })}
      />
      <MainStack.Screen 
        name="Details" 
        component={Details} 
        options={({ route, navigation }) => ({
          title: "Detalles",
          headerLeft: () => (
            <RenderHeaderLeft route={route} navigation={navigation} />
          ),
          headerRight: () => (
            <RenderHeaderRight route={route} navigation={navigation} />
          )
        })}
      />
      <MainStack.Screen 
        name="UpdateDetails" 
        component={UpdateDetails}
        options={({ route, navigation }) => ({
          title: "Detalles",
          headerLeft: () => (
            <RenderHeaderLeft route={route} navigation={navigation} />
          )
        })}
      />
      <MainStack.Screen 
        name="FormScreen" 
        component={FormScreen}
        options={({ route, navigation }) => ({
          title: "Nueva observación",
          headerLeft: () => (
            <RenderHeaderLeft route={route} navigation={navigation} />
          )
        })}
      />
      <MainStack.Screen
        name="FormScreenDos" 
        component={FormScreenDos}
        options={({ route, navigation }) => ({
          title: "Nueva observación",
          headerLeft: () => (
            <RenderHeaderLeft route={route} navigation={navigation} />
          )
        })}
      />
      <MainStack.Screen
        name="RecordScreen"
        component={RecordScreen} 
        options={({ route, navigation }) => ({
          title: "Grabación de pantalla",
          headerLeft: () => (
            <RenderHeaderLeft route={route} navigation={navigation} />
          )
        })}
      />
      <MainStack.Screen
        name="AccessAccount"
        component={AccessAccount}
        options={({ route, navigation }) => ({
          title: "Cuenta",
          headerLeft: () => (
            <RenderHeaderLeft route={route} navigation={navigation} />
          )
        })}
      />
      <MainStack.Screen
        name="UpdateAccount"
        component={UpdateAccount}
        options={({ route, navigation }) => ({
          title: "Cuenta",
          headerLeft: () => (
            <RenderHeaderLeft route={route} navigation={navigation} />
          )
        })}
      />
      <MainStack.Screen
        name="Profile"
        component={Profile}
        options={({ route, navigation }) => ({
          title: "Cuenta",
          headerLeft: () => (
            <RenderHeaderLeft route={route} navigation={navigation} />
          ),
          headerRight: () => (
            <RenderHeaderRight route={route} navigation={navigation} />
          )
        })}
      />
    </MainStack.Navigator>
  );
};

const Drawer = createDrawerNavigator();
const MainDrawers = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
        drawerStyle: {
          width: '75%',
        },
      }}
    >
      <Drawer.Screen name="Main" component={Main} />
    </Drawer.Navigator>
  );
};

const TopTab = createMaterialTopTabNavigator();
const MainTopTab = ({ navigation }) => {
  const [isUpdateFolderData, setIsUpdateFolderData] = useState(false);

  return (
    <>
      <TopTab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: {
            textTransform: 'capitalize',
          },
        }}
      >
        <TopTab.Screen
          name="Home"
          component={Home}
          options={{
            title: "Todo"
          }}
          initialParams={{
            isUpdateFolderDataParams: isUpdateFolderData
          }}
        />
        <TopTab.Screen
          name="MyConsultancies"
          component={Home}
          options={{
            title: "Mis Consultorías"
          }}
          initialParams={{
            isUpdateFolderDataParams: isUpdateFolderData
          }}
        />
        <TopTab.Screen
          name="Collaborations"
          component={Home}
          options={{
            title: "Colaboraciones"
          }}
          initialParams={{
            isUpdateFolderDataParams: isUpdateFolderData
          }}
        />
      </TopTab.Navigator>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsUpdateFolderData(true);
          navigation.navigate("FormScreen");
        }}
      >
        <Feather name="plus" size={25} color="white" />
      </TouchableOpacity>
    </>
  );
};

export default function () {
  const user = false;
  return (
    <NavigationContainer>
      {user == false && <Auth />}
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3366FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});