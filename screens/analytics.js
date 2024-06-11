
import { View, Text, StyleSheet } from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import { updateAnalytics, retrieveMonthlyAnalytics, retrieveYearlyAnalytics } from '../firestoreUtils';
import { Button, Switch } from 'react-native-paper';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { FlashMode } from 'expo-camera/build/legacy/Camera.types';

export default function Analytics({navigation, route}) {
    const { userId } = route.params;
    const [selected, setSelected] = useState("monthly")
    const [ refresh, setRefresh] = useState(true)

    const [ loadedMonthly, setLoadedMonthly ] = useState(false)
    const [monthly, setMonthly] = useState(null)

    const [ loadedYearly, setLoadedYearly ] = useState(false)
    const [yearly, setYearly] = useState(null)

    const handlePress = (value) => {
        console.log("Selected: ", value);   
        if (value === "monthly") {
            setLoadedMonthly(false);
        } else if (value === "yearly") {
            setLoadedYearly(false);
        }
        setSelected(value);
        setRefresh(true)
    }

    useEffect(() => {
        const fetchData = async () => {
            if (refresh) {
                console.log("Fetching data: " + selected)
                if (selected === "monthly" && !loadedMonthly) {
                    const results = await retrieveMonthlyAnalytics(userId);
                    setMonthly(results);
                    setLoadedMonthly(true);
                } else if (selected === "yearly" && !loadedYearly) {
                    const results = await retrieveYearlyAnalytics(userId);
                    setYearly(results);
                    setLoadedYearly(true);
                }
                console.log("Selected: ", selected);
                console.log("Monthly: ", monthly);
                console.log("Yearly: ", yearly);
                setRefresh(false)
           }
        }
        fetchData();
    }, [refresh]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <View style={styles.container}>

            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={() => handlePress("monthly")} styles={styles.button} buttonLabel={styles.buttonLabel}>Monthly</Button>
                <Button mode="contained" onPress={() => handlePress("yearly")} styles={styles.button} buttonLabel={styles.buttonLabel}>Yearly</Button>
            </View>

            <View style={styles.topContainer}>
            
            {/* { data && (

                <>
                <LineChart
                    data={{
                        labels: Object.keys(data).map(key => monthNames[key - 1]),
                        datasets: [
                            {
                                data: Object.values(data)
                            }
                        ]
                    }}
                    width={400}
                    height={220}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: "#dfe5eb",
                        backgroundGradientFrom: "#dfe5eb",
                        backgroundGradientTo: "#dfe5eb",
                        decimalPlaces: 0,   
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                    }}
                    style={{
                    marginVertical: 8,
                    borderRadius: 16
                    }}
                />
                </>
            )} */}
            
            </View>

            <View style={styles.midContainer}>

            </View>
            <Text style={styles.title}>Analytics</Text>
            <Button mode="contained" onPress={() => updateAnalytics(userId, 20)}>Update Food Quantity</Button>
            <Button mode="contained" onPress={() => console.log(monthly)}>Monthly</Button>
            {/* <Button mode="contained" onPress={handleYearly}>Yearly</Button> */}
        </View>
    )   
}

const styles = StyleSheet.create({
    container : { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },

    topContainer: {
        flex: 7,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "black",
        alignContent: "center",
        marginBottom: 20,
        backgroundColor: "white",

    },
    midContainer: {
        flex: 3,
    },
    button: {
        backgroundColor: "black",
        width: 350,
        height: 42,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 10,
      },
      buttonLabel: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
      },

});