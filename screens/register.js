import { View, Text, StyleSheet, Image, TextInput, KeyboardAvoidingView } from "react-native";
import { useState, useContext } from "react";

import { FIREBASE_AUTH } from "../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { LoginContext, RestaurantContext } from "../App";

export default function RegisterScreen({ navigation }) {
    const { login } = useContext(LoginContext);
    const { setRestaurant } = useContext(RestaurantContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const auth = FIREBASE_AUTH;

    const signUp = async () => {    
        try {
            setLoading(true);
            const response = await createUserWithEmailAndPassword(auth, username, password);
            setLoading(false);
            login();
            setRestaurant();
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
                </View>

                <View style={styles.midContainer}>

                </View>



                <View style={styles.textContainer}> 
                    <Text style={styles.title2}>Create an account</Text>
                    <Text style={styles.subTitle2}>Enter your email to sign up for an account!</Text> 
                    {/* <KeyboardAvoidingView behavior="padding"> */}
                    <View style={styles.inputContainer}>
                        {/* <Image source={emailIcon} style={styles.emailIcon} /> */}
                        <TextInput
                            autoCapitalize="none"
                            mode="flat"
                            textColor="black"
                            style={styles.textBox}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="email@domain.com"
                            placeholderTextColor={"gray"}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        {/* <Image source={keyIcon} style={styles.emailIcon} /> */}
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
                    <View style={styles.buttonContainer}>
                        <Button mode="contained" onPress={signUp} labelStyle = {styles.buttonLabel} style={styles.button}>Sign up with email</Button>
                    </View>

                    <View style={styles.mainButtonContainer}> 
                        <Text style={styles.text1}>By continuing you agree to our</Text>
                        <Text style={styles.text2}>Terms of Service and Privacy Policy</Text>
                    </View>
                
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
        flex: 2,
        alignItems: "center",
        flexDirection: "column",
      },
    midContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
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
    title2: {
        fontSize: 20,
        fontStyle: "normal",
        fontWeight: "bold",
        color: "black",
    },
    subTitle2:{
        paddingTop: "2%",
        fontSize: 15,
        color: "black",
    },
    textContainer: {
        flex: 7,
        flexDirection: "column",
        // justifyContent: "center",
        alignItems: "center",
    },

    inputContainer: {
        marginTop: "5%",
        flexDirection: "row",
        alignItems: "center",
    },
    mainButtonContainer: {
        flex: 2,
        flexDirection: "column",
        paddingTop: "5%",
        alignItems: "center",
    },
    buttonContainer: {
        marginTop: "5%",
        flexDirection: "column",
        alignItems: "center",
    },
    registerContainer: {
        marginTop: "5%",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: "5%",
    },
    textBox: {
        backgroundColor: "white",
        height: 42,
        width: 350,
        fontSize: 15,
        borderColor: 'rgba(0, 0, 0, 0.5)', 
        borderWidth: 1,     
        borderRadius: 7,  
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: "black",
        width: 350,
        height: 42,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 20,
    },
    buttonLabel: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },
    text1: {
        marginTop: 10,
        color: "black",
        fontSize: 12,
    },
    text2: {
        color: "black",
        fontSize: 12,
        fontWeight: "bold",
    },
});