import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { LoginContext } from "../App";
import { fetchRestaurantData } from "../firestoreUtils";
import ShareFoodModal from "./ShareFoodModal";

export default function FoodShared({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Food Shared</Text>
      <Text style={styles.infoText}>List of food items shared</Text>
    </View>
  );
}
