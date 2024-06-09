import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';  
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { Button } from 'react-native-paper';

// Camera imports
import { Camera, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import CameraButton from "../assets/camera.png";

export default function ShareFood({navigation}) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [quantity, setQuantity] = useState("");
    const [endTime, setEndTime] = useState("");

    // Camera states
    const [hasPermission, setHasPermission] = useState(null);
    const [startCamera, setStartCamera] = useState(false);
    const [image, setImage] = useState(null);
    const cameraRef = useRef(null);
    const [facing, setFacing] = useState("back");

    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
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
            console.log("Image taken")
            setImage(data.uri);
            console.log(data.uri)
          } catch (error) {
            alert("Error", "Please try again!", [{ text: "OK" }]);
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
        if (!name.trim()) {
          Alert.alert("Error", "Please enter a name for the food item.");
          return;
        }
    
        if (!description.trim()) {
          Alert.alert("Error", "Please enter a description for the food item.");
          return;
        }
    
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
          Alert.alert("Error", "Please enter a valid price for the food item.");
          return;
        }
    
        const parsedDiscount = parseFloat(discount);
        if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
          Alert.alert(
            "Error",
            "Please enter a valid discount percentage for the food item."
          );
          return;
        }
    
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
          Alert.alert("Error", "Please enter a valid quantity for the food item.");
          return;
        }
    
        if (!isValidTime(endTime)) {
          Alert.alert("Error", "Please enter a valid end time (HH:MM).");
          return;
        }
    
        const food = {
          name: name,
          description: description,
          price: parsedPrice,
          discount: parsedDiscount,
          quantity: parsedQuantity,
        };
    
        const foodData = {
          food: food,
          endTime: endTime,
        };
    
        try {
          await storeFoodData(userId, foodData);
          closeModal(); // Close the modal after sharing
        } catch (error) {
          Alert.alert("Error", "Failed to share food item.");
        }
      };    

    return (
        <View style={styles.outerContainer}>

            {!startCamera ? (

                <SafeAreaView style={{flex:1}}>

                    <View style={styles.topContainer}>
                        <Text style={styles.title}>  
                            Add a food item 🍔
                        </Text>
                    </View>

                    <View style={styles.midContainer}>
                            {renderInput("Name:", name, setName, "next")}
                            {renderInput("Description:", description, setDescription, "next")}
                            {renderInput("Price ($):", price, setPrice, "next")}
                            {renderInput("Discount (%):", discount, setDiscount, "next")}
                            {renderInput("Quantity:", quantity, setQuantity, "next")}
                            {renderInput("End Time (HH:MM):", endTime, setEndTime, "done")}
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
                            <View
                            style={{ flexDirection: "row", alignItems: "center" }}
                            >
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
                        <Button mode="contained" style={styles.submitButton} onPress={handleShare}>
                            Share
                        </Button>
                    </View>

                </SafeAreaView>

            ) : startCamera && !image ? (

                <View style={{flex:1}}>
                    <CameraView facing={facing} style={{flex:1}} ref={cameraRef}>
                        <View style={styles.cameraBottomContainer}>

                            <TouchableOpacity
                                style={styles.pictureButton}
                                onPress={takePicture}
                                testID="shutterButton"
                                >
                                <Image source={CameraButton} style={{ height: 50, width: 50, backgroundColor:'white', borderRadius:40 }} />
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
        flex:1,
        backgroundColor: "white",
        alignItems: "center",
        padding:10,
        flexDirection: "column",
    },
    midContainer: {
        flex: 11,
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
        flex:4,
        width: "90%",
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
        paddingBottom:30
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