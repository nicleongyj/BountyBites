
import { View, Text, StyleSheet} from "react-native"

export default function termsCondition() {

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Text> 1. Food items is subjected to availability and responsibility of restaurant to update </Text>
                <Text>their stock count. BountyBites is not responsible for stock that is not available once customer </Text>
                <Text>has arrived. </Text>
            </View>

            <View style={styles.subContainer}>
                <Text>2. Restaurants have the ability to give out food on first come first serve basis.</Text>
            </View>

        </View>

    );

}

const styles = StyleSheet. create({
    container: {
        flex:1,
        flexDirection: "column",

    },
    subContainer: {
        padding:10,
        flex: 1,
        flexDirection: "column"

    },
})