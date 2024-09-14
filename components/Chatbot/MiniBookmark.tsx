import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";

const bookmarks = [
  {
    id: "1",
    hotelId: "1",
    image_url:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    city: "USA",
    name: "Tropical Paradise Resort",
    starting_price: "150",
    rating: 4.8,
    username: "Jingjia",
  },
  {
    id: "5",
    image_url:
      "https://images.unsplash.com/photo-1535927583620-7940e95a5a05?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8bGFrZSx0cmFucXVpbHx8fHx8fDE3MTEwMzI1MjA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1600",
    city: "England",
    name: "Tranquil Lakeside Haven",
    starting_price: "120",
    rating: 4.9,
    userId: "1",
    username: "Jingjia",
  },
  {
    id: "3",
    image_url:
      "https://images.unsplash.com/photo-1546436836-07a91091f160?q=80&w=3548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    city: "USA",
    name: "Urban Explorer's Dream",
    starting_price: "140",
    rating: 4.7,
    userId: "1",
    username: "Jingjia",
  },
];

const ListItem = ({ item }: { item: any }) => {
  const router = useRouter();
  return (
    <Pressable
      style={styles.item}
      onPress={() => {
        router.push(`/hotel/${item.id}`);
      }}
    >
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={14}
            color={Colors.primaryColor}
          />
          <Text style={styles.locationText}>{item.city}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Ionicons
              name="star-outline"
              size={14}
              color={Colors.primaryColor}
              style={{ marginHorizontal: 3 }}
            />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.priceText}>${item.starting_price}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const MiniBookmarkList = ({ data }: any) => {
  console.log("Bookmark list", data);
  if (!data || data.length === 0) {
    data = bookmarks;
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ListItem item={item} />}
      keyExtractor={(item) => item.bookmarkId}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#F6F8FD",
    paddingVertical: 5,
  },
  item: {
    width: Dimensions.get("window").width * 0.75,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 10,
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primaryColor,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },
  locationText: {
    fontSize: 12,
    color: "#00AFF0",
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Align price and rating with space between
    alignItems: "center",
    marginTop: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#00AFF0",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginVertical: 5,
  },
});

export default MiniBookmarkList;
