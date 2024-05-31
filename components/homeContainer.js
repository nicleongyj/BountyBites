import * as React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/home.js";

import HomeIcon from "../assets/home.png";


const Tab = createBottomTabNavigator();


export default function HomeContainer() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBarOptions={{
                tabBarActiveTintColor: "#007D38",
                tabBarInactiveTintColor: "#00B14F",
                tabBarStyle: {
                    backgroundColor: "#00B14F",
                },
            }}
        >

            <Tab.Screen name={"Home"} component={HomeScreen} options={{tabBarIcon: () => <Text>🏠</Text>, headerShown:true}} />

        </Tab.Navigator>




    );
}
