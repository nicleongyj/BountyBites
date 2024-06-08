import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
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

  const handleViewAnalytics = () => {
    // Navigate to the Analytics screen
    navigation.navigate("Analytics");
  };

  const handleViewFoodShared = () => {
    // Navigate to the screen that shows the food shared currently
    navigation.navigate("FoodShared");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Restaurant Information</Text>
      {restaurantData ? (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Username: {restaurantData.username}
          </Text>
          <Text style={styles.infoText}>
            Location: {restaurantData.location}
          </Text>
          <Text style={styles.infoText}>
            Restaurant Name: {restaurantData.restaurantName}
          </Text>
          <Text style={styles.infoText}>
            Latitude: {restaurantData.latitude}
          </Text>
          <Text style={styles.infoText}>
            Longitude: {restaurantData.longitude}
          </Text>
        </View>
      ) : (
        <Text style={styles.noDataText}>No restaurant data found</Text>
      )}
      <Button mode="contained" onPress={handleShareFood} style={styles.button}>
        Share Food
      </Button>
      <Button
        mode="contained"
        onPress={handleViewAnalytics}
        style={styles.button}
      >
        View Analytics
      </Button>
      <Button
        mode="contained"
        onPress={handleViewFoodShared}
        style={styles.button}
      >
        View Food Shared
      </Button>
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        Log Out
      </Button>

      {/* Share Food Modal */}
      <ShareFoodModal
        visible={modalVisible}
        closeModal={closeModal}
        restaurantData={restaurantData}
        userId={userId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  infoContainer: {
    marginBottom: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
    textAlign: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    marginTop: 10,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#6200ee", // Primary button color
  },
  logoutButton: {
    marginTop: 10,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#d9534f", // Red color for the logout button
  },
});
