import { useContext } from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/home.js";
import MapScreen from "../screens/map.js";
import RestaurantScreen from "../screens/restaurant.js";

import { RestaurantContext } from "../App.js";

const Tab = createBottomTabNavigator();


export default function HomeContainer() {
    const { isRestaurant } = useContext(RestaurantContext);
    
    return (
        <Tab.Navigator
            initialRouteName="Map"
            // screenOptions={{
            //     tabBarActiveTintColor: "#007D38",
            //     tabBarInactiveTintColor: "#00B14F",
            //     tabBarStyle: {
            //         backgroundColor: "#00B14F",
            //     },
            // }}
        >            
            <Tab.Screen 
                name={"Food Nearby"} 
                component={HomeScreen} 
                options={{tabBarIcon: () => <Text>🍴</Text>, 
                headerShown:true}} />
            <Tab.Screen 
                name={"Map"} 
                component={MapScreen} 
                options={{tabBarIcon: () => <Text>🗺️</Text>, 
                headerShown:true}} />
            {isRestaurant && (
                <Tab.Screen 
                    name="Restaurant" 
                    component={RestaurantScreen} 
                    options={{ 
                        tabBarIcon: () => <Text>👨‍🍳</Text>, 
                        headerShown: true 
                    }} 
                />
            )}
        </Tab.Navigator>




    );
}
