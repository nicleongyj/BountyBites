
import { View, Text, StyleSheet} from "react-native"

export default function TermsCondition() {

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Text> 1. Food items is subjected to availability and responsibility of restaurant to update their stock count. BountyBites is not responsible for stock that is not available once customer has arrived. </Text>
                <Text> 2. Restaurants have the ability to give out food on first come first serve basis.</Text>
            </View>
        </View>

    );

}

const styles = StyleSheet. create({
    container: {
        flex:1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "white",
    },
    subContainer: {
        padding:10,
        flex: 1,
        flexDirection: "column"

    },
})