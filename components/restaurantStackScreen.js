// Import necessary dependencies and screens
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Restaurant from "../screens/restaurant";
import ShareFood from "../screens/ShareFoodModal";

// Create a stack navigator
const MainStack = createNativeStackNavigator();

// Define the navigation stack
export default function MainStackNavigator() {
  return (
    <MainStack.Navigator initialRouteName="Restaurant">
      <MainStack.Screen
        name="Restaurant"
        component={Restaurant}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="ShareFood"
        component={ShareFood}
        options={{ title: "Share Food" }}
      />
    </MainStack.Navigator>
  );
}
