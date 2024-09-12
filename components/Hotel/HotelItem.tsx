import Colors from "@/constants/Colors";
import { MinorHotelDetails } from "@/types/data";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { View } from "react-native-ui-lib";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

// Hotel Item that is used in search screen
const HotelItem = ({ item }: { item: MinorHotelDetails }) => {
  const router = useRouter();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        router.push(`/hotel/${item.id}`);
      }}
    >
      <View style={styles.listItem}>
        <Image
          source={{ uri: item.image_url }}
          style={styles.destinationImage}
        />
        <Text style={styles.itemText}>{item.name}</Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <AntDesign name="star" size={10} color="black" />
          <Text>{item.rating} </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemText}>Location: {item.city}</Text>
          <Text style={styles.priceText}>Price: {item.price} MYR</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(HotelItem);

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#6699CC",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "90%",
    alignSelf: "center",
    paddingBottom: 10,
    margin: 15,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  itemText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
    paddingHorizontal: 15,
  },
  destinationImage: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  priceText: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.primaryColor,
    paddingHorizontal: 15,
  },
});
