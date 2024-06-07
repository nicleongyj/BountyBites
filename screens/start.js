import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";

import logo from "../assets/logo.png";

export default function Start({navigation, route}) {

    const redirect = () => {
        route.params.setState(true);
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style = {styles.container}> */}
                <View style={styles.logoContainer}>
                    {/* <Text style={styles.title}>Bounty Bites</Text> */}
                    
                    <Image source={logo} style={styles.logo}/> 
                    <Text style={styles.subTitle}>Save your wallet while saving the earth!</Text>

                </View>



                <View style={styles.mainButtonContainer}> 
                    <Button mode="contained" onPress={redirect} labelStyle = {styles.buttonLabel} style={styles.button}>Food Hunt!</Button>
                </View>

                <View style={styles.mainButtonContainer}> 
                    <Button mode="contained" onPress={redirect} labelStyle = {styles.restaurantLabel} style={styles.restaurantButton}>Are you a restaurant?</Button>
                </View>
        
            {/* </View> */}
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "azure",
        backgroundColor: "white",
    },

    logoContainer: {
        flex: 3,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      },
    logo: {
        width: 250,
        height: 300,
        resizeMode: "contain",
    },
    title: {
        fontSize: 35,
        fontStyle: "normal",
        color: "black",
        fontWeight: "bold",
    },
    subTitle:{
        fontSize: 15,
        color: "black",
        fontWeight: "bold",
    },

    mainButtonContainer: {
        flex: 2,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        backgroundColor: "black",
        width: 150,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        marginTop: 20,
    },
    restaurantButton:{
        width: 250,
        height: 50,
        backgroundColor: '#f0f0f0', 
        borderColor: '#000000', 
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1, 
        borderRadius: 15,
    },
    buttonLabel: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },
    restaurantLabel: {
        color: "black",
        fontSize: 15,
    },
});