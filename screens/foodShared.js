import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginContext } from "../App";
import { FIREBASE_DB } from "../FirebaseConfig";
import { useState, useEffect, useContext } from "react";

export default function FoodShared({ navigation }) {
  const { userId } = useContext(LoginContext);
  const [foodItems, setFoodItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editValues, setEditValues] = useState({
    currentQuantity: "",
    discount: "",
  });

  const fetchFoodItems = async (userId) => {
    try {
      const docRef = doc(FIREBASE_DB, "food-today", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const foodItemsArray = docSnap.data().foodItems;
        setFoodItems(foodItemsArray);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching food items: ", error);
    }
  };

  const handleEdit = (item, index) => {
    setEditingItem(index);
    setEditValues({
      currentQuantity: item.currentQuantity.toString(),
      discount: item.discount.toString(),
    });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedItems = foodItems.map((item, index) =>
        index === editingItem
          ? {
              ...item,
              currentQuantity: parseInt(editValues.currentQuantity),
              discount: parseFloat(editValues.discount),
            }
          : item
      );
      setFoodItems(updatedItems);

      const docRef = doc(FIREBASE_DB, "food-today", userId);
      await updateDoc(docRef, { foodItems: updatedItems });

      setEditingItem(null);
      setEditValues({ currentQuantity: "", discount: "" });
    } catch (error) {
      console.error("Error saving food item: ", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const updatedItems = foodItems.filter((_, i) => i !== index);
      setFoodItems(updatedItems);

      const docRef = doc(FIREBASE_DB, "food-today", userId);
      await updateDoc(docRef, { foodItems: updatedItems });
    } catch (error) {
      console.error("Error deleting food item: ", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFoodItems(userId);
    }
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Food Shared</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {foodItems.map((foodItem, index) => (
          <View key={index} style={styles.foodCard}>
            {editingItem === index ? (
              <View>
                <Text style={styles.foodText}>Food Name: {foodItem.name}</Text>
                <Text style={styles.foodText}>Price: $ {foodItem.price}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Current Quantity"
                  value={editValues.currentQuantity}
                  onChangeText={(text) =>
                    setEditValues({ ...editValues, currentQuantity: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Discount"
                  value={editValues.discount}
                  onChangeText={(text) =>
                    setEditValues({ ...editValues, discount: text })
                  }
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditingItem(null)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.foodText}>Food Name: {foodItem.name}</Text>
                <Text style={styles.foodText}>Price: $ {foodItem.price}</Text>
                <Text style={styles.foodText}>
                  Discount: {foodItem.discount}%
                </Text>
                <Text style={styles.foodText}>
                  Total Quantity: {foodItem.quantity}
                </Text>
                <Text style={styles.foodText}>
                  Current Quantity: {foodItem.currentQuantity}
                </Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(foodItem, index)}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(index)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
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
  editButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
});
