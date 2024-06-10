import { Text, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import { Button, TextInput, Portal, Checkbox, Modal, RadioButton, Provider } from "react-native-paper";
import { View } from "react-native";
import { useContext, useState, useEffect, useRef} from "react";


import { LoginContext } from "../App";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {restaurants} from "../sample_data/restaurants"
import { fetchAllRestaurants } from "../firestoreUtils";
import * as Location from 'expo-location';
import waiting from "../assets/waiting.png";

export default function Home({navigation}) {
    const { logout } = useContext(LoginContext);

    // Filter states
    const [search, setSearch] = useState("");
    const [visible, setVisible] = useState(false);
    const [filterValue, setFilterValue] = useState("all");
    const [checkedDistance, setCheckedDistance] = useState(true);
    const [checkedDiscount, setCheckedDiscount] = useState(false);

    const [restaurantData, setRestaurantData] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const dataFetched = useRef(false);

    const [userLongitude, setUserLongitude] = useState(null);
    const [userLatitude, setUserLatitude] = useState(null);
    const locationFetched = useRef(false);

    const handleFilter = () => {
        setVisible(!visible)
    };

    const handleRefresh = () => {
        setRefresh(true);
        dataFetched.current = false;
        locationFetched.current = false;
        setRestaurantData(null);
    }

    const handleFilterChange = (value) => {
        setFilterValue(value);
    }

    const handleCardPress = (restaurant) => {
        console.log("Card pressed")
        navigation.navigate("ItemList", {restaurant: restaurant})
    }

    useEffect(() => {
        (async () => {
            if (locationFetched.current === false) {
                console.log(locationFetched.current, dataFetched.current)
                console.log("Fetching user location...")
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                if (location.coords.latitude !== null) {
                    locationFetched.current = true;
                    setUserLongitude(location.coords.longitude);
                    setUserLatitude(location.coords.latitude);
                    console.log("Location set: ", location.coords.latitude, location.coords.longitude)

                }
            }
        })();
    }, [dataFetched.current]);

    
    useEffect(() => {   
        if (!dataFetched.current) {
            const fetchData = async () => {
                try {
                    const data = await fetchAllRestaurants();
                    console.log("Fetching restaurants...")             
                    setRestaurantData(data);
                    console.log("Restaurant data fetched")
                    console.log(restaurantData)
                    setRefresh(false);
                    dataFetched.current = true;
                } catch (error) {
                    console.error("Error fetching restaurant data:", error);
                }
            };
            fetchData();
        }

    }, [dataFetched.current, refresh, locationFetched.current]);

    const [restaurantWithLocation, setRestaurantWithLocation] = useState(null);
    //problem
    useEffect(() => {
        console.log("User location: ", userLatitude, userLongitude)
        if(userLatitude && userLongitude && restaurantData) {
            const updatedRestaurantData = restaurantData.map(restaurant => {
                const distance = getDistanceFromLatLonInKm(userLatitude, userLongitude, restaurant.latitude, restaurant.longitude);
                return {...restaurant, distance};
            });
            setRestaurantWithLocation(updatedRestaurantData);
        }
    }, [userLatitude, userLongitude, restaurantData]);

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        console.log(lat1, lon1, lat2, lon2)
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // Convert latitude difference to radians
        var dLon = deg2rad(lon2 - lon1);  // Convert longitude difference to radians
        var a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        var d = R * c; // Distance in km
        return d.toFixed(2);
    }
    
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Filter 
    let filteredRestaurants = [];
    if (restaurantWithLocation) {
        filteredRestaurants = restaurantWithLocation.filter(restaurant => {
            if (filterValue === "restaurant") {
                return restaurant.type === "Restaurant";
            } else if (filterValue === "bakery") {
                return restaurant.type === "Bakery";
            } else if (filterValue === "supermarket") {
                return restaurant.type === "Supermarket";
            }
            return true; 
        });
    }

    let sortedRestaurants = [];
    if (filteredRestaurants) {
        sortedRestaurants = filteredRestaurants.slice().sort((a, b) => {
            if (checkedDistance) {
                return a.distance - b.distance; 
            } else if (checkedDiscount) {
                return Number(b.discount) - Number(a.discount);
            }
            return 0; 
        });
    }

    return (
        <Provider>
            {/* <SafeAreaView style={styles.container}> */}
            <View style={styles.container}>

                { !restaurantWithLocation && !refresh ? ( 

                    <View style={styles.loadingText}>
                        <Image style={{width:150, height:150}} source={waiting}></Image>
                        <Text style={styles.loadingTextLabel}>Loading bites, please wait...</Text>
                    </View>



                ) : refresh ? (
                    
                    <View style={styles.loadingText}>
                        {/* <Image style={{width:150, height:150}} source={waiting}></Image> */}
                        <Text style={styles.loadingTextLabel}>Refreshing page, please wait...</Text>
                    </View>             
                
                
                ) : (

                    <>
                    <View style={styles.topContainer}>
                        <Text style={styles.title}>Available Food Nearby</Text>

                        <View style={styles.searchContainer}>
                            <TextInput
                                mode="flat"
                                style={styles.textBox}
                                placeholder="Search"
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                left={<TextInput.Icon icon={() => <Icon name="search" size={20} color="black" />} />}
                                />
                            <Button
                                mode="contained"
                                style={styles.filterButton}
                                labelStyle={styles.filterButtonLabel}
                                onPress={handleRefresh}
                            >Refresh</Button>

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
                                        <Text style={styles.cardTitle}>{restaurant.restaurantName}</Text>
                                        <View style={{paddingLeft:10}}>
                                            <View style={{flexDirection:"row"}}>
                                                <Text style={{fontWeight: "bold"}}>Food Type: </Text>
                                                <Text>{restaurant.type}</Text>
                                            </View>
                                            <View style={{flexDirection:"row"}}>
                                                <Text style={{fontWeight: "bold"}}>Address: </Text>
                                                <Text>{restaurant.location}</Text>
                                            </View>

                                            <View style={{flexDirection:"row"}}>
                                                <Text style={{fontWeight: "bold"}}>Food Items Available: </Text>
                                                <Text>{restaurant.totalQuantity}</Text>
                                            </View>
                   
                                            <View style={{flexDirection:"row"}}>
                                                <Text style={{fontWeight: "bold"}}>Discount Available: </Text>
                                                <Text>{restaurant.discount}%</Text>
                                            </View>

                                            <View style={{flexDirection:"row"}}>
                                                <Text style={{fontWeight: "bold"}}>Distance away: </Text>
                                                { !restaurant.distance ? (
                                                    <Text> - </Text>
                                                ) : (
                                                    <Text>{restaurant.distance} km</Text>
                                                )}

                                            </View>
                                        </View>
                                    </View>
                                    <Image source={{uri: restaurant.link}} style={styles.image} />
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
                </>


                )}
            
            </View>
            {/* </SafeAreaView> */}
        </Provider>
    
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
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
        width: "30%",
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
    loadingText: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        fontWeight:'bold',
    },
    loadingTextLabel: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
    },
    textBox: {
        backgroundColor: "white",
        height: 42,
        width: "40%",
        fontSize: 15,
        borderColor: 'rgba(0, 0, 0, 0.5)', 
        borderWidth: 1,     
        borderRadius: 2,  
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
        alignContent: "center",
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
        borderWidth:1,
        borderColor: "black",
    },
    textContainer: {
        alignContent: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

});