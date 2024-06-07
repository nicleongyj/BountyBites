import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, createContext } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeContainer from './components/homeContainer'
import LoginScreen from './screens/login.js';
import StartScreen from './screens/start.js';
import RegisterScreen from './screens/register.js';

// Contexts
export const LoginContext = createContext();
export const RestaurantContext = createContext();

export default function App() {

  const Stack = createNativeStackNavigator();

  [isRestaurant, setIsRestaurant] = useState(false);
  [isLoggedIn, setIsLoggedIn] = useState(false);
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);
  const setRestaurant = () => setIsRestaurant(true);
  
  
  function Navigate() {
    return !isLoggedIn ? (
      <RestaurantContext.Provider value={{ isRestaurant, setRestaurant }}>
        <LoginContext.Provider value={{ isLoggedIn, login, logout}}>

          <Stack.Navigator>
              <Stack.Screen
              name="Starting Screen"
              component={StartScreen}
            />
          <Stack.Screen
              name="Login Screen"
              component={LoginScreen}
            />
          <Stack.Screen
              name="Register Screen"
              component={RegisterScreen}
            />
            

          </Stack.Navigator>
        </LoginContext.Provider>
      </RestaurantContext.Provider>
    ) : (
      <RestaurantContext.Provider value={{ isRestaurant, setRestaurant }}>
        <LoginContext.Provider value={{ isLoggedIn, login, logout}}>
          <HomeContainer/>  
        </LoginContext.Provider>
    </RestaurantContext.Provider>
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