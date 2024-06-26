// Import necessary dependencies and screens
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Restaurant from "../screens/restaurant";
import ShareFood from "../screens/shareFood";
import FoodShared from "../screens/foodShared";
import Analytics from "../screens/analytics";

const MainStack = createNativeStackNavigator();

export default function MainStackNavigator() {
  return (
    <MainStack.Navigator initialRouteName="Restaurant">
      <MainStack.Screen
        name="Restaurant"
        component={Restaurant}
        options={{ headerShown: true }}
      />
      <MainStack.Screen
        name="ShareFood"
        component={ShareFood}
        options={{ title: "Share Food" }}
      />
      <MainStack.Screen
        name="FoodShared"
        component={FoodShared}
        options={{ title: "Food Shared" }}
      />
      <MainStack.Screen
        name="Analytics"
        component={Analytics}
        options={{ title: "Analytics" }}
      />
    </MainStack.Navigator>
  );
}
