
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
// import { fetchMonthlyFoodQuantity } from '../firestoreUtils';
import { Button } from 'react-native-paper';

export default function Analytics({navigation, route, userId}) {

    return (
        <View style={styles.container}>
            <Text>Analytics</Text>
            {/* <Button mode="contained" onPress={() => fetchMonthlyFoodQuantity(userId)}>Fetch Monthly Food Quantity</Button> */}
        </View>
    )   
}

const styles = StyleSheet.create({
    container : { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

});