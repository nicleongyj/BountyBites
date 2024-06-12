
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import { updateAnalytics, retrieveMonthlyAnalytics, retrieveYearlyAnalytics } from '../firestoreUtils';
import { Button, Switch, TextInput } from 'react-native-paper';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { FetchCompletions, getRestaurantTipsMonthly, getRestauranTipsYearly, promptGPT } from "../openaiConfig"
import { aiImage } from '../assets/ai.jpg';
import {logo} from '../assets/logo.png';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Analytics({navigation, route}) {
    const { userId, restaurantData } = route.params;
    const [selected, setSelected] = useState("monthly")
    const [ refresh, setRefresh] = useState(true)
    const [ loadedMonthly, setLoadedMonthly ] = useState(false)
    const [monthly, setMonthly] = useState(null)
    const [ loadedYearly, setLoadedYearly ] = useState(false)
    const [yearly, setYearly] = useState(null)
    const [monthlyAnalysis, setMonthlyAnalysis] = useState(null)
    const [monthlyTips, setMonthlyTips] = useState(null)
    const [yearlyAnalysis, setYearlyAnalysis] = useState(null)
    const [yearlyTips, setYearlyTips] = useState(null)
    const [fetchedMonthlyTips, setFetchedMonthlyTips] = useState(false)
    const [fetchedYearlyTips, setFetchedYearlyTips] = useState(false)
    const [prompt, setPrompt] = useState(null)
    const [response, setResponse] = useState(null)

    useEffect(() => {
        const fetchTips = async () => {
            if (selected === "monthly") {
                if (!filteredMonthly && fetchedMonthlyTips) {
                    return;
                }
                console.log("Fetching monthly tips")
                const data = {
                    dailyData: monthly,
                    restaurantType: restaurantData.type,
                    averageFoodSavedPerDay: averageFoodSavedPerDay,
                    percentageChangeFromPreviousMonth: change,
                    totalFoodSavedPerMonth: totalFoodSavedMonth,
                    daysWithNoFoodSaved: daysWithNoFoodSaved,
                };
                // const response = await getRestaurantTipsMonthly(data);
                const [analysis, tips] = response.split('\n');
                const cleanedAnalysis = analysis.replace('Analysis: ', '');
                const cleanedTips = tips.replace('Tips: ', '');
                console.log(cleanedAnalysis)
                console.log(cleanedTips)
                setMonthlyAnalysis(cleanedAnalysis)
                setMonthlyTips(cleanedTips)
                setFetchedMonthlyTips(true)
            } else if (selected === "yearly") {
                if (!filteredYearly && fetchedYearlyTips) {
                    return;
                }
                console.log("Fetching yearly tips")
                const data = {
                    monthlyData: yearly,
                    restaurantType: restaurantData.type,
                    averageFoodSavedPerMonth: averageFoodSavedPerMonth,
                    // percentageChangeFromPreviousMonth: change,
                    totalFoodSavedYear: totalFoodSavedYear,
                    monthWithNoFoodSaved: monthWithNoFoodSaved,
                };
                console.log(data)
                // const response = await getRestaurantTipsYearly(data);
                const [analysis, tips] = response.split('\n');
                const cleanedAnalysis = analysis.replace('Analysis: ', '');
                const cleanedTips = tips.replace('Tips: ', '');
                console.log(cleanedAnalysis)
                console.log(cleanedTips)
                setYearlyAnalysis(cleanedAnalysis)
                setYearlyTips(cleanedTips)
                setFetchedYearlyTips(true)
            }
        }

        fetchTips()
    }, [monthly, yearly])

    const handleSend = async () => {
        if (!prompt || prompt==="") {
            return;
        }
        console.log("sending prompt: " + prompt)
        const data = {
            dailyData: monthly,
            restaurantType: restaurantData.type,
            averageFoodSavedPerDay: averageFoodSavedPerDay,
            percentageChangeFromPreviousMonth: change,
            totalFoodSavedPerMonth: totalFoodSavedMonth,
            daysWithNoFoodSaved: daysWithNoFoodSaved,
            userPrompt: prompt
        };
        setPrompt("");
        const response = await promptGPT(data);
        console.log(response)
        setResponse(response)
        
    }

    const handlePress = (value) => {
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
            try {
                if (!monthly) {
                    console.log("No monthly data");
                    return;
                }
        
                console.log("calculating monthly data: " + monthly)
                const totalFoodSaved = monthly["counter"];
                const prevMonth = monthly["prevCounter"];

                if (prevMonth) {
                    const change = ((totalFoodSaved - prevMonth) / prevMonth * 100).toFixed(1);
                    setChange(change);
                }

                const results = Object.keys(monthly).filter(day => day !== "counter" && day !== "prevCounter");
                const filteredMonthly = Object.keys(monthly)
                    .filter(key => key !== "counter" && key !== "prevCounter")
                    .reduce((obj, key) => {
                        obj[key] = monthly[key];
                        return obj;
                    }, {});
                setFilteredMonthly(filteredMonthly);
                const averageFoodSavedPerDay = (totalFoodSaved / (Object.keys(results).length)).toFixed(1);
                const daysWithNoFoodSaved = Object.keys(filteredMonthly).filter(day => filteredMonthly[day] === 0).length;                setTotalFoodSavedMonth(totalFoodSaved);
                setAverageFoodSavedPerDay(averageFoodSavedPerDay);
                setDaysWithNoFoodSaved(daysWithNoFoodSaved);
            } catch (error) {
                console.error("Error calculating monthly data: ", error);
            }
        }
        calculateMonthly();
    }, [monthly]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const [changeYearly, setChangeYearly] = useState(null);
    const [totalFoodSavedYear, setTotalFoodSavedYear] = useState(0);
    const [averageFoodSavedPerMonth, setAverageFoodSavedPerMonth] = useState(0);
    const [monthWithNoFoodSaved, setMonthWithNoFoodSaved] = useState(null);
    const [filteredYearly, setFilteredYearly] = useState(null);
    useEffect(() => {
        const calculateYearly = async () => {
            try {
                if (!yearly) {
                    console.log("No yearly data");
                    return;
                }
        
                console.log("calculating yearly data: " + yearly)
                const totalFoodSavedYear = yearly["counter"];
    
                
                const resultsYearly = Object.keys(yearly).filter(month => month !== "counter");
                const filteredYearly = Object.keys(yearly)
                    .filter(key => key !== "counter")
                    .reduce((obj, key) => {
                        obj[key] = yearly[key];
                        return obj;
                    }, {});
                setFilteredYearly(filteredYearly);
                const averageFoodSavedPerMonth = (totalFoodSavedYear / (Object.keys(resultsYearly).length)).toFixed(1);
                const monthWithNoFoodSaved = Object.keys(yearly).filter(month => yearly[month] === 0);
                setTotalFoodSavedYear(totalFoodSavedYear);
                setAverageFoodSavedPerMonth(averageFoodSavedPerMonth);
                setMonthWithNoFoodSaved(monthWithNoFoodSaved.length);
            } catch (error) {
                console.error("Error calculating yearly data: ", error);
            }
        }
        calculateYearly();
    }, [yearly]);

    return (
        <ScrollView style={styles.container}>
            <KeyboardAwareScrollView style={{flex:1}} behavior='padding'>

            <View style={styles.topContainer}>

                

                { filteredMonthly && selected==="monthly"? (

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




                ) : filteredYearly && selected==="yearly" ? (
                    <View style={{flex:1}}>
                          <Text style={styles.title}>
                                Yearly report - 2024
                            </Text>
                            {/* <Text style={styles.title}>
                                Yearly report - {monthNames[new Date().getYear()]}
                            </Text> */}
                        <LineChart
                            data={{
                                labels: Object.keys(filteredYearly),
                                datasets: [
                                    {
                                        data: Object.values(filteredYearly)
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
        
            <View style={styles.analyticsContainer}>

            <View style={styles.midContainer}>
                <>
                
                { filteredMonthly && selected==="monthly"? (
                <View style={styles.dataContainer}>
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
                            <Text style={{fontSize: 14, fontWeight:'bold',marginBottom: 10}}>You have saved {change}% more food this month compared to last month!</Text>
                        </>
                       ) : (
                            <Text style={{fontSize: 15, fontWeight:'bold',marginBottom: 10}}>You have saved {change}% less food this month compared to last month</Text>
                       )
                    }
                    <>
                       <Text style={styles.subtitle}>Total food saved this month: {totalFoodSavedMonth}</Text>
                        <Text style={styles.subtitle}>Average food saved per day: {averageFoodSavedPerDay}</Text>
                        <Text style={styles.subtitle}>Days with no food saved: {daysWithNoFoodSaved}</Text>
                    </>

                    <View>


                    </View>
                </View>

                ) : filteredYearly && selected==="yearly" ? (
                <View style={styles.dataContainer}>
                    { averageFoodSavedPerMonth < averageThreshold ? (
                    // Needs improvement
                    <>
                        <Text style={styles.title}>You can do better...</Text>
                    </> 
                
                    ) : averageFoodSavedPerMonth < goodThreshold ? (
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
                    {/* { change > 0 ? (
                        <>
                            <Text style={{fontSize: 14, fontWeight:'bold',marginBottom: 10}}>You have saved {changeYearly}% more food this month compared to last year!</Text>
                        </>
                       ) : (
                            <Text style={{fontSize: 15, fontWeight:'bold',marginBottom: 10}}>You have saved {changeYearly}% less food this month compared to last year</Text>
                       )
                    } */}
                    <>
                       <Text style={styles.subtitle}>Total food saved this year: {totalFoodSavedYear}</Text>
                        <Text style={styles.subtitle}>Average food saved per month: {averageFoodSavedPerMonth}</Text>
                        <Text style={styles.subtitle}>Days with no food saved: {monthWithNoFoodSaved.length}</Text>
                    </>

                </View>



                ) : (
                    <></>
                    // <Text>Loading data</Text>
                )

                }
                </>
                
                { filteredMonthly && selected==="monthly" ? (

                    <View style={styles.bottomContainer}>
                        <View style={styles.tipContainer}>
                            <Text style={{fontSize: 23,marginBottom: 10, fontWeight:'bold'}}>Personalised analysis:</Text>
                                <View style={{flex:1, flexDirection:'row', width:'85%'}}>
                                    <Text style={{fontSize: 15,fontWeight: 'bold', marginBottom: 10}}>Analysis:</Text>
                                    <Text style={styles.subtitle}>{monthlyAnalysis}</Text>    
                                </View>
                                <View style={{flex:1, flexDirection:'row', width:'85%'}}>
                                    <Text style={{fontSize: 15,fontWeight: 'bold', marginBottom: 10}}>Tips:        </Text>
                                    <Text style={styles.subtitle}>{monthlyTips}</Text>
                                </View>
                        </View>
                    </View>

                ) : filteredYearly && selected==="yearly" ? (
                    <View style={styles.bottomContainer}>
                        <View style={styles.tipContainer}>
                            <Text style={{fontSize: 23,marginBottom: 10, fontWeight:'bold'}}>Personalised analysis:</Text>
                                <View style={{flex:1, flexDirection:'row', width:'85%'}}>
                                    <Text style={{fontSize: 15,fontWeight: 'bold', marginBottom: 10}}>Analysis:</Text>
                                    <Text style={styles.subtitle}>{yearlyAnalysis}</Text>    
                                </View>
                                <View style={{flex:1, flexDirection:'row', width:'85%'}}>
                                    <Text style={{fontSize: 15,fontWeight: 'bold', marginBottom: 10}}>Tips:        </Text>
                                    <Text style={styles.subtitle}>{yearlyTips}</Text>
                                </View>
                        </View>
                    </View>

                ): (
                    <Text style={styles.title}>AI is currently analysing your data...</Text>
                )}
                <View style={styles.chatbotContainer}>
                        
                        <View style={styles.chatbotHeader}>
                            <Text style={{fontSize: 20,fontWeight: 'bold',paddingTop:5, color:'white', paddingBottom:10,}}>Welcome to BitesAI</Text>
                            <Text style={{fontSize: 15,fontWeight: 'bold',marginBottom: 10, color:'white', lineHeight:20}}>I can answer climate change related questions or anything about food waste!</Text>
                        </View>
                        <View style={styles.responseContainer}>
                            
                            <View style={{flexDirection:'column'}}>


                                { response &&
                                <>
                                <Text style={{fontWeight:'bold', fontSize:16, color:'white'}}>BitesAI: </Text>
                                <Text style={{fontSize:15, color:'white', lineHeight:25, marginVertical:10,}}>{response}</Text>
                                </>
                                }   
                            </View>
                        </View>

                        <View style={styles.promptContainer}>
                            <TextInput 
                            style={styles.input}
                            placeholder='Ask me a question'
                            value={prompt}
                            onChangeText={setPrompt}
                            ></TextInput>
                            <Button style={styles.sendButton} onPress={handleSend} labelStyle={{color:'black', alignSelf:'center'}}>Send</Button>
                        </View>


                     </View>
                

                    </View>
                </View>

            </KeyboardAwareScrollView>

        </ScrollView>
    )   
}

const styles = StyleSheet.create({
    container : { 
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor:'white'
    },
    buttonContainer: {
        // flex:1,
        flexDirection: 'row',
        justifyContent: "space-evenly",
        paddingTop:0,
        width: '100%',
        paddingHorizontal: 10,
        // marginBottom: 20,
        paddingBottom: 10,
        // backgroundColor: "black",
        // borderBottomColor: "black",
        // borderBottomWidth: 1,
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 10,
        // textAlign: "center"
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
    dataContainer: { 
        flex:2,
        width: "100%",
        borderBottomColor: "black",
        borderBottomWidth: 1,
    },
    midContainer: {
        flex: 1,
        // paddingVertical: 20,
        flexGrow: 1,
        width: "100%",
        padding:10,
        // backgroundColor: "black",
 
    },
    chatbotContainer: {
        flexGrow:1,
        width: "95%",
        paddingTop:10,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: '#494959',
        borderColor:'black',
        borderWidth:2,
        borderRadius:20,
    },  
    analyticsContainer: {
        flex:6,
        width:'100%'
    },  
    tipContainer: {
        flex:1,
        borderColor: "black",
        // borderWidth: 1,
        // borderRadius: 10,
        width: "100%",
    },
    responseContainer: {
        alignItems: 'center',
        width:"90%",
    },
    chatbotHeader: {
        alignItems: 'center',
        width:"90%",
        // backgroundColor:'grey',
        borderRadius:30,
    },
    bottomContainer: {
        flexGrow: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
    
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
        marginleft:5,
        
    },
    buttonUnselected: {
        backgroundColor: "grey",
        color: "black",
        marginleft:5,
        
    },
    buttonLabel: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
      },

    promptContainer: {
        flex:1,
        justifyContent:'flex-end',
        alignItems:'center',
        paddingBottom: 20,
        flexDirection:'row',
        alignContent:'center',
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        marginTop: 10,
        width: 300,
        height:20,
        backgroundColor: "white",
        marginRight:10,
    },
    sendButton: {
        alignSelf:'center',
        backgroundColor:'white',
        marginTop:10,
    }


});