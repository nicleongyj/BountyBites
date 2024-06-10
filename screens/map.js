import { Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { View } from "react-native";
import { useContext, useState, useEffect} from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from 'expo-location';

import { LoginContext } from "../App";
import UserMarker from "../assets/user.png";
import { fetchAllRestaurants } from "../firestoreUtils";

export default function Home(navigation) {

    const [region, setRegion] = useState(null);
    const [restaurantData, setRestaurantData] = useState(null);

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
                {restaurantData && restaurantData.map((restaurant, index) => (
                <Marker
                    key={index}
                    coordinate={{
                        latitude: parseFloat(restaurant.latitude),
                        longitude: parseFloat(restaurant.longitude),
                    }}
                    title={restaurant.restaurantName}
                    description={restaurant.location}>

                    <Callout>
                        <View>
                            <Text>{restaurant.restaurantName}</Text>
                            <Text>{restaurant.location}</Text>
                            <Text>Number of items: {restaurant.items ? restaurant.items.length : 0}</Text>   
                            <Button mode="contained" style={styles.button}>View</Button>                     
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
        // justifyContent: "center",
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
        width:40,
        height:25,
    }
});
