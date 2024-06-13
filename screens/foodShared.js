import { doc, updateDoc } from "firebase/firestore";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { LoginContext } from "../App";
import { FIREBASE_DB } from "../FirebaseConfig";
import { useState, useEffect, useContext } from "react";
import {
  fetchFoodItems,
  deleteFoodItem,
  getTodayAsString,
} from "../firestoreUtils";

export default function FoodShared({ navigation }) {
  const { userId } = useContext(LoginContext);
  const [foodItems, setFoodItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editValues, setEditValues] = useState({
    currentQuantity: "",
    discount: "",
  });

  const handleEdit = (item, index) => {
    setEditingItem(index);
    setEditValues({
      currentQuantity: item.currentQuantity.toString(),
      discount: item.discount.toString(),
    });
  };

  const handleSaveEdit = async () => {
    setLoading(true);
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
      const today = getTodayAsString();
      const docRef = doc(FIREBASE_DB, today, userId);
      await updateDoc(docRef, { foodItems: updatedItems });

      setLoading(false);
      setEditingItem(null);
      setEditValues({ currentQuantity: "", discount: "" });
      alert("Food item updated successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error saving food item: ", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const updatedItems = await deleteFoodItem(index, foodItems, userId);
      setFoodItems(updatedItems);
      alert("Food item deleted successfully!");
    } catch (error) {
      console.error("Error deleting food item: ", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFoodItems(userId)
        .then((items) => {
          setFoodItems(items || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching food items: ", error);
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const fixedPrice = (number) => {
    return parseFloat(number).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Today's Food</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {foodItems.length > 0 ? (
          foodItems.map((foodItem, index) => (
            <View key={index} style={styles.foodCard}>
              {editingItem === index ? (
                <View>
                  <View style={styles.theTextContainer}>
                    <Text style={styles.textContainer}>Food Item: </Text>
                    <Text style={styles.foodText}>{foodItem.name}</Text>
                  </View>
                  <View style={styles.theTextContainer}>
                    <Text style={styles.textContainer}>Price $: </Text>
                    <Text style={styles.foodText}>
                      {fixedPrice(foodItem.price)}
                    </Text>
                  </View>
                  <View style={styles.theTextContainer}>
                    <Text style={styles.textContainer}>Quantity: </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Current Quantity"
                      value={editValues.currentQuantity}
                      onChangeText={(text) =>
                        setEditValues({ ...editValues, currentQuantity: text })
                      }
                    />
                  </View>
                  <View style={styles.theTextContainer}>
                    <Text style={styles.textContainer}>Discount: </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Discount"
                      value={editValues.discount}
                      onChangeText={(text) =>
                        setEditValues({ ...editValues, discount: text })
                      }
                    />
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSaveEdit}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Save</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setEditingItem(null)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={styles.outerContainer}>
                    <View style={styles.leftContainer}>
                      <View style={styles.theTextContainer}>
                        <Text style={styles.textContainer}>Food Item: </Text>
                        <Text style={styles.foodText}>{foodItem.name}</Text>
                      </View>
                      <View style={styles.theTextContainer}>
                        <Text style={styles.textContainer}>Price $: </Text>
                        <Text style={styles.foodText}>
                          {fixedPrice(foodItem.price)}
                        </Text>
                      </View>
                      <View style={styles.theTextContainer}>
                        <Text style={styles.textContainer}>Discount: </Text>
                        <Text style={styles.foodText}>{foodItem.discount}</Text>
                      </View>
                      <View style={styles.theTextContainer}>
                        <Text style={styles.textContainer}>
                          Total Quantity:{" "}
                        </Text>
                        <Text style={styles.foodText}>{foodItem.quantity}</Text>
                      </View>
                      <View style={styles.theTextContainer}>
                        <Text style={styles.textContainer}>
                          Current Quantity:{" "}
                        </Text>
                        <Text style={styles.foodText}>
                          {foodItem.currentQuantity}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rightContainer}>
                      <Image
                        source={{ uri: foodItem.link }}
                        style={styles.foodImage}
                      />
                    </View>
                  </View>
                  <View style={styles.buttonContainer}>
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
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noFoodText}>No food items available</Text>
        )}
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
    justifyContent: "start",
    alignItems: "center",
  },
  foodCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    width: "99%",
    height: 250,
    backgroundColor: "white",
    marginVertical: 10,
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
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
    backgroundColor: "#4fc734",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "45%",
  },
  deleteButton: {
    backgroundColor: "#db254a",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "45%",
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "45%",
  },
  cancelButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "45%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
    width: "70%",
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    textAlign: "right",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  noFoodText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  textContainer: {
    fontWeight: "bold",
    fontSize: 16,
  },
  theTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  foodImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
});
