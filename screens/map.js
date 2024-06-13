import { Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { View } from "react-native";
import { useState, useEffect} from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from 'expo-location';

import UserMarker from "../assets/user.png";
import { fetchAllRestaurants } from "../firestoreUtils";

export default function Home({navigation}) {

    const [region, setRegion] = useState(null);
    const [restaurantData, setRestaurantData] = useState(null);

    // Request location permission and set region to user's location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            });
        })();
    }, []);

    // Fetch restaurant data
    useEffect(() => {   
        const fetchData = async () => {
            try {
                const data = await fetchAllRestaurants();
                setRestaurantData(data);
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
            }
        };

        fetchData();
    });

    const navigateRestaurant = (restaurant) => {
        navigation.navigate("ItemList", {restaurant: restaurant})
    }

    if (!region) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loading}>Loading location...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
            >
                {/* Marker for user location */}
                <Marker
                coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                }}
                title={"Your Location"}
                image={UserMarker}
                style={{width: 20, height: 20}}
                />  

                {/* Markers for restaurants */}
                {restaurantData && restaurantData
                    .filter(restaurant => restaurant.items && restaurant.items.length>0)
                    .map((restaurant, index) => (
                <Marker
                    key={index}
                    coordinate={{
                        latitude: parseFloat(restaurant.latitude),
                        longitude: parseFloat(restaurant.longitude),
                    }}
                    title={restaurant.restaurantName}
                    description={restaurant.location}>

                    <Callout style={styles.calloutView}>
                        <View style={styles.cardView}>
                            <Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>
                            <Text>{restaurant.location}</Text>
                            <Text>Number of items: {restaurant.items ? restaurant.items.length : 0}</Text>   
                            <Button mode="contained" onPress={()=>navigateRestaurant(restaurant)} style={styles.button} labelStyle={styles.buttonLabel}>View</Button>                     
                        </View>

                    </Callout>
                    
                </Marker>
                ))}

                </MapView>        
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "azure",
        backgroundColor: "white",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loading: {
        fontSize: 20,
        fontWeight: "bold",
    },
    button: {
        width:120,
        height:35,
        backgroundColor: "black",
    },
    buttonLabel : {
        color: "white",
        alignSelf: "center",
    },
    restaurantName: {
        fontSize: 14,
        fontWeight: "bold",
        alignSelf: "center",
    },
    calloutView: {
        width: 160,
        height: 100,
        borderRadius: 30,
    },
    cardView: {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
    },

});
