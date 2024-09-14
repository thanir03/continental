import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";

// Define the Room interface
interface Room {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

// Define the Hotel interface
interface Hotel {
  id: number;
  name: string;
  image_url: string;
  rating: number;
  city: string;
  rooms: Room[];
}

const hotelData = {
  hotel: {
    id: 23,
    name: "Ibis London City - Shoreditch",
    image_url:
      "https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/550222745.jpg?k=4978d2f347af887d15f8852691081b6c5f2a2a7327dcf6531cbe3c3b762d53e8&s=1080x720",
    rating: 8.2,
    city: "London",
  },
  room: [
    {
      id: 936,
      name: "Sweet Double",
      price: 979,
      imageUrl:
        "https://pix8.agoda.net/hotelImages/21629422/294982671/2d652abe923173b721c5425211ff8585.jpg?ca=17&ce=1&s=1080x720",
    },
    {
      id: 979,
      name: "Sweet Room",
      price: 1045,
      imageUrl:
        "https://pix8.agoda.net/hotelImages/21629422/294982672/2d652abe923173b721c5425211ff8585.jpg?ca=17&ce=1&s=1080x720",
    },
    {
      id: 1045,
      name: "Family 1 Double And 1 Extra Bed",
      price: 1500,
      imageUrl:
        "https://q-xx.bstatic.com/xdata/images/hotel/max1080/160237206.jpg?k=65ed910529921372bd21f2215977ad2a72ea4b910cb88575f75d6a1148cfb73a&o=",
    },
  ],
};

const MiniRoomList = ({ data }: any) => {
  console.log("PROPS", JSON.stringify(data));
  const router = useRouter();
  const renderItem = ({ item }: { item: Room }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.roomName}>{item.name}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </View>
  );
  console.log("running mini room list");
  if (
    !data ||
    (Array.isArray(data) && data.length === 0) ||
    !data[0]?.["hotel"]?.["name"] ||
    !data[0]["room"] ||
    (Array.isArray(data[0]["room"]) && data[0]["room"].length === 0)
  ) {
    console.log("Fallback to original data");
    data = hotelData;
  } else {
    console.log("Original data");
    data = data[0];
    console.log(data);
  }
  return (
    <View>
      <TouchableOpacity
        onPress={() => router.push(`/hotel/${hotelData.hotel.id}`)}
      >
        <Text style={styles.hotelHeader}>
          {data?.hotel?.name ?? "Hotel Name"}
        </Text>
        <FlatList
          data={hotelData.room}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MiniRoomList;

const styles = StyleSheet.create({
  hotelHeader: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.primaryColor, // Changed to primary color
    padding: 10,
  },
  card: {
    width: 200,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    overflow: "hidden",
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowColor: "#000",
    shadowOffset: { height: 0, width: 0 },
  },
  image: {
    width: "100%",
    height: 120,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 5,
    marginTop: 5,
    color: Colors.primaryColor, // Changed to primary color
  },
  price: {
    fontSize: 14,
    marginHorizontal: 5,
    color: "#00AFF0", // Changed to light blue
  },
});
