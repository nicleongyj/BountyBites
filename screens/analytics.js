
import { View, Text, StyleSheet } from 'react-native';
import React, {useState} from 'react';
import { updateAnalytics, retrieveMonthlyAnalytics, retrieveYearlyAnalytics } from '../firestoreUtils';
import { Button } from 'react-native-paper';
import { BarChart, LineChart } from 'react-native-chart-kit';

export default function Analytics({navigation, route}) {
    const { userId } = route.params;
    const [data, setData] = useState(null)

    const handleYearly = async () => {
        const results = await retrieveYearlyAnalytics(userId)
        console.log(results)
        setData(results)
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <View style={styles.container}>

            <View style={styles.topContainer}>
            
            { data && (
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
            )}
            
            </View>

            <View style={styles.midContainer}>

            </View>
            <Text style={styles.title}>Analytics</Text>
            <Button mode="contained" onPress={() => updateAnalytics(userId, 20)}>Update Food Quantity</Button>
            <Button mode="contained" onPress={() => retrieveMonthlyAnalytics(userId)}>Monthly</Button>
            <Button mode="contained" onPress={handleYearly}>Yearly</Button>
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

});