import HomeScreen from '../screens/home';
import ItemList from '../screens/itemList';
import MapScreen from '../screens/map';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const HomeStack = createNativeStackNavigator();

export default function HomeStackScreen() {
    return (
        <HomeStack.Navigator initialRouteName="Home">
            <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <HomeStack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
            <HomeStack.Screen name="ItemList" component={ItemList} options={({ route }) => ({ title: route.params.restaurant.restaurantName })} />
        </HomeStack.Navigator>
    );
};