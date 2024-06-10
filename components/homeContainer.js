import { useContext } from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/home.js";
import MapScreen from "../screens/map.js";
import RestaurantScreen from "../screens/restaurant.js";
import HomeStackScreen from "./homeStackScreen";
import restaurantStackScreen from "./restaurantStackScreen";

import { RestaurantContext } from "../App.js";
import { restaurants } from "../sample_data/restaurants.js";

const Tab = createBottomTabNavigator();

export default function HomeContainer() {
  const { isRestaurant } = useContext(RestaurantContext);

  return (
    <Tab.Navigator
      initialRouteName="Food Nearby"
      screenOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#f2f2f2',
            borderTopWidth: 0,
            elevation: 5,
          },
          labelStyle: {
            fontSize: 20,
            margin: 0,
            padding: 0,
          },
      }}
    >
      <Tab.Screen
        name={"Food Nearby"}
        component={HomeStackScreen}
        options={{ tabBarIcon: () => <Text>🍖</Text>, headerShown:false}}
      />
      <Tab.Screen
        name={"Map"}
        component={MapScreen}
        options={{ tabBarIcon: () => <Text>🗺️</Text>, headerShown: true }}
      />
      {isRestaurant && (
        <Tab.Screen
          name="Restaurant"
          component={restaurantStackScreen}
          options={{
            tabBarIcon: () => <Text>👨‍🍳</Text>,
            headerShown: false,
          }}
        />
      )}
    </Tab.Navigator>
  );
}
