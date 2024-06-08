import { Text, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import { Button, TextInput, Portal, Checkbox, Modal, RadioButton, Provider } from "react-native-paper";
import { View } from "react-native";
import { useContext, useState} from "react";

import { LoginContext } from "../App";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function Home({navigation}) {
    const { logout } = useContext(LoginContext);

    // Filter states
    const [search, setSearch] = useState("");
    const [visible, setVisible] = useState(false);
    const [filterValue, setFilterValue] = useState("all");
    const [checkedDistance, setCheckedDistance] = useState(true);
    const [checkedDiscount, setCheckedDiscount] = useState(false);

    const handleFilter = () => {
        setVisible(!visible)
    };

    const handleFilterChange = (value) => {
        setFilterValue(value);
    }

    const handleCardPress = (restaurant) => {
        console.log("Card pressed")
        navigation.navigate("ItemList", {restaurant: restaurant})
    }


    // Sample data
    const restaurants = [
        {
            name: "Dunkin Donuts",
            type: "Restaurant",
            address: "17 Petir Road, Hillion Mall",
            coordinates: { latitude: 1.3786, longitude: 103.7626 },
            foodItems: 4,
            food: {
                "Donut": 2,
                "Coffee": 2,
                "Sandwich": 2,
                "Burger": 2
            },
            image: require('../assets/dunkin.jpeg'),
            discount: 30
        },
        {
            name: "Bread Talk",
            type: "Bakery",
            address: "Bukit Batok",
            foodItems: 15,
            food: {
                "Floss Bread": 2,
                "Cheese Bread": 2,
                "Pork Floss Bun": 2,
            },
            image: require('../assets/breadtalk.jpg'),
            discount: 50
        },

        {
            name: "Petir Chicken Rice",
            type: "Restaurant",
            address: "1 Jelebu Road",
            foodItems: 5,
            food: {
                "Chicken Rice": 2,
                "Chicken Chop": 2,
            },
            image: require('../assets/chickenrice.jpg'),
            discount: 60
        },
        {
            name: "NTUC Fairprice",
            type: "Supermarket",
            address: "Hillion Mall",
            foodItems: 10,
            food: {
                "Rice": 2,
                "Noodles": 2,
            },
            image: require('../assets/ntuc.png'),
            discount: 50
        }
    ];

    // Filter 
    const filteredRestaurants = restaurants.filter(restaurant => {
        if (filterValue === "restaurant") {
            return restaurant.type === "Restaurant";
        } else if (filterValue === "bakery") {
            return restaurant.type === "Bakery";
        } else if (filterValue === "supermarket") {
            return restaurant.type === "Supermarket";
        }
        return true; 
    });
    

    // TODO Sort distance
    const sortedRestaurants = filteredRestaurants.slice().sort((a, b) => {
        if (checkedDistance) {
            // distance calculation
        } else if (checkedDiscount) {
            return Number(b.discount) - Number(a.discount)
        }
        return 0; 
    });

    return (
        <Provider>
            <SafeAreaView style={styles.container}>

            
                <View style={styles.topContainer}>
                    <Text style={styles.title}>Available Food Nearby</Text>

                    <View style={styles.searchContainer}>
                        <TextInput
                            mode="flat"
                            style={styles.textBox}
                            placeholder="Search for food"
                            left={<TextInput.Icon icon={() => <Icon name="search" size={20} color="black" />} />}
                            />
                        <Button
                            mode="contained"
                            style={styles.filterButton}
                            labelStyle={styles.filterButtonLabel}
                            onPress={handleFilter}
                        >Filter</Button>
                        
                    </View>
                </View>

                <View style={styles.cardContainer}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    {sortedRestaurants.map((restaurant, index) => (
                        <Pressable key={index} onPress={() => handleCardPress(restaurant)}>
                            <View key={index} style={styles.card}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.cardTitle}>{restaurant.name}</Text>
                                    <View style={{paddingLeft:10}}>
                                        <View style={{flexDirection:"row"}}>
                                            <Text style={{fontWeight: "bold"}}>Food Type: </Text>
                                            <Text>{restaurant.type}</Text>
                                        </View>
                                        <View style={{flexDirection:"row"}}>
                                            <Text style={{fontWeight: "bold"}}>Address: </Text>
                                            <Text>{restaurant.address}</Text>
                                        </View>
                                        <View style={{flexDirection:"row"}}>
                                            <Text style={{fontWeight: "bold"}}>Food Items Available: </Text>
                                            <Text>{restaurant.foodItems}</Text>
                                        </View>
                                        <View style={{flexDirection:"row"}}>
                                            <Text style={{fontWeight: "bold"}}>Discount Available: </Text>
                                            <Text>{restaurant.discount}%</Text>
                                        </View>
                                    </View>
                                </View>
                                <Image source={restaurant.image} style={styles.image} />
                            </View>
                        </Pressable>
                    ))}
                    </ScrollView>
                </View>

                {/* <Button onPress={handleLogout}>Back to start page</Button> */}

                {/* Modal for filter and sort */}
                <View >
                    <Portal>
                        <Modal visible={visible} onDismiss={handleFilter} contentContainerStyle={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Sort</Text>
                            <View style={styles.checkboxContainer}>
                                <Checkbox.Item
                                    label="Distance (default)"
                                    status={checkedDistance ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setCheckedDistance(true);
                                        setCheckedDiscount(false);
                                    }}
                                />
                                <Checkbox.Item
                                    label="Discount level"
                                    status={checkedDiscount ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setCheckedDistance(false);
                                        setCheckedDiscount(true);
                                    }}
                                />
                            </View>
                            <Text style={styles.modalTitle}>Filter</Text>
                            <RadioButton.Group onValueChange={handleFilterChange} value={filterValue}>
                                <RadioButton.Item label="All" value="all" />  
                                <RadioButton.Item label="Restaurant" value="restaurant" />
                                <RadioButton.Item label="Bakery" value="bakery" />
                                <RadioButton.Item label="Supermarket" value="supermarket" />
                            </RadioButton.Group>
                            <Button mode="contained" onPress={handleFilter} style={styles.button}>
                                Apply Filters
                            </Button>
                        </Modal>
                    </Portal>
                </View>
            
            
            </SafeAreaView>
        </Provider>
    
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "white",
    },
    topContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
      },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
    },
    cardContainer: {
        flex: 6,
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "white",
      },
    title: {
        fontSize: 23,
        padding: 10,
        fontStyle: "normal",
        color: "black",
        fontWeight: "bold",
    },
    cardTitle: {
        fontSize: 20,
        padding: 10,
        fontStyle: "normal",
        color: "black",
        fontWeight: "bold",
    },
    filterButton: {
        height: 42,
        width: 100,
        marginLeft: 10,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    filterButtonLabel: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },
    textBox: {
        backgroundColor: "white",
        height: 42,
        width: 300,
        fontSize: 15,
        borderColor: 'rgba(0, 0, 0, 0.5)', 
        borderWidth: 1,     
        borderRadius: 7,  
        paddingHorizontal: 10,
    }, modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: "black",
    },

    // Card styles
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "95%",
        height: 140,
        backgroundColor: "white",
        marginVertical: 10,
        padding: 12,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: "black",
        borderWidth: 1,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    textContainer: {
        alignContent: "center",
    },

});