import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { LoginContext, RestaurantContext } from "../App";
import { storeRestaurantData } from "../firestoreUtils";
import * as Location from "expo-location";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { uploadRestaurantPhoto } from "../firestorageUtils";

export default function RegisterScreen({ navigation }) {
  const { login } = useContext(LoginContext);
  const { setRestaurant } = useContext(RestaurantContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [closingTime, setClosingTime] = useState("");

  const auth = FIREBASE_AUTH;

  const termsConditionHandler = () => {
    navigation.navigate("Terms and Condition Screen");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const signUp = async () => {
      if (username === "" || password === "" || location === "" || restaurantName === "" || image === null) {
          alert("Please fill in all fields");
          setLoading(false);
          return;
        }

    try {
      setLoading(true);
      const data = await geocodeAddress();
      const latitude = data.latitude.toString();
      const longitude = data.longitude.toString();
      if (latitude === "" || longitude === "") {
        alert("Invalid address, please try again.");
        setLoading(false);
        return;
      }
      console.log("coordinates" + latitude + ", " + longitude);
      const response = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      const userId = response.user.uid;

      const link = await uploadRestaurantPhoto(image, userId);

      const restaurantData = {
        userId,
        username,
        location,
        restaurantName,
        latitude,
        longitude,
        type,
        closingTime,
        link,
        items: [],
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
      console.log("Geocoding address:", location);
      const geoencodedLocation = await Location.geocodeAsync(location);
      console.log("Geocoded location:", geoencodedLocation);
      return geoencodedLocation[0];
    } catch (error) {
      console.error("Error geocoding address:", error);
      alert("Error geocoding address: " + error.message);
    }
  };

  const [foodType, setFoodType] = useState([
    { label: "Restaurant", value: "Restaurant" },
    { label: "Bakery", value: "Bakery" },
    { label: "Supermarket", value: "Supermarket" },
  ]);
  const [type, setType] = useState("Select a food type");
  const [open, setOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={{ flex: 1 }}>
          <View style={{ flex: 2, alignItems: "center", paddingBottom: 15 }}>
            <Text style={styles.title}>Create account</Text>
          </View>

          <View
            style={{
              flex: 2,
              alignItems: "center",
              zIndex: 111,
              paddingBottom: 20,
            }}
          >
            <DropDownPicker
              open={open}
              setOpen={setOpen}
              items={foodType}
              value={type}
              setValue={setType}
              containerStyle={{ height: 40, width: 320, zIndex: 1000 }}
              style={{
                backgroundColor: "white",
                borderColor: "rgba(0, 0, 0, 0.5)",
                borderWidth: 1,
              }}
              dropDownContainerStyle={{ backgroundColor: "#fafafa" }}
              defaultValue={type}
              onChangeValue={(value) => setType(value)}
            />
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
              value={closingTime}
              onChangeText={setClosingTime}
              placeholder="Closing time (HH:MM)"
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

          <View style={styles.coordinates}>      
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                paddingLeft: "10%",
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={pickImage}
                >
                  <Text style={styles.cameraText}>
                    {image == null ? "Choose an Image" : "Change image"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  alignContent: "right",
                  flexDirection: "row",
                }}
              >
                {image != null && (
                  <>
                    <Text style={{ fontWeight: "bold" }}>Image: </Text>
                    <Image
                      source={{ uri: image }}
                      style={{ height: 60, width: 60 }}
                    />
                  </>
                )}
              </View>
            </View>
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

          <View style={styles.tncContainer}>
            <TouchableOpacity onPress={termsConditionHandler}>
              <Text style={styles.text1}>By continuing, you agree to our</Text>
              <Text style={styles.text2}>
                Terms of Service and Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    fontSize: 30,
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
    flex: 3,
    marginTop: "5%",
    alignItems: "center",
    zIndex: 1,
  },
  coordinates: {
    flex: 1,
    paddingTop: "10%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  mainButtonContainer: {
    flex: 4,
    paddingTop: "5%",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 4,
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
  coordinateBox: {
    backgroundColor: "white",
    height: 42,
    width: 100,
    fontSize: 15,
    borderColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 5,
  },
  button: {
    marginTop: 10,
    width: 260,
    alignSelf: "center",
    backgroundColor: "black",
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
    textAlign: "center",
  },
  text2: {
    color: "black",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  cameraButton: {
    width: 130,
    borderRadius: 4,
    backgroundColor: "#14274e",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    marginBottom: "3%",
  },
  cameraText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  tncContainer: {
    flex: 2,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
});
