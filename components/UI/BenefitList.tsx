import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const { width: windowWidth } = Dimensions.get("window");

// Define types for the benefits data
interface Benefit {
  id: string;
  icon: keyof typeof Ionicons.glyphMap; // Ionicons icon names
  text: string;
}

// Dummy data for the FlatList
const benefits: Benefit[] = [
  { id: "1", icon: "wifi", text: "Enjoy Wifi Amenities" },
  {
    id: "2",
    icon: "restaurant",
    text: "Members get 20% discount for restaurant services",
  },
  {
    id: "3",
    icon: "phone-portrait",
    text: "Take advantage of Mobile Check-in and Mobile Keys",
  },
  { id: "4", icon: "gift", text: "Exclusive Offers for members" },
];

// Define props type for the BenefitItem component
interface BenefitItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

// Reusable component for each list item
const BenefitItem: React.FC<BenefitItemProps> = ({ icon, text }) => (
  <TouchableOpacity style={styles.benefitItem}>
    <Ionicons name={icon} size={24} color={"white"} />
    <Text style={styles.benefitText}>{text}</Text>
  </TouchableOpacity>
);

// Change the component name to PascalCase
const BenefitFlatList: React.FC = () => {
  return (
    <View style={styles.content}>
      <FlatList
        data={benefits}
        renderItem={({ item }) => (
          <BenefitItem icon={item.icon} text={item.text} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
        pagingEnabled
        decelerationRate={"fast"}
        snapToInterval={windowWidth * 0.85}
      />
    </View>
  );
};

export default BenefitFlatList; // Ensure the component is exported correctly

const styles = StyleSheet.create({
  content: {
    backgroundColor: "transparent",
    flex: 1,
  },
  flatListContainer: {
    paddingVertical: 10,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
    marginHorizontal: 10,
    width: windowWidth * 0.8, // Adjust width based on screen size
    height: 70,
  },
  benefitText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    marginLeft: 10,
  },
});
