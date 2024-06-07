import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeContainer from './components/homeContainer'
import LoginScreen from './screens/login.js';
import StartScreen from './screens/start.js';
import RegisterScreen from './screens/register.js';

// import { LoginContext } from './contexts';


export const LoginContext = React.createContext();

export default function App() {

  const Stack = createNativeStackNavigator();

  [isLoggedIn, setIsLoggedIn] = useState(false);
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);
  
  
  function Navigate() {
    return !isLoggedIn ? (
      <LoginContext.Provider value={{ isLoggedIn, login, logout}}>

        <Stack.Navigator>
            <Stack.Screen
            name="Starting Screen"
            component={StartScreen}
            // initialParams={{ setState: setLogin }}
          />
        <Stack.Screen
            name="Login Screen"
            component={LoginScreen}
            // initialParams={{ setState: setLogin }}
          />
        <Stack.Screen
            name="Register Screen"
            component={RegisterScreen}
            // initialParams={{ setState: setLogin }}
          />
          

        </Stack.Navigator>
      </LoginContext.Provider>
    ) : (
      <HomeContainer/>
    );

  }


  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Navigate />
      </NavigationContainer>
    </>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});