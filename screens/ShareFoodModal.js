import React, { useState, useEffect } from "react";
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

const ShareFoodModal = ({ visible, closeModal }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    // Reset input fields when the modal is opened
    if (visible) {
      setName("");
      setDescription("");
      setPrice("");
      setDiscount("");
      setQuantity("");
    }
  }, [visible]);

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

  const handleShare = () => {
    // Validation checks
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

    // Handle sharing logic here
    closeModal(); // Close the modal after sharing
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
          {renderInput("Quantity", quantity, setQuantity, "done")}
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
const modalWidth = width - 40; // Subtract padding

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
