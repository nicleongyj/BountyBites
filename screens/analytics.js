
import { View, Text, StyleSheet } from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import { updateAnalytics, retrieveMonthlyAnalytics, retrieveYearlyAnalytics } from '../firestoreUtils';
import { Button, Switch } from 'react-native-paper';
import { BarChart, LineChart } from 'react-native-chart-kit';

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
                setRefresh(false)
           }
        }
        fetchData();
    }, [refresh]);

    const [change, setChange] = useState(null);
    const [totalFoodSavedMonth, setTotalFoodSavedMonth] = useState(0);
    const [averageFoodSavedPerDay, setAverageFoodSavedPerDay] = useState(0);
    const [daysWithNoFoodSaved, setDaysWithNoFoodSaved] = useState(null);
    const [filteredMonthly, setFilteredMonthly] = useState(null);
    const averageThreshold = 10;
    const goodThreshold = 20;

    useEffect(() => {
        const calculateMonthly = async () => {
            console.log("calculating monthly data: " + monthly)
            const totalFoodSaved = monthly["counter"];
            const prevMonth = monthly["prevCounter"];

            if (prevMonth) {
                const change = ((totalFoodSaved - prevMonth) / prevMonth * 100).toFixed(1);
                setChange(change);
            }

            const results = Object.keys(monthly).filter(day => day !== "counter" && day !== "prevCounter");
            console.log("Results: ", results);
            const filteredMonthly = Object.keys(monthly)
                .filter(key => key !== "counter" && key !== "prevCounter")
                .reduce((obj, key) => {
                    obj[key] = monthly[key];
                    return obj;
                }, {});
            setFilteredMonthly(filteredMonthly);
            const averageFoodSavedPerDay = (totalFoodSaved / (Object.keys(results).length)).toFixed(1);
            const daysWithNoFoodSaved = Object.keys(monthly).filter(day => monthly[day] === 0);
            setTotalFoodSavedMonth(totalFoodSaved);
            setAverageFoodSavedPerDay(averageFoodSavedPerDay);
            setDaysWithNoFoodSaved(daysWithNoFoodSaved);
            console.log("Total food saved: ", totalFoodSaved);
            console.log("Average food saved per day: ", averageFoodSavedPerDay);
            console.log("Days with no food saved: ", daysWithNoFoodSaved);
        }
        calculateMonthly();
    }, [monthly]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <View style={styles.container}>



            <View style={styles.topContainer}>

                

                { monthly && selected==="monthly"? (

                    <View>
                          <Text style={styles.title}>
                                Monthly report - June
                            </Text>
                            {/* <Text style={styles.title}>
                                Monthly report - {monthNames[new Date().getMonth()]}
                            </Text> */}
                        <LineChart
                            data={{
                                labels: Object.keys(filteredMonthly),
                                datasets: [
                                    {
                                        data: Object.values(filteredMonthly)
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
                    
                    </View>




                ) : yearly && selected==="yearly" ? (
                    <View style={{flex:1}}>
                          <Text style={styles.title}>
                                Yearly report - 2024
                            </Text>
                            {/* <Text style={styles.title}>
                                Yearly report - {monthNames[new Date().getYear()]}
                            </Text> */}
                        <LineChart
                            data={{
                                labels: Object.keys(yearly).filter(key => key !== "counter").map(key => monthNames[key - 1]),
                                datasets: [
                                    {
                                        data: Object.values(monthly)
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
                    </View>

                ) : (
                    <Text>Loading data</Text>
                )
                }
            
            </View>

            <View style={styles.buttonContainer}>
                <Button 
                    mode="contained" 
                    onPress={() => handlePress("monthly")} 
                    style={selected === "monthly" ? styles.buttonSelected : styles.buttonUnselected}
                >
                    Monthly
                </Button>
                <Button 
                    mode="contained" 
                    onPress={() => handlePress("yearly")} 
                    style={selected === "yearly" ? styles.buttonSelected : styles.buttonUnselected}
                >
                    Yearly
                </Button>
            </View>

            <View style={styles.midContainer}>
                
                { monthly && selected==="monthly"? (
                   <View>
                    { averageFoodSavedPerDay < averageThreshold ? (
                    // Needs improvement
                    <>
                        <Text style={styles.title}>You can do better...</Text>
                    </> 
                
                    ) : averageFoodSavedPerDay < goodThreshold ? (
                    // Average

                        <>
                           <Text style={styles.title}>Keep it up! 👍</Text>
                        </>

                    ) : (
                    // Good
                    <>
                    <Text style={styles.title}>Earth Saver! 🌍</Text>
                    </>

                    )}
                    { change > 0 ? (
                        <>
                            <Text style={{fontSize: 14, fontWeight:'bold',marginBottom: 10}}>You have saved {change}% more food this month compared to last month</Text>
                        </>
                       ) : (
                            <Text style={{fontSize: 15, fontWeight:'bold',marginBottom: 10}}>You have saved {change}% less food this month compared to last month</Text>
                       )
                    }
                    <>
                       <Text style={styles.subtitle}>Total food saved this month: {totalFoodSavedMonth}</Text>
                        <Text style={styles.subtitle}>Average food saved per day: {averageFoodSavedPerDay}</Text>
                        <Text style={styles.subtitle}>Days with no food saved: {daysWithNoFoodSaved.length}</Text>
                    </>

                    <View>


                    </View>
                </View>

                ) : yearly && selected==="yearly" ? (
                    <></>



                ) : (
                    <></>
                    // <Text>Loading data</Text>
                )

                }





            </View>
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
        // flex:1,
        flexDirection: 'row',
        justifyContent: "center",
        paddingTop:20,
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 20,
        paddingBottom: 20,
        // backgroundColor: "black",
        borderBottomColor: "black",
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 15,
        // fontWeight: 'bold',
        marginBottom: 10
    },

    topContainer: {
        flex: 4,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "black",
        alignContent: "center",
        backgroundColor: "white",
        paddingTop: 20,

    },
    midContainer: {
        flex: 5,
        // paddingVertical: 20,
        width: "100%",
        padding:10,
        alignItems: "center",

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
    buttonSelected: {
        backgroundColor: "black",
        color: "white",
        
        
    },
    buttonUnselected: {
        backgroundColor: "grey",
        color: "black",
        
    },
      buttonLabel: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
      },

});