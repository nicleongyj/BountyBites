import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginContext } from "../App";
import { FIREBASE_DB } from "../FirebaseConfig";
import { useState, useEffect, useContext } from "react";
import {fetchFoodItems} from "../firestoreUtils";

export default function FoodShared({ navigation }) {
  const { userId } = useContext(LoginContext);
  const [foodItems, setFoodItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
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

      const docRef = doc(FIREBASE_DB, "food-today", userId);
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
        fetchFoodItems(userId).then(items => setFoodItems(items));
      }
    }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Food Shared</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {foodItems.map((foodItem, index) => (
          <View key={index} style={styles.foodCard}>
            {editingItem === index ? (
              <View>
                <Text style={styles.foodText}>Food Name: {foodItem.name}</Text>
                <Text style={styles.foodText}>Price: $ {foodItem.price}</Text>
                <View style={{flexDirection:'row', flex:1, alignItems:'center'}}>

                  <Text>Quantity:  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Current Quantity"
                    value={editValues.currentQuantity}
                    onChangeText={(text) =>
                      setEditValues({ ...editValues, currentQuantity: text })
                    }
                  />

                </View>

                <View style={{flexDirection:'row', flex:1, alignItems:'center'}}>

                  <Text>Discount: </Text>

                  <TextInput
                  style={styles.input}
                  placeholder="Discount"
                  value={editValues.discount}
                  onChangeText={(text) =>
                    setEditValues({ ...editValues, discount: text })
                  }
                />

                </View>


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
            ) : !foodItems ? (
              <Text style={styles.foodText}>Loading...</Text>
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
    backgroundColor: "#4fc734",
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
    width: '80%',
  },
});
