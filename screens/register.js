import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { LoginContext, RestaurantContext } from "../App";
import { storeRestaurantData } from "../firestoreUtils";
import * as Location from "expo-location";

export default function RegisterScreen({ navigation }) {
  const { login } = useContext(LoginContext);
  const { setRestaurant } = useContext(RestaurantContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;

  const signUp = async (location) => {
    try {
      setLoading(true);
      const response = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      const userId = response.user.uid;

      const restaurantData = {
        userId,
        username,
        location,
        restaurantName,
        latitude,
        longitude,
      };

      await storeRestaurantData(restaurantData);

      setLoading(false);
      login();
      setRestaurant();
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  const geocodeAddress = async () => {
    try {
      const geoencodedLocation = await Location.geocodeAsync(location);
    } catch (error) {
      console.error("Error geocoding address:", error);
      alert("Error geocoding address");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.scrollView}>

        <View style={styles.titleContainer}>
            <Text style={{fontWeight:"bold", fontSize:30}}>Create an account</Text>
        </View>


          <View style={styles.inputContainer}>
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
            <TextInput
              autoCapitalize="none"
              mode="flat"
              textColor="black"
              style={styles.textBox}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={"grey"}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="none"
              mode="flat"
              textColor="black"
              style={styles.textBox}
              value={restaurantName}
              onChangeText={setRestaurantName}
              placeholder="Restaurant Name"
              placeholderTextColor={"grey"}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="none"
              mode="flat"
              textColor="black"
              style={styles.textBox}
              value={location}
              onChangeText={setLocation}
              placeholder="Address or Postal Code"
              placeholderTextColor={"grey"}
            />
           
          </View>

          <View style={{flex:1,alignItems: "center", justifyContent:'center'}}>
            <Button mode="contained" onPress={() => geocodeAddress(location)} style={styles.locationButton} labelStyle={styles.locationButtonLabel}>Get coordinates</Button>
            {/* <Button mode="contained" onPress={handleManualCoordinates} style={styles.locationButton} labelStyle={styles.locationButtonLabel}>Select location on map</Button> */}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="none"
              mode="flat"
              textColor="black"
              style={styles.textBox}
              value={latitude}
            //   onChangeText={setLatitude}
              placeholder="Latitude"
              placeholderTextColor={"grey"}
              disabled={true}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="none"
              mode="flat"
              textColor="black"
              style={styles.textBox}
              value={longitude}
            //   onChangeText={setLongitude}
              placeholder={"Longitude"}
              placeholderTextColor={"grey"}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={signUp}
              labelStyle={styles.buttonLabel}
              style={styles.button}
            >
              Sign up with email
            </Button>
            {loading ? <ActivityIndicator color="black" /> : null}
          </View>

          <View style={styles.mainButtonContainer}>
            <Text style={styles.text1}>By continuing you agree to our</Text>
            <Text style={styles.text2}>
              Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  logoContainer: {
    flex: 2,
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    color: "black",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
  title2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  subTitle2: {
    paddingTop: "2%",
    fontSize: 15,
    color: "black",
  },
  textContainer: {
    flex: 7,
    alignItems: "center",
  },
  inputContainer: {
    flex:2,
    marginTop: "5%",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  mainButtonContainer: {
    flex: 10,
    paddingTop: "5%",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 10,
    marginTop: "5%",
    alignItems: "center",
  },
  textBox: {
    backgroundColor: "white",
    height: 42,
    width: 320,
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
  locationButton: {
    backgroundColor: "black",
    width: 150,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 10,
    // marginBottom: 10,

  },
  locationButtonLabel: {
    color: "white",
    fontSize: 10,
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

