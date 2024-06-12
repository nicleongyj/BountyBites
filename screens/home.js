import {
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  ImageBackground,
} from "react-native";
import {
  Button,
  TextInput,
  Portal,
  Checkbox,
  Modal,
  RadioButton,
  Provider,
} from "react-native-paper";
import { View } from "react-native";
import { useContext, useState, useEffect, useRef } from "react";

import { LoginContext } from "../App";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { restaurants } from "../sample_data/restaurants";
import { fetchAllRestaurants } from "../firestoreUtils";
import * as Location from "expo-location";
import waiting from "../assets/waiting.png";
import RefreshImage from "../assets/refresh.png";

export default function Home({ navigation }) {
  const { logout } = useContext(LoginContext);

  // Filter states
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [visible, setVisible] = useState(false);
  const [filterValue, setFilterValue] = useState("all");
  const [checkedDistance, setCheckedDistance] = useState(true);
  const [checkedDiscount, setCheckedDiscount] = useState(false);

  const [restaurantData, setRestaurantData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const dataFetched = useRef(false);

  const [userLongitude, setUserLongitude] = useState(null);
  const [userLatitude, setUserLatitude] = useState(null);
  const locationFetched = useRef(false);

  const handleFilter = () => {
    setVisible(!visible);
  };

  const handleRefresh = () => {
    setRefresh(true);
    dataFetched.current = false;
    locationFetched.current = false;
    setRestaurantData(null);
  };

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

  const handleCardPress = (restaurant) => {
    console.log("Card pressed");
    navigation.navigate("ItemList", { restaurant: restaurant });
  };

  // Fetch user location
  useEffect(() => {
    (async () => {
      if (locationFetched.current === false) {
        console.log(locationFetched.current, dataFetched.current);
        console.log("Fetching user location...");
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        if (location.coords.latitude !== null) {
          locationFetched.current = true;
          setUserLongitude(location.coords.longitude);
          setUserLatitude(location.coords.latitude);
          console.log(
            "Location set: ",
            location.coords.latitude,
            location.coords.longitude
          );
        }
      }
    })();
  }, [dataFetched.current]);

  // Fetch restaurant data
  useEffect(() => {
    if (!dataFetched.current) {
      const fetchData = async () => {
        try {
          const data = await fetchAllRestaurants();
          console.log("Fetching restaurants...");
          setRestaurantData(data);
          console.log("Restaurant data fetched");
          console.log(restaurantData);
          setRefresh(false);
          dataFetched.current = true;
        } catch (error) {
          console.error("Error fetching restaurant data:", error);
        }
      };
      fetchData();
    }
  }, [dataFetched.current, refresh, locationFetched.current]);

  // Get distance between user and restaurant, if location and restaurant data is available
  const [restaurantWithLocation, setRestaurantWithLocation] = useState(null);
  useEffect(() => {
    console.log("User location: ", userLatitude, userLongitude);
    if (userLatitude && userLongitude && restaurantData) {
      const updatedRestaurantData = restaurantData.map((restaurant) => {
        const distance = getDistanceFromLatLonInKm(
          userLatitude,
          userLongitude,
          restaurant.latitude,
          restaurant.longitude
        );
        return { ...restaurant, distance };
      });
      setRestaurantWithLocation(updatedRestaurantData);
    }
  }, [userLatitude, userLongitude, restaurantData]);

  // Get distance between two coordinates
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d.toFixed(2);
  }

  const currentTime =
    new Date().getHours().toString() + new Date().getMinutes().toString();

  // Filter
  let filteredRestaurants = [];
  if (restaurantWithLocation) {
    filteredRestaurants = restaurantWithLocation.filter((restaurant) => {
      const closingTime = restaurant.closingTime.split(":").join("");
      if (closingTime < currentTime) {
        return false;
      }
      if (filterValue === "restaurant") {
        return restaurant.type === "Restaurant";
      } else if (filterValue === "bakery") {
        return restaurant.type === "Bakery";
      } else if (filterValue === "supermarket") {
        return restaurant.type === "Supermarket";
      }
      return true;
    });
  }

  // Sort
  let sortedRestaurants = [];
  if (filteredRestaurants) {
    sortedRestaurants = filteredRestaurants.slice().sort((a, b) => {
      if (checkedDistance) {
        return a.distance - b.distance;
      } else if (checkedDiscount) {
        return Number(b.discount) - Number(a.discount);
      }
      return 0;
    });
  }

  // Search
  useEffect(() => {
    if (restaurantData) {
      const lowerCaseSearch = search.toLowerCase();
      const filtered = restaurantData.filter((restaurant) =>
        restaurant.restaurantName.toLowerCase().includes(lowerCaseSearch)
      );
      setSearchResults(filtered);
    }
  }, [search, restaurantData]);

  // Display search results if search is not empty
  const results = (search ? searchResults : sortedRestaurants).filter(
    (restaurant) => restaurant.totalQuantity > 0
  );
  restaurantsToDisplay = results.length > 0 ? results : [];

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        {/* <View style={styles.container}> */}

        {!restaurantWithLocation && !refresh ? (
          <View style={styles.loadingText}>
            <Image style={{ width: 150, height: 150 }} source={waiting}></Image>
            <Text style={styles.loadingTextLabel}>
              Loading bites, please wait...
            </Text>
          </View>
        ) : refresh ? (
          <View style={styles.loadingText}>
            {/* <Image style={{width:150, height:150}} source={waiting}></Image> */}
            <Text style={styles.loadingTextLabel}>
              Refreshing page, please wait...
            </Text>
          </View>
        ) : (
          <>
            {/* <ImageBackground source={require("../assets/background.jpg")} style={{flex: 1, resizeMode: "cover", justifyContent: "center"}}> */}
            <View style={styles.topContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Text style={styles.title}>Browse Food 🍔</Text>
                <Pressable
                  onPress={handleRefresh}
                  style={{
                    alignSelf: "center",
                    position: "absolute",
                    right: 10,
                  }}
                >
                  <Image
                    source={RefreshImage}
                    style={{ width: 30, height: 30, alignSelf: "center" }}
                  ></Image>
                </Pressable>
              </View>

              <View style={styles.searchContainer}>
                <TextInput
                  mode="flat"
                  style={styles.textBox}
                  placeholder="Search"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  onChangeText={(text) => setSearch(text)}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <Icon name="search" size={20} color="black" />
                      )}
                    />
                  }
                />

                <Button
                  mode="contained"
                  style={styles.filterButton}
                  labelStyle={styles.filterButtonLabel}
                  onPress={handleFilter}
                >
                  Filter
                </Button>
              </View>
            </View>

            <View style={styles.cardContainer}>
              {restaurantsToDisplay.length === 0 ? (
                <View style={styles.noFoodContainer}>
                  <Text style={styles.noFoodText}>
                    No bites at the moment... 😔
                  </Text>
                </View>
              ) : (
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                  {restaurantsToDisplay.map((restaurant, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleCardPress(restaurant)}
                    >
                      <View key={index} style={styles.card}>
                        <View style={styles.textContainer}>
                          <Text style={styles.cardTitle}>
                            {restaurant.restaurantName}
                            {restaurant.distance &&
                              ` (${restaurant.distance} km)`}
                          </Text>
                          <View style={{ paddingLeft: 10 }}>
                            <View style={{ flexDirection: "row" }}>
                              <Text style={{ fontWeight: "bold" }}>
                                Address:{" "}
                              </Text>
                              <Text style={{ width: 150 }}>
                                {restaurant.location}
                              </Text>
                            </View>

                            <View style={{ flexDirection: "row" }}>
                              <Text style={{ fontWeight: "bold" }}>
                                Food Items Available:{" "}
                              </Text>
                              <Text>{restaurant.totalQuantity}</Text>
                            </View>

                            <View style={{ flexDirection: "row" }}>
                              <Text style={{ fontWeight: "bold" }}>
                                Discount Available:{" "}
                              </Text>
                              <Text>{restaurant.discount}%</Text>
                            </View>
                          </View>
                        </View>
                        <Image
                          source={{ uri: restaurant.link }}
                          style={styles.image}
                        />
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* <Button onPress={handleLogout}>Back to start page</Button> */}

            {/* Modal for filter and sort */}
            <View>
              <Portal>
                <Modal
                  visible={visible}
                  onDismiss={handleFilter}
                  contentContainerStyle={styles.modalContainer}
                >
                  <Text style={styles.modalTitle}>Sort</Text>
                  <View style={styles.checkboxContainer}>
                    <Checkbox.Item
                      label="Distance (default)"
                      status={checkedDistance ? "checked" : "unchecked"}
                      onPress={() => {
                        setCheckedDistance(true);
                        setCheckedDiscount(false);
                      }}
                    />
                    <Checkbox.Item
                      label="Discount level"
                      status={checkedDiscount ? "checked" : "unchecked"}
                      onPress={() => {
                        setCheckedDistance(false);
                        setCheckedDiscount(true);
                      }}
                    />
                  </View>
                  <Text style={styles.modalTitle}>Filter</Text>
                  <RadioButton.Group
                    onValueChange={handleFilterChange}
                    value={filterValue}
                  >
                    <RadioButton.Item label="All" value="all" />
                    <RadioButton.Item label="Restaurant" value="restaurant" />
                    <RadioButton.Item label="Bakery" value="bakery" />
                    <RadioButton.Item label="Supermarket" value="supermarket" />
                  </RadioButton.Group>
                  <Button
                    mode="contained"
                    onPress={handleFilter}
                    style={styles.button}
                  >
                    Apply Filters
                  </Button>
                </Modal>
              </Portal>
            </View>
            {/* </ImageBackground> */}
          </>
        )}
        {/* </View> */}
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "white",
    paddingTop: 10,
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
    width: "100%",
  },
  cardContainer: {
    flex: 6,
    alignItems: "center",
    flexDirection: "column",
    // backgroundColor: "white",
  },
  noFoodContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  title: {
    fontSize: 23,
    padding: 10,
    fontStyle: "normal",
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
  },
  cardTitle: {
    fontSize: 18,
    padding: 10,
    fontStyle: "normal",
    color: "black",
    fontWeight: "bold",
  },
  filterButton: {
    height: 42,
    width: "25%",
    marginLeft: 10,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fc7b03",
  },
  filterButtonLabel: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  loadingText: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  loadingTextLabel: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  textBox: {
    backgroundColor: "white",
    height: 42,
    width: "65%",
    fontSize: 15,
    borderColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 10,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "black",
  },

  // Card styles
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    width: "100%",
    height: 130,
    backgroundColor: "white",
    marginVertical: 10,
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  textContainer: {
    alignContent: "center",
    justifyContent: "center",
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  noFoodText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
});
