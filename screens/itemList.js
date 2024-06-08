import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, ScrollView, Linking, Platform } from 'react-native';
import { Button } from 'react-native-paper';

import Royce from '../assets/royce.jpg';

export default function ItemList({navigation, route}) {

    const { restaurant } = route.params;
    const name = restaurant.name;
    const numberOfItems = restaurant.food.length;
    const food = restaurant.food;
    const address = restaurant.address;
    
    

    const handleLocationPress = () => {
        const url = Platform.select({
            ios: `maps:0,0?q=${address}`,
            android: `geo:0,0?q=${address}`
        });
        Linking.openURL(url);
    }

    const calculateNewPrice = (price, discount) => {
        return price - (price * discount / 100);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.foodText}>{numberOfItems}</Text>
                <Text style={styles.foodText}> Food Items Available:</Text>
            </View>

            <View style={styles.cardContainer}>
                <ScrollView contentContainerStyle={styles.scrollViewContent} scrollEnabled={true}>

                {food.map(({name, price, stock, discount}, index) => {
                    const newPrice = calculateNewPrice(price, discount);
                    return (
                        <View key={index} style={styles.card}>
                            <Image source={Royce} style={styles.image}/>
                            <View style={styles.textContainer}>
                                
                                <View style={{flexDirection: "row"}}>
                                    
                                    <Text style={styles.discountLabel}>{discount}</Text>
                                    <Text style={styles.discountLabel}>% off! </Text>
                                </View>
                                
                                
                                <Text style={styles.foodTitle}>{name}</Text>

                                <View style={{flexDirection: "row"}}>
                                    <Text style={styles.foodSubtitle}>Stock available: </Text>
                                    <Text style={styles.foodSubtitle}>{stock}</Text>
                                </View>          
                            </View>

                            <View style={styles.priceContainer}>
                                <Text style={styles.oldPrice}>{price.toFixed(2)}</Text>
                                <Text style={styles.newPrice}>{newPrice.toFixed(2)}</Text>
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
        // alignItems: "center",
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
        // alignContent: "center",
        justifyContent: "flex-start",
        paddingLeft: 10,
        paddingTop: 10,
    },
    priceContainer: {
        flex:1,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: "5%",
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
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        alignSelf: "center",
    },
    foodTitle: {
        fontSize: 15,
        fontWeight: "bold",
    },
    foodSubtitle: {
        fontSize: 14,
    },
    discountLabel: {
        fontSize: 15,
        color: "red",
        fontWeight: "bold",
    },
    oldPrice: {
        fontSize: 15,
        fontWeight: "bold",
        textDecorationLine: "line-through",
        color: 'rgba(0, 0, 0, 0.5)'
    },
    newPrice: {
        fontSize: 15,
        fontWeight: "bold",
        color: "red",
    }
});