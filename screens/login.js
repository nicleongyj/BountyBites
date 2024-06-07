import { View, Text, StyleSheet, Image, ImageBackground, TextInput, Alert, KeyboardAvoidingView } from "react-native";
import { useState } from "react";

import background from "../assets/loginImage.jpg";
import emailIcon from "../assets/emailIcon.png";
import keyIcon from "../assets/key.png";
import royce from "../assets/royce.jpg";

import LoginButton from "../components/loginButton";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";



export default function LoginScreen({ navigation, route }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const auth = FIREBASE_AUTH;

    const submitHandler = () => {
        if (username == "admin" && password == "admin") {   
            route.params.setState(true);
        } else {
            alert("Invalid Username or Password");
        }
    }

    const signIn = async () => {
        try {
            setLoading(true);
            const respons = await signInWithEmailAndPassword(auth, username, password);
            setLoading(false);
            route.params.setState(true);
        } catch (error) {
            setLoading(false);
            alert("Invalid Username or Password");
        }
    }

    const signUp = async () => {    
        try {
            setLoading(true);
            const response = await createUserWithEmailAndPassword(auth, username, password);
            setLoading(false);
            route.params.setState(true);
        } catch (error) {
            setLoading(false);
            alert(error.message);
        }
    }

    // const navigatin = useNavigation();

    return (
        <View style = {styles.container}>
            <ImageBackground source={background} resizeMode='Stretch' style={{flex:1}} >

            <View style={styles.logoContainer}>

                <Text style={styles.title}>Welcome to royce</Text>
            </View>
            <Image source={royce} style={styles.logo}/> 



            <View style={styles.textContainer}> 
                <KeyboardAvoidingView behavior="padding">
                <View style={styles.inputContainer}>
                    <Image source={emailIcon} style={styles.emailIcon} />
                    <TextInput
                        autoCapitalize="none"
                        mode="flat"
                        textColor="black"
                        style={styles.textBox}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Username"
                        placeholderTextColor={"gray"}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Image source={keyIcon} style={styles.emailIcon} />
                    <TextInput
                        autoCapitalize="none"
                        mode="flat"
                        textColor="black"
                        style={styles.textBox}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor={"grey"}
                    />
                </View>
                </KeyboardAvoidingView>   
                <LoginButton onPress={signIn} text={"Login"}/>
                <LoginButton onPress={signUp} text={"Sign up"}/>
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
    logo: {
        flex: 1,
        width: 300,
        height: 300,
        marginLeft: "20%",
        resizeMode: "contain",
    },
    title: {
        fontSize: 35,
        fontStyle: "normal",
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