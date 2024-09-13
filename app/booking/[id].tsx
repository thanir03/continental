import {
  View,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { cancelBooking, getBookingById } from "@/api/Booking";
import { BookingDetails } from "@/types/data";
import Colors from "@/constants/Colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";

const BookingDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const bookingId = parseInt(id as string);

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getBookingById(bookingId).then((res) => {
      if (res.status) {
        setBooking(res["data"] as BookingDetails);
      } else {
        setError(res.message);
      }
      setLoading(false);
    });
  }, []);

  let ratingText = "";
  const rating = parseFloat(booking?.h_rating ?? "0");
  if (rating >= 8) {
    ratingText = "Very Good";
  } else if (rating >= 7) {
    ratingText = "Good";
  } else {
    ratingText = "Average";
  }
  return (
    <View
      style={{
        paddingLeft: 10,
        marginTop: 10,
        height: Dimensions.get("screen").height,
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        Booking Details
      </Text>
      <TouchableWithoutFeedback onPress={router.back}>
        <View
          style={{
            position: "absolute",
            zIndex: 10,
            backgroundColor: "#333533",
            padding: 10,
            top: 10,
            left: 15,
            borderRadius: 10,
          }}
        >
          <Ionicons name="arrow-back" size={30} color={"white"} />
        </View>
      </TouchableWithoutFeedback>
      {loading && (
        <ActivityIndicator
          size={"large"}
          style={{ height: 800 }}
          color={Colors.primaryColor}
        />
      )}
      {booking && (
        <View style={{ alignItems: "center", gap: 20 }}>
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              shadowColor: "#6699CC",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              marginLeft: -10,
              width: Dimensions.get("screen").width * 0.9,
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: 20,
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                borderBottomColor: "#dad7cd",
                borderBottomWidth: 1,
                paddingBottom: 10,
              }}
            >
              <Image
                style={{ height: 150, width: 150, borderRadius: 10 }}
                source={{ uri: booking.h_img }}
              />
              <View
                style={{
                  flex: 1,
                  gap: 10,
                  padding: 10,
                }}
              >
                <Text
                  style={{ fontSize: 20, flexShrink: 1, fontWeight: "bold" }}
                >
                  {booking.h_name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      alignItems: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {booking.h_rating}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 2 }}>
                    {Array.from({
                      length: Math.round(parseFloat(booking.h_rating) / 2),
                    }).map((_, index) => {
                      return (
                        <AntDesign
                          key={index}
                          name="star"
                          size={20}
                          color="gold"
                        />
                      );
                    })}
                  </View>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Ionicons name="checkmark-circle" size={14} color={"grey"} />
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.primaryColor,
                    }}
                  >
                    {booking.status}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    RM {booking.total}
                  </Text>
                  <Text style={{ color: "gray" }}>|</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {booking.b_no_room} room(s)
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 5,
                marginTop: 7,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {dayjs(booking.b_start).format("dddd")},{" "}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {dayjs(booking.b_start).format("MMM")}{" "}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {dayjs(booking.b_start).format("DD")}
                </Text>
              </View>
              <AntDesign name="arrowright" size={24} color="black" />
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {dayjs(booking.b_end).format("dddd")},{" "}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {dayjs(booking.b_end).format("MMM")}{" "}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {dayjs(booking.b_end).format("DD")}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              shadowColor: "#6699CC",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              marginLeft: -10,
              width: Dimensions.get("screen").width * 0.9,
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: 20,
              marginTop: 10,
            }}
          >
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Image
                style={{
                  height: 120,
                  width: 120,
                  borderRadius: 10,
                  resizeMode: "cover",
                }}
                source={{ uri: booking.h_img }}
              />
              <View style={{ width: 0, flexGrow: 1, flex: 1 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", flexShrink: 1 }}
                >
                  {booking.r_name} x {booking.b_no_room}
                </Text>
                <View style={{ paddingTop: 10 }}>
                  <Text>Size : {booking.r_size}m²</Text>
                  <Text>Max {booking.r_no_adult} Adult(s) </Text>
                  <Text>Max {booking.r_no_child} Children</Text>
                  <Text>Price Per Day : RM{booking.r_price}</Text>
                  <Text>{booking.r_bed}</Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              width: Dimensions.get("screen").width,
              backgroundColor: "white",
              bottom: -200,
              padding: 30,
              paddingBottom: 40,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.primaryColor,
                width:
                  booking.status !== "PENDING" && booking.status !== "SOON"
                    ? "80%"
                    : "40%",
                borderRadius: 10,
                marginLeft:
                  booking.status !== "PENDING" && booking.status !== "SOON"
                    ? 35
                    : 0,
              }}
              onPress={() => {
                router.push(`/hotel/${booking.h_id}`);
              }}
            >
              <View
                style={{
                  padding: 10,
                  paddingVertical: 15,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  View Hotel
                </Text>
              </View>
            </TouchableOpacity>

            {booking.status == "PENDING" && (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "black",
                  width: "55%",
                  borderRadius: 10,
                }}
                onPress={() => {
                  router.push(`/booking/checkout?id=${bookingId}`);
                }}
              >
                <View
                  style={{
                    padding: 10,
                    paddingVertical: 15,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Checkout RM {booking.total}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            {booking.status == "SOON" && (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "red",
                  width: "50%",
                  borderRadius: 10,
                }}
                onPress={() => {
                  Alert.alert(
                    "Cancel Booking",
                    "Are you sure you want to cancel this booking?",
                    [
                      {
                        text: "No",
                        onPress: () => {},
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          cancelBooking(bookingId).then((res) => {
                            console.log(res);
                          });
                          router.navigate("/booking/trips");
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                }}
              >
                <View
                  style={{
                    padding: 10,
                    paddingVertical: 15,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default BookingDetailsScreen;
