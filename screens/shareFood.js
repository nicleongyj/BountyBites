import { Text, View, StyleSheet, TextInput } from 'react-native';  
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Button } from 'react-native-paper';

export default function ShareFood({navigation}) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [quantity, setQuantity] = useState("");
    const [endTime, setEndTime] = useState("");

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

      const handleShare = async () => {
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
    
        if (!isValidTime(endTime)) {
          Alert.alert("Error", "Please enter a valid end time (HH:MM).");
          return;
        }
    
        const food = {
          name: name,
          description: description,
          price: parsedPrice,
          discount: parsedDiscount,
          quantity: parsedQuantity,
        };
    
        const foodData = {
          food: food,
          endTime: endTime,
        };
    
        try {
          await storeFoodData(userId, foodData);
          closeModal(); // Close the modal after sharing
        } catch (error) {
          Alert.alert("Error", "Failed to share food item.");
        }
      };    

    return (
        <View style={styles.outerContainer}>

            <View style={styles.topContainer}>
                <Text style={styles.title}>  
                    Add a food item
                </Text>
            </View>

            <View style={styles.midContainer}>
                    {renderInput("Name:", name, setName, "next")}
                    {renderInput("Description:", description, setDescription, "next")}
                    {renderInput("Price ($):", price, setPrice, "next")}
                    {renderInput("Discount (%):", discount, setDiscount, "next")}
                    {renderInput("Quantity:", quantity, setQuantity, "next")}
                    {renderInput("End Time (HH:MM):", endTime, setEndTime, "done")}
            </View>

            <View style={styles.bottomContainer}>
                <Button mode="contained" style={styles.submitButton}>
                    Share
                </Button>
            </View>

        </View>
        
    );

}


const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    topContainer: {
        flex:1,
        backgroundColor: "white",
        alignItems: "center",
        padding:10,
        flexDirection: "column",
    },
    midContainer: {
        flex: 8,
        backgroundColor: "white",
        flexDirection: "column",
        alignItems: "center",
        padding: 10,
    },  
    bottomContainer: {
        flex: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        flex:1,
        width: "90%",
    },  
    inputLabel: {
        fontSize: 15,
        fontWeight: "bold",
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
    },
    text: {
        fontSize: 20,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        paddingHorizontal: 10,
      },

    submitButton: {
        width: 150,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        marginTop: 20,
        backgroundColor: "black",
    },


});