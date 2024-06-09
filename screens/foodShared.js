import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginContext } from "../App";
import { FIREBASE_DB } from "../FirebaseConfig";
import { useState, useEffect, useContext } from "react";
import {fetchFoodItems} from "../firestoreUtils";

export default function FoodShared({ navigation }) {
  const { userId } = useContext(LoginContext);
  const [foodItems, setFoodItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editValues, setEditValues] = useState({
    currentQuantity: "",
    discount: "",
  });

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditValues({
      currentQuantity: item.currentQuantity.toString(),
      discount: item.discount.toString(),
    });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedItems = foodItems.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              ...editValues,
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

  const handleDelete = async (id) => {
    try {
      const updatedItems = foodItems.filter((item) => item.id !== id);
      setFoodItems(updatedItems);

      const docRef = doc(FIREBASE_DB, "food-today", userId);
      await updateDoc(docRef, { foodItems: updatedItems });
    } catch (error) {
      console.error("Error deleting food item: ", error);
    }
  };

    useEffect(() => {
      if (userId) {
        fetchFoodItems(userId).then(items => setFoodItems(items));
      }
    }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Food Shared</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {foodItems.map((foodItem) => (
          <View key={foodItem.id} style={styles.foodCard}>
            {editingItem && editingItem.id === foodItem.id ? (
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
                <View style={styles.outerContainer}>
                  <View style={styles.leftContainer}>

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

                  </View>

                <View style={styles.rightContainer}>
                  <Image
                    source={{ uri: foodItem.link }}
                    style={{ width: 100, height: 100 }}
                  />

                </View>

                </View>

                <View style={{flexDirection:'row', width:'100%',justifyContent:'space-between', alignContent:'center' }}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(foodItem)}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(foodItem.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      </View>
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
    borderWidth: 1,
    borderColor: "black",
  },
  outerContainer: {
    flexDirection: "row",
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  foodText: {
    fontSize: 16,
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: "#72ba76",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '45%',
  },
  deleteButton: {
    backgroundColor: "#db254a",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '45%',
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
