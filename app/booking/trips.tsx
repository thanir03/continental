import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from "react-native-reanimated";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getBookingByStatus } from "@/api/Booking";
import dayjs from "dayjs";

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

const { height } = Dimensions.get("window");
type ViewToken = { item: Booking; isViewable: boolean };

const ListItem: React.FC<{
  item: any;
  viewableItems: SharedValue<ViewToken[]>;
}> = React.memo(({ item, viewableItems }) => {
  const router = useRouter();
  const rStyle = useAnimatedStyle(() => {
    const isVisible = viewableItems.value.some(
      (vItem) => vItem.isViewable && vItem.item.bookingId === item.bookingId
    );

    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.5),
        },
      ],
    };
  }, [viewableItems, item]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        router.push(`/booking/${item.bookingId}`);
      }}
    >
      <Animated.View style={[styles.item, rStyle]}>
        <Image source={{ uri: item.hotel_image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.hotel_name}</Text>
          <View style={styles.row}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={"grey"}
              style={styles.icon}
            />
            <Text style={styles.status}>{item.status}</Text>
          </View>

          {/* Dates with Icon */}
          <View style={styles.row}>
            <Feather
              name="calendar"
              size={16}
              color={"grey"}
              style={styles.icon}
            />
            <Text style={styles.dates}>
              {dayjs(item.start_date).format("MMM D, YYYY")}
            </Text>
            <Text style={styles.dates}>TO</Text>
            <Text style={styles.dates}>
              {dayjs(item.end_date).format("MMM D, YYYY")}
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
});

const statusOptions: {
  title: string;
  option: "ALL" | "PENDING" | "SOON" | "CURRENT" | "PAST" | "CANCELLED";
}[] = [
  { title: "All", option: "ALL" },
  { title: "Pending", option: "PENDING" },
  { title: "Soon", option: "SOON" },
  { title: "Current", option: "CURRENT" },
  { title: "Past", option: "PAST" },
  { title: "Cancelled", option: "CANCELLED" },
];

export default function TripsScreen() {
  const [booking, setBooking] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "ALL" | "PENDING" | "SOON" | "CURRENT" | "PAST" | "CANCELLED"
  >("ALL");
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const router = useRouter();

  useEffect(() => {
    getBookingByStatus(status).then((data: Booking[]) => {
      console.log(data);
      setBooking(data);
      setLoading(false);
    });
  }, [status]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/booking_wallpaper.jpg")}
        style={styles.headerBackground}
        imageStyle={styles.headerImage}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/booking")}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Booking List</Text>

        <ScrollView horizontal={true} style={[styles.buttonContainer]}>
          {statusOptions.map((item) => {
            return (
              <TouchableOpacity
                key={item.option}
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      status === item.option ? "white" : "transparent",
                  },
                ]}
                onPress={() => setStatus(item.option)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: status === item.option ? "black" : "white" },
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ImageBackground>

      <StatusBar hidden />
      {booking.length > 0 && (
        <FlatList
          data={booking}
          contentContainerStyle={styles.contentContainer}
          onViewableItemsChanged={({ viewableItems: vItems }) => {
            viewableItems.value = vItems.map((vItem) => ({
              item: vItem.item as Booking,
              isViewable: vItem.isViewable,
            }));
          }}
          renderItem={({ item }) => (
            <ListItem item={item} viewableItems={viewableItems} />
          )}
          keyExtractor={(item) => item.bookingId}
        />
      )}
      {booking.length === 0 && (
        <View
          style={{
            height: Dimensions.get("screen").height * 0.7,
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>No Bookings</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FD",
  },
  headerBackground: {
    height: height * 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    resizeMode: "cover",
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
  title: {
    width: 300,
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 20,
    zIndex: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    position: "absolute",
    left: 0,
    bottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    paddingTop: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  button: {
    paddingVertical: 5,
    margin: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    textAlign: "center",
    alignItems: "center", // Center content horizontally
    justifyContent: "center", // Center content vertically
  },
  buttonText: {
    fontSize: 16, // Set font size
    color: "#fff", // Set text color
    fontWeight: "500",
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  item: {
    height: 100,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#6699CC",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  icon: {
    marginRight: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  status: {
    fontSize: 14,
    marginVertical: 5,
    color: "grey",
  },
  dates: {
    fontSize: 14,
    color: "grey",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});
