import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
  } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { useState, useRef, useEffect, useContext } from "react";
  import { Button } from "react-native-paper";
  import { ScrollView, ActivityIndicator} from "react-native";
  // Camera imports
  import { Camera, CameraView } from "expo-camera";
  import * as ImagePicker from "expo-image-picker";
  import CameraButton from "../assets/camera.png";
  import { LoginContext } from "../App";
  import { storeFoodData } from "../firestoreUtils";
  import { uploadFoodPhoto } from "../firestorageUtils";
  
  export default function ShareFood({ navigation }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [quantity, setQuantity] = useState("");
    const { userId } = useContext(LoginContext);
    const [submitting, setSubmitting] = useState(false);
  
    // Camera states
    const [hasPermission, setHasPermission] = useState(null);
    const [startCamera, setStartCamera] = useState(false);
    const [image, setImage] = useState(null);
    const cameraRef = useRef(null);
    const [facing, setFacing] = useState("back");
  
    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    }, []);
  
    if (!hasPermission) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ alignSelf: "center" }}>No access to camera</Text>
          <Text style={{ alignSelf: "center" }}>
            Allow Expo to access your camera in your settings
          </Text>
        </View>
      );
    }
  
    const enableCamera = () => {
      setStartCamera(true);
    };
  
    const takePicture = async () => {
      if (cameraRef) {
        try {
          const data = await cameraRef.current.takePictureAsync();
          console.log("Image taken");
          setImage(data === undefined ? "jest" : data.uri);
          console.log(data.uri);
        } catch (error) {
          alert("Please try again!", [{ text: "OK" }]);
          return;
        }
      }
    };
  
    const renderInput = (label, value, onChangeText, returnKeyType) => (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="default"
          returnKeyType={returnKeyType}
        />
      </View>
    );
  
    const handleShare = async () => {
        setSubmitting(true);
        console.log("1")

        if (!name.trim()) {
            alert("Please enter a name for the food item.");
            setSubmitting(false);
            return;
        }
        console.log("2")
    
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            alert("Please enter a valid price for the food item.");
            setSubmitting(false);
            return;
        }
        console.log("3")
    
        const parsedDiscount = parseFloat(discount);
        if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
            alert("Please enter a valid discount percentage for the food item.");
            setSubmitting(false);
            return;
        }
        console.log("4")
    
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            alert("Please enter a valid quantity for the food item.");
            setSubmitting(false);
            return;
        }
        console.log("5")

        if (image == null) {
            alert("Please take a picture of the food item.");
            setSubmitting(false);
            return;
        }
        console.log("6")

        const link = await uploadFoodPhoto(image);
        console.log("Image downloaded: " + link)


        const foodData = {
            name: name,
            price: parsedPrice,
            discount: parsedDiscount,
            quantity: parsedQuantity,
            link: link,
        };
    
        try {
            await storeFoodData(userId, foodData);
            
            // Alert the user that the food has been shared successfully
            alert("Food item shared successfully!");
            // Clear input fields after sharing
            setName("");
            setPrice("");
            setDiscount("");
            setQuantity("");
            setImage(null);
            setSubmitting(false);
        } catch (error) {
            console.error("Error storing food data: ", error);
            alert("Failed to share food item. Error: " + error.message); // Log error message
            setSubmitting(false);
            throw error;
        }

    };
  
    return (
      <View style={styles.outerContainer}>
        {!startCamera ? (
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.topContainer}>
              <Text style={styles.title}>Add a food item</Text>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.midContainer}>
                {renderInput("Name:", name, setName, "next")}
                {renderInput("Price ($):", price, setPrice, "next")}
                {renderInput("Discount (%):", discount, setDiscount, "next")}
                {renderInput("Quantity:", quantity, setQuantity, "next")}
              </View>
  
              <View style={styles.cameraContainer}>
                <Text style={styles.inputLabel}>Add a picture</Text>
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={enableCamera}
                  >
                    <Text style={styles.cameraText}>
                      {image == null ? "Take a picture" : "View image"}
                    </Text>
                  </TouchableOpacity>
  
                  {image != null && (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ fontWeight: "bold" }}>Image: </Text>
                      <Image
                        source={{ uri: image }}
                        style={{ height: 60, width: 60 }}
                      />
                    </View>
                  )}
                </View>
              </View>
  
              <View style={styles.bottomContainer}>
                <Button
                  mode="contained"
                  style={styles.submitButton}
                  onPress={handleShare}
                  disabled={submitting}
                >
                  Share
                </Button>
                {submitting ? <ActivityIndicator color="black" /> : null}
                
              </View>
            </ScrollView>
          </SafeAreaView>
        ) : startCamera && !image ? (
          <View style={{ flex: 1 }}>
            <CameraView facing={facing} style={{ flex: 1 }} ref={cameraRef}>
              <View style={styles.cameraBottomContainer}>
                <TouchableOpacity
                  style={styles.pictureButton}
                  onPress={takePicture}
                  testID="shutterButton"
                >
                  <Image
                    source={CameraButton}
                    style={{
                      height: 50,
                      width: 50,
                      backgroundColor: "white",
                      borderRadius: 40,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Image source={{ uri: image }} style={styles.photoTaken} />
            <View style={styles.overlayContainer}>
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: "10%",
                  width: "100%",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  mode="contained"
                  style={{
                    width: 150,
                    zIndex: 3,
                    borderWidth: 2,
                    borderColor: "black",
                  }}
                  buttonColor="navajowhite"
                  labelStyle={{ fontWeight: "bold" }}
                  onPress={() => setImage(null)}
                  textColor="black"
                >
                  Retake
                </Button>
  
                <Button
                  mode="contained"
                  style={{
                    width: 150,
                    zIndex: 3,
                    borderWidth: 2,
                    borderColor: "black",
                  }}
                  buttonColor="navajowhite"
                  labelStyle={{ fontWeight: "bold" }}
                  onPress={() => setStartCamera(false)}
                  textColor="black"
                  testID="useImageButton"
                >
                  Use image
                </Button>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: "white",
    },
    topContainer: {
      flex: 1,
      backgroundColor: "white",
      alignItems: "center",
      padding: 10,
      flexDirection: "column",
    },
    midContainer: {
      flex: 8,
      backgroundColor: "white",
      flexDirection: "column",
      alignItems: "center",
      // padding: 10,
    },
    bottomContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 10,
    },
    inputContainer: {
      flex: 1,
      width: "90%",
      paddingTop: 10,
    },
    inputLabel: {
      fontSize: 15,
      fontWeight: "bold",
    },
    title: {
      fontSize: 25,
      fontWeight: "bold",
    },
    text: {
      fontSize: 20,
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 5,
      paddingHorizontal: 10,
    },
  
    submitButton: {
      width: 150,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      marginTop: 20,
      backgroundColor: "black",
    },
    cameraContainer: {
      flex: 3,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 40,
    },
    cameraButton: {
      width: 130,
      borderRadius: 20,
      backgroundColor: "skyblue",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: 40,
      marginBottom: "3%",
    },
  
    cameraBottomContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-evenly",
      paddingBottom: 30,
    },
  
    photoTaken: {
      flex: 1,
      borderRadius: 20,
      resizeMode: "cover",
    },
    pictureButton: {
      backgroundColor: "white",
      width: 70,
      height: 70,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    overlayContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "flex-end",
      alignItems: "center",
    },
  });