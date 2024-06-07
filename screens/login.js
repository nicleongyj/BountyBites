import { View, Text, StyleSheet, Image, ImageBackground, TextInput, Alert, KeyboardAvoidingView } from "react-native";
import { useState } from "react";

import background from "../assets/loginImage.jpg";
import emailIcon from "../assets/emailIcon.png";
import keyIcon from "../assets/key.png";
import logo from "../assets/logo.png";


import LoginButton from "../components/loginButton";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";



export default function LoginScreen({ route }) {

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
        <SafeAreaView style={styles.container}>
            <View style = {styles.container}>
            {/* <ImageBackground source={background} resizeMode='Stretch' style={{flex:1}} > */}

                <View style={styles.logoContainer}>
                    <Text style={styles.title}>Bounty Bites</Text>
                    <Text style={styles.subTitle}>Save your wallet while saving the earth!</Text>
                    
                    <Image source={logo} style={styles.logo}/> 
                </View>



                <View style={styles.textContainer}> 
                    {/* <KeyboardAvoidingView behavior="padding"> */}
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
                    {/* </KeyboardAvoidingView>    */}
                    <LoginButton onPress={signIn} text={"Login"}/>
                    <LoginButton onPress={signUp} text={"Sign up"}/>
                
                </View>
        
            {/* </ImageBackground> */}
            </View>
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
        paddingTop: "10%",
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
        fontSize: 20,
        color: "black",
        fontWeight: "bold",
    },
    textContainer: {
        flex: 3,
        flexDirection: "column",
        // justifyContent: "center",
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