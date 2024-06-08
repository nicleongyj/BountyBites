import { Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { View } from "react-native";
import { useContext, useState, useEffect} from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';

import { LoginContext } from "../App";


export default function Home(navigation) {

    const [region, setRegion] = useState(null);

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
    }
});
