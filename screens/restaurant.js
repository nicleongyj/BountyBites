import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { LoginContext } from "../App";
import { fetchRestaurantData } from "../firestoreUtils";
import ShareFoodModal from "./ShareFoodModal";

export default function Restaurant({ navigation }) {
  const { logout } = useContext(LoginContext);
  const [restaurantData, setRestaurantData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const { userId } = useContext(LoginContext);
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
    // setModalVisible(true);
    navigation.navigate("ShareFood");
  };

  const closeModal = () => {
    // Close the modal
    setModalVisible(false);
  };

  const handleViewAnalytics = () => {
    // Navigate to the Analytics screen
    navigation.navigate("Analytics", { userId });
  };

  const handleViewFoodShared = () => {
    // Navigate to the screen that shows the food shared currently
    navigation.navigate("FoodShared");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Restaurant Information</Text>
      </View>
        
      
      
      <View style={styles.middleContainer}>
        {restaurantData ? (
          <View style={styles.infoContainer}>

            <View style={{    marginBottom: 20, flexDirection: "row", alignSelf:'center' }}>
              <Image
                source={{ uri: restaurantData.link }}
                style={{ width: 100, height: 100, alignSelf: "center" }}
              />
            </View>


            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>
                  Name:   
                </Text>
              <Text style={styles.infoText}>
                {restaurantData.restaurantName}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>
                  Username:   
                </Text>
              <Text style={styles.infoText}>
                {restaurantData.username}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>
                  Location:   
                </Text>
              <Text style={styles.infoText}>
                {restaurantData.location}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>
                  Longitude:   
                </Text>
              <Text style={styles.infoText}>
                {restaurantData.longitude}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>
                  Latitude:   
                </Text>
              <Text style={styles.infoText}>
                {restaurantData.latitude}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>
                  Closing time:   
                </Text>
              <Text style={styles.infoText}>
                {restaurantData.closingTime}
              </Text>
            </View>

          </View>
        ) : (
          <Text style={styles.noDataText}>No restaurant data found</Text>
        )}
      </View>

      <View style={styles.bottomContainer}>


      </View> 

      
      <Button mode="contained" onPress={handleShareFood} style={styles.button}>
        Share Food
      </Button>
      <Button
        mode="contained"
        onPress={handleViewFoodShared}
        style={styles.button}
      >
        View Today's Food
      </Button>
      <Button
        mode="contained"
        onPress={handleViewAnalytics}
        style={styles.analyticsButton}
      >
        View Analytics
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
    backgroundColor: "white",
  },
  topContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    alignContent: "center",
    marginBottom: 20,
    backgroundColor: "azure",

  },  
  middleContainer: {
    flex: 4,
  },  
  bottomContainer: {
    flex: 2,
  },  
  textContainer: {
    marginBottom: 20,
    // flex:1,
    flexDirection: "row", 
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
    color: "black",
    textAlign: "center",
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "black",
    textAlign: "center",
    marginRight: 10,
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
  analyticsButton : {
    marginTop: 10,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "black", // Primary button color
  },  
  logoutButton: {
    marginTop: 10,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#d9534f", // Red color for the logout button
  },
});
