import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { LoginContext } from "../App";
import { fetchRestaurantData } from "../firestoreUtils";
import ShareFoodModal from "./ShareFoodModal";

export default function Restaurant({ navigation }) {
  const { logout } = useContext(LoginContext);
  const [restaurantData, setRestaurantData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const userId = "hAV4EkrRuKSmWBGMwKikVsmpcCQ2"; // Replace with actual user ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRestaurantData(userId);
        setRestaurantData(data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleShareFood = () => {
    // Show the Share Food modal
    setModalVisible(true);
  };

  const closeModal = () => {
    // Close the modal
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Restaurant Information</Text>
      {restaurantData ? (
        <View>
          <Text>Username: {restaurantData.username}</Text>
          <Text>Location: {restaurantData.location}</Text>
          <Text>Restaurant Name: {restaurantData.restaurantName}</Text>
          <Text>Latitude: {restaurantData.latitude}</Text>
          <Text>Longitude: {restaurantData.longitude}</Text>
        </View>
      ) : (
        <Text>No restaurant data found</Text>
      )}
      <Button onPress={handleShareFood}>Share Food</Button>
      <Button onPress={handleLogout}>Log Out</Button>

      {/* Share Food Modal */}
      <ShareFoodModal visible={modalVisible} closeModal={closeModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
