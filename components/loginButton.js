import { Pressable, View, Text, StyleSheet } from "react-native";
export default function LoginButton({onPress, text}) {
    return (

        <View style={[styles.gridItem]}>
            <Pressable
            android_ripple={{ color: "grey" }}
            style={({ pressed }) =>
                pressed
                ? [styles.pressed, styles.buttonInnerContainer]
                : styles.buttonInnerContainer
            }
            onPress={onPress}
            >
            <View style={styles.innerContainer}>
                <Text style={styles.text}>{text}</Text>
            </View>
            </Pressable>
      </View>
    )

}


const styles = StyleSheet.create({
    gridItem: {
        flex: 0,
        margin: 16,
        height: 30,
        width: 100,
        elevation: 4,
        shadowColor: "black",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        justifyContent: "flex-end",
      },
      pressed: {
        opacity: 0.75,
      },
      text:{
        color: "white",
      },
      buttonInnerContainer: {
        backgroundColor: "black",
        flex: 1,
        justifyContent: "center",
        borderRadius: 15,
      },
      button: {
        flex: 1,
      },
      innerContainer: {
        flex: 0,
        justifyContent: "center",
        alignItems: "center",
        color: "black",
      },
})