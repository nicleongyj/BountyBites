import { doc, getDoc } from "firebase/firestore";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginContext } from "../App";
import { FIREBASE_DB } from "../FirebaseConfig";
import { useState, useEffect, useContext } from "react";

export default function FoodShared({ navigation }) {
  const { userId } = useContext(LoginContext);
  const [foodItems, setFoodItems] = useState([]);

  const fetchFoodItems = async (userId) => {
    try {
      const docRef = doc(FIREBASE_DB, "food-today", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const foodItemsArray = docSnap.data().foodItems;
        const items = foodItemsArray.map((foodItem, index) => ({
          id: `${userId}-${index}`, // Unique key for each food item
          ...foodItem,
        }));
        setFoodItems(items);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching food items: ", error);
    }
  };

  // Usage in the component
  useEffect(() => {
    if (userId) {
      fetchFoodItems(userId);
    }
  }, [userId]);

  console.log(foodItems);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Food Shared</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {foodItems.map((foodItem) => (
          <TouchableOpacity
            key={foodItem.id}
            style={styles.foodCard}
            onPress={() => {
              // Navigate to a detailed view of the food item or perform other actions
            }}
          >
            <Text style={styles.foodText}>Food Name: {foodItem.name}</Text>
            <Text style={styles.foodText}>Price: $ {foodItem.price}</Text>
            <Text style={styles.foodText}>Discount: {foodItem.discount}%</Text>
            <Text style={styles.foodText}>
              Total Quantity: {foodItem.quantity}
            </Text>
            <Text style={styles.foodText}>
              Current Quantity: {foodItem.currentQuantity}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  foodCard: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "whitesmoke",
  },
  foodText: {
    fontSize: 16,
    marginBottom: 5,
  },
  foodImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginTop: 10,
  },
});
