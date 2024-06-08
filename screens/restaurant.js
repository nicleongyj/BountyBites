import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { LoginContext } from "../App";
import { fetchRestaurantData } from "../firestoreUtils";

export default function Home({ navigation }) {
  const { logout } = useContext(LoginContext);
  const [restaurantData, setRestaurantData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurant data using the user ID
        const userId = "hAV4EkrRuKSmWBGMwKikVsmpcCQ2"; // Replace with actual user ID
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
      <Button onPress={handleLogout}>Back to start page</Button>
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
