import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, ScrollView, Linking, Platform } from 'react-native';
import { Button } from 'react-native-paper';

import Royce from '../assets/royce.jpg';

export default function ItemList({navigation, route}) {

    const { restaurant } = route.params;
    const name = restaurant.name;
    const numberOfItems = restaurant.foodItems
    const food = restaurant.food;
    const address = restaurant.address;

    const handleLocationPress = () => {
        const url = Platform.select({
            ios: `maps:0,0?q=${address}`,
            android: `geo:0,0?q=${address}`
        });
        Linking.openURL(url);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.foodText}>{numberOfItems}</Text>
                <Text style={styles.foodText}> Food Items Available:</Text>
            </View>

            <View style={styles.cardContainer}>
                <ScrollView contentContainerStyle={styles.scrollViewContent} scrollEnabled={true}>

                {Object.entries(food).map(([foodItem, price], index) => {
                    return (
                        <View key={index} style={styles.card}>
                            <Image source={Royce} style={{width: 100, height: 100}}/>
                            <View style={styles.textContainer}>
                                <Text>{foodItem}</Text>
                                <Text>{price}</Text>
                            </View>
                        </View>
                    );
                })}
                </ScrollView>

            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.address}>{address}</Text>
                <Button mode="contained" onPress={handleLocationPress} labelStyle = {styles.buttonLabel} style={styles.button}>Take me there!</Button>
            </View>

        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignContent: "center",
        backgroundColor: "white",
    },
    foodText: {
        fontSize: 15,
        fontWeight: "bold",
    },
    topContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "black",
    },
    cardContainer: {
        flex: 14,
        flexDirection: "column",
    },
    bottomContainer: {
        flex: 2,
        alignItems: "center",
        borderTopColor: "black",
        borderTopWidth: 1,
    },
    card: {
        flexDirection: "row",
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
    scrollViewContent: {
        width: "100%",
        padding: 10,
    },
    textContainer: {
        alignContent: "center",
    },
    address: {
        fontSize: 15,
        fontWeight: "bold",
        padding: 10,
    },
    button: {
        backgroundColor: "black",
        width: 350,
        height: 42,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
    },
    buttonLabel: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },
});