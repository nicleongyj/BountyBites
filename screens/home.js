import { Text, StyleSheet, Image } from "react-native";
import { Button, TextInput, Portal, Checkbox, Modal, RadioButton, Provider } from "react-native-paper";
import { View } from "react-native";
import { useContext, useState} from "react";

import { LoginContext } from "../App";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialIcons';



export default function Home(navigation) {
    const { logout } = useContext(LoginContext);

    // Filter states
    const [search, setSearch] = useState("");
    const [visible, setVisible] = useState(false);
    const [filterValue, setFilterValue] = useState("restaurant");
    const [checkedDistance, setCheckedDistance] = useState(true);
    const [checkedDiscount, setCheckedDiscount] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);


    const handleFilter = () => {
        if (visible) {
            hideModal();
        } else {
            showModal();
        }
    };

    const handleFilterChange = (value) => {
        setFilterValue(value);
    }

    return (
        <Provider>
            <SafeAreaView style={styles.container}>

            
                <View style={styles.topContainer}>
                    <Text style={styles.title}>Available Food Nearby</Text>

                    <View style={styles.searchContainer}>
                        <TextInput
                            mode="flat"
                            style={styles.textBox}
                            placeholder="Search for food"
                            left={<TextInput.Icon icon={() => <Icon name="search" size={20} color="black" />} />}
                            />
                        <Button
                            mode="contained"
                            style={styles.filterButton}
                            labelStyle={styles.filterButtonLabel}
                            onPress={handleFilter}
                        >Filter</Button>
                        
                    </View>
                </View>

                <View style={styles.cardContainer}>

                </View>




                {/* <Button onPress={handleLogout}>Back to start page</Button> */}

                {/* Modal for filter and sort */}
                <View >
                    <Portal>
                        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Sort</Text>
                            <View style={styles.checkboxContainer}>
                                <Checkbox.Item
                                    label="Distance (default)"
                                    status={checkedDistance ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setCheckedDistance(true);
                                        setCheckedDiscount(false);
                                    }}
                                />
                                <Checkbox.Item
                                    label="Discount level"
                                    status={checkedDiscount ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setCheckedDistance(false);
                                        setCheckedDiscount(true);
                                    }}
                                />
                            </View>
                            <Text style={styles.modalTitle}>Filter</Text>
                            <RadioButton.Group onValueChange={handleFilterChange} value={filterValue}>
                                <RadioButton.Item label="Restaurant" value="restaurant" />
                                <RadioButton.Item label="Bakery" value="bakery" />
                                <RadioButton.Item label="Supermarket" value="supermarket" />
                            </RadioButton.Group>
                            <Button mode="contained" onPress={hideModal} style={styles.button}>
                                Apply Filters
                            </Button>
                        </Modal>
                    </Portal>
                </View>
            
            
            </SafeAreaView>
        </Provider>
    
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "white",
    },
    topContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
      },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
    },
    cardContainer: {
        flex: 6,
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "skyblue",
      },
    title: {
        fontSize: 25,
        padding: 10,
        fontStyle: "normal",
        color: "black",
        fontWeight: "bold",
    },
    filterButton: {
        height: 42,
        width: 100,
        marginLeft: 10,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    filterButtonLabel: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },
    textBox: {
        backgroundColor: "white",
        height: 42,
        width: 300,
        fontSize: 15,
        borderColor: 'rgba(0, 0, 0, 0.5)', 
        borderWidth: 1,     
        borderRadius: 7,  
        paddingHorizontal: 10,
    }, modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    button: {
        marginTop: 20,
    },
});