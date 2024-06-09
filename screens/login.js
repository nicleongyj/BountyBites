import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { useState, useContext } from "react";

import logo from "../assets/logo.png";

import { FIREBASE_AUTH } from "../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LoginContext, RestaurantContext } from "../App";

export default function LoginScreen({ navigation }) {
  const { login, setUserId } = useContext(LoginContext);
  const { setRestaurant } = useContext(RestaurantContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;

  const termsConditionHandler = () => {
    navigation.navigate("Terms and Condition Screen");
  };

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const userId = response.user.uid;
      setLoading(false);
      setUserId(userId); // Set userId in context
      login();
      setRestaurant();
    } catch (error) {
      setLoading(false);
      alert("Invalid Username or Password");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* <ImageBackground source={background} resizeMode='Stretch' style={{flex:1}} > */}

        <View style={styles.logoContainer}>
          <Text style={styles.title}>Bounty Bites</Text>
          <Text style={styles.subTitle}>
            Save your wallet while saving the earth!
          </Text>

          <Image source={logo} style={styles.logo} />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.inputContainer}>
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

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={signIn}
              labelStyle={styles.buttonLabel}
              style={styles.button}
            >
              Log In
            </Button>
            {loading ? <ActivityIndicator color="black" /> : null}
          </View>
          <View style={styles.registerContainer}>
            <Text>Dont have an account? </Text>
            {/*<Text>Contact royce@bountybites.com to register your restaurant!</Text> */}
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Register Screen")}
              labelStyle={styles.registerButtonLabel}
              style={styles.registerButton}
            >
              Register here!
            </Button>
          </View>

          <View style={styles.tncContainer}>
            <Pressable onPress={termsConditionHandler}>
              <Text style={styles.text1}>By continuing, you agree to our</Text>
              <Text style={styles.text2}>
                Terms of Service and Privacy Policy
              </Text>
            </Pressable>
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
  subTitle: {
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
  buttonContainer: {
    flex: 1,
    marginTop: "5%",
    flexDirection: "column",
    alignItems: "center",
  },
  registerContainer: {
    flex: 1,
    marginTop: "5%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: "5%",
  },
  emailIcon: {
    height: 30,
    width: 30,
    marginRight: "3%",
  },
  textBox: {
    backgroundColor: "white",
    height: 42,
    width: 350,
    fontSize: 15,
    borderColor: "rgba(0, 0, 0, 0.5)",
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
    marginBottom: 10,
  },
  buttonLabel: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  registerButtonLabel: {
    color: "blue",
    fontSize: 15,
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  tncContainer: {
    flex: 2,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
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
