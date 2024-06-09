import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Dimensions,
  Alert,
} from "react-native";
import { storeFoodData } from "../firestoreUtils";
import { LoginContext } from "../App";

// Camera imports
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import CameraButton from "../assets/camera.png";

const ShareFoodModal = ({ visible, closeModal, restaurantData }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [endTime, setEndTime] = useState("");
  const { userId } = useContext(LoginContext);

  // Camera states
  const [hasPermission, setHasPermission] = useState(null);
  const [startCamera, setStartCamera] = useState(false);
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);

  // if (!hasPermission) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text style={{ alignSelf: "center" }}>No access to camera</Text>
  //       <Text style={{ alignSelf: "center" }}>
  //         Allow Expo to access your camera in your settings
  //       </Text>
  //     </View>
  //   );
  // }

  const enableCamera = () => {
    setStartCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data === undefined ? "jest" : data.uri);
      } catch (error) {
        alert("Error", "Please try again!", [{ text: "OK" }]);
        return;
      }
    }
  };

  useEffect(() => {
    if (visible) {
      setName("");
      setDescription("");
      setPrice("");
      setDiscount("");
      setQuantity("");
      setEndTime("");
    }
  }, [visible]);

  const isValidTime = (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
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

    const foodData = {
      name: name,
      price: parsedPrice,
      discount: parsedDiscount,
      quantity: parsedQuantity,
    };

    try {
      await storeFoodData(userId, foodData);
      closeModal(); // Close the modal after sharing
    } catch (error) {
      Alert.alert("Error", "Failed to share food item.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Share Food</Text>
          {renderInput("Name", name, setName, "next")}
          {renderInput("Description", description, setDescription, "next")}
          {renderInput("Price ($)", price, setPrice, "next")}
          {renderInput("Discount (%)", discount, setDiscount, "next")}
          {renderInput("Quantity", quantity, setQuantity, "next")}
          {renderInput("End Time (HH:MM)", endTime, setEndTime, "done")}
          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={closeModal} color="red" />
            <Button title="Share" onPress={handleShare} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get("window");
const modalWidth = width - 40;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: modalWidth,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default ShareFoodModal;
