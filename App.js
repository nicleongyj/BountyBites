import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState, createContext, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeContainer from "./components/homeContainer";
import LoginScreen from "./screens/login.js";
import StartScreen from "./screens/start.js";
import RegisterScreen from "./screens/register.js";
import TermsScreen from "./screens/termsConditions";

// Contexts
export const LoginContext = createContext();
export const RestaurantContext = createContext();

export default function App() {
  const Stack = createNativeStackNavigator();

  const [isRestaurant, setIsRestaurant] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Add userId state

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null); // Clear userId on logout
  };
  const setRestaurant = () => setIsRestaurant(true);

  function AppNavigator() {
    return (
      <Stack.Navigator>
        {!isLoggedIn ? (
          <>
            <Stack.Screen
              name="Starting Screen"
              component={StartScreen}
              options={{ title: "Bounty Bites" }}
            />
            <Stack.Screen
              name="Login Screen"
              component={LoginScreen}
              options={{ title: "Login" }}
            />
            <Stack.Screen
              name="Register Screen"
              component={RegisterScreen}
              options={{ title: "Register" }}
            />
            <Stack.Screen
              name="Terms and Condition Screen"
              component={TermsScreen}
              options={{ title: "Terms and Conditions" }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Home"
            component={HomeContainer}
            options={{ headerShown: false}}
          />
        )}
      </Stack.Navigator>
    );
  }

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, login, logout, userId, setUserId }}
    >
      <RestaurantContext.Provider value={{ isRestaurant, setRestaurant }}>
        <StatusBar style="dark" />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </RestaurantContext.Provider>
    </LoginContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
