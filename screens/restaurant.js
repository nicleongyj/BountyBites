import { Text } from "react-native";
import { Button } from "react-native-paper";
import { View } from "react-native";
import { useContext } from "react";

import { LoginContext } from "../App";


export default function Home(navigation) {
    const { logout } = useContext(LoginContext);

    const handleLogout = () => {
        logout();
    };

    return (
        <View>
            <Text>Restaurant page</Text>
            <Button onPress={handleLogout}>Back to start page</Button>
        </View>
        
        

    );

}