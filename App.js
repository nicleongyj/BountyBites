import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeContainer from './components/homeContainer'
import LoginScreen from './screens/login.js';



export default function App() {

  const Stack = createNativeStackNavigator();

  [login, setLogin] = useState(false);
  
  function Navigate() {
    return !login ? (
      
        <Stack.Navigator>
          <Stack.Screen
            name="Login Screen"
            component={LoginScreen}
            options={{ headerShown: false }}
            initialParams={{ setState: setLogin }}
          />
        </Stack.Navigator>
      
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