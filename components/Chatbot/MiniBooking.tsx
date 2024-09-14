import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface Booking {
  bookingId: string;
  userId: string;
  hotelId: string;
  arrivalDate: string;
  departureDate: string;
  status: string;
  name: string;
  image: string;
  description: string;
  location: string;
}

const bookings = [
  {
    bookingId: "1",
    userId: "1",
    hotelId: "10",
    arrivalDate: "2024-09-10",
    departureDate: "2024-09-15",
    status: "Pending",
    name: "Seaside Retreat",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Enjoy a peaceful stay at our seaside retreat with stunning ocean views.",
    location: "California, USA",
  },
  {
    bookingId: "2",
    userId: "2",
    hotelId: "15",
    arrivalDate: "2024-09-12",
    departureDate: "2024-09-18",
    status: "Current",
    name: "Mountain Hideaway",
    image:
      "https://images.unsplash.com/photo-1512273222628-4daea6e55abb?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Located in the heart of the mountains, perfect for hiking and nature lovers.",
    location: "Colorado, USA",
  },
  {
    bookingId: "3",
    userId: "3",
    hotelId: "20",
    arrivalDate: "2024-09-20",
    departureDate: "2024-09-25",
    status: "Pending",
    name: "Urban Oasis",
    image:
      "https://images.unsplash.com/photo-1697543117287-53b5ab69742b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2l0eSxtZXRyb3BvbGl0YW58fHx8fHwxNzExMDMyNzM1&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1600",
    description:
      "Urban hotel with easy access to local attractions and nightlife.",
    location: "New York, USA",
  },
];

const renderItem = ({ item }: { item: any }) => (
  <TouchableOpacity style={styles.item}>
    <Image source={{ uri: item.image_url }} style={styles.image} />
    <View style={styles.textContainer}>
      <Text style={styles.name}>{item.hotel_name}</Text>
      <Text style={styles.location}>{item.city}</Text>
      <View style={styles.row}>
        <Ionicons
          name="checkmark-circle-outline"
          size={16}
          color={Colors.primaryColor}
        />
        <Text style={styles.status}>{item.status}</Text>
      </View>
      <View style={styles.row}>
        <Ionicons
          name="calendar-outline"
          size={16}
          color={Colors.primaryColor}
        />
        <Text
          style={styles.dates}
        >{`${item.start_date} - ${item.end_date}`}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const MiniBookingList = ({ data }: any) => {
  return (
    <FlatList
      data={data[0]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: "#F6F8FD",
  },
  item: {
    flexDirection: "row",
    width: 300,
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginLeft: 3,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontWeight: "bold",
    color: Colors.primaryColor,
    fontSize: 14,
  },
  location: {
    fontSize: 12,
    color: "#888",
  },
  status: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
  dates: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
});

export default MiniBookingList;
