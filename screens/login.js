import { View, Text, StyleSheet, Image, ImageBackground, TextInput } from "react-native";
import { useState } from "react";

import background from "../assets/loginImage.jpg";
import emailIcon from "../assets/emailIcon.png";
import keyIcon from "../assets/key.png";



export default function LoginScreen({ navigation, route }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function changeUsername(text) {
        setUsername(text);
    }

    function changePassword(text) { 
        setPassword(text);
    }

    return (
        <View style = {styles.container}>
            <ImageBackground source={background} resizeMode='Stretch' style={{flex:1}} >

            <View style={styles.logoContainer}>
                {/* <Image/> */} 
                <Text style={styles.title}>Welcome to royce</Text>
            </View>



            <View style={styles.textContainer}> 
                <View style={styles.inputContainer}>
                    <Image source={emailIcon} style={styles.emailIcon} />
                    <TextInput
                        autoCapitalize="none"
                        mode="flat"
                        textColor="black"
                        style={styles.textBox}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Email"
                        placeholderTextColor={"gray"}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Image source={keyIcon} style={styles.emailIcon} />
                    <TextInput
                    autoCapitalize="none"
                    mode="flat"
                    color="azure"
                    style={styles.textBox}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor={"grey"}
                    ></TextInput>
                </View>

            </View>
            





            </ImageBackground>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "azure",
    },

    logoContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
      },

    title: {
        fontSize: 35,
        fontStyle: "normal",
        // fontFamily: "Futura",
        color: "darkblue",
        fontWeight: "bold",
    },
    textContainer: {
        flex: 3,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },

    inputContainer: {
        marginTop: "5%",
        flexDirection: "row",
        alignItems: "center",
    },

    emailIcon: {
        height: 30,
        width: 30,
        marginRight: "3%",
      },
    textBox: {
        backgroundColor: "white",
        height: 30,
        width: 300,
        fontSize: 15,
    },
});