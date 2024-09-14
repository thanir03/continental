// Checkout page

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
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { checkout, getBookingById } from "@/api/Booking";
import { BookingDetails } from "@/types/data";
import Colors from "@/constants/Colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useStripe } from "@stripe/stripe-react-native";
import { PasswordUser, useAuth } from "@/context/AuthProvider";
import { User } from "@react-native-google-signin/google-signin";
import { updateBookingStatus } from "@/db/db";

const CheckoutPage = () => {
  const { id } = useLocalSearchParams();
  const bookingId = parseInt(id as string);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const { user, authType } = useAuth();

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

  const getName = () => {
    if (!user) return "Guest";
    if (authType == "oauth_google") {
      return (user as User).user.familyName!;
    }
    return (user as PasswordUser).name!;
  };

  const initializePaymentSheet = async () => {
    const { client_secret } = await checkout(bookingId);

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Continental Inc.",
      paymentIntentClientSecret: client_secret,
      defaultBillingDetails: {
        name: getName(),
      },
    });
  };

  const openPaymentSheet = async () => {
    console.log("running");
    const { error } = await presentPaymentSheet();
    if (error) {
      router.navigate(`/booking/failure?id=${bookingId}`);
    } else {
      updateBookingStatus(Number(id), "SOON");
      console.log("Success");
      router.dismissAll();
      router.navigate(`/booking/success?id=${bookingId}`);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const openGoogleMaps = () => {
    const url = `geo:0,0?q=${booking?.h_name + " " + booking?.h_address}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error opening Google Maps", err)
    );
  };

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
    <View style={{ paddingLeft: 10, marginTop: 10 }}>
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        Checkout
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
        <View style={{ alignItems: "center" }}>
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
              width: Dimensions.get("screen").width,
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
                    marginLeft: 10,
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
                <Text
                  style={{
                    marginTop: -5,
                    paddingHorizontal: 5,
                    fontSize: 20,
                    color: Colors.primaryColor,
                  }}
                >
                  {ratingText}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {dayjs(booking.b_start).format("ddd")},
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {" "}
                  {dayjs(booking.b_start).format("MMM")}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {" "}
                  {dayjs(booking.b_start).format("DD")}
                </Text>
              </View>
              <AntDesign name="arrowright" size={24} color="black" />
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {dayjs(booking.b_end).format("ddd")},
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {" "}
                  {dayjs(booking.b_end).format("MMM")}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {" "}
                  {dayjs(booking.b_end).format("DD")}
                </Text>
              </View>
            </View>
          </View>
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
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  marginBottom: 10,
                  fontWeight: "bold",
                }}
              >
                Location
              </Text>
              <TouchableOpacity
                onPress={() => {
                  openGoogleMaps();
                }}
              >
                <Text style={{ color: Colors.primaryColor }}>See Map</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {booking.h_lat && booking.h_lng && (
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={{
                    height: 100,
                    width: 100,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  region={{
                    latitude: parseFloat(booking.h_lat),
                    longitude: parseFloat(booking.h_lng),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    key={"1"}
                    coordinate={{
                      latitude: parseFloat(booking.h_lat),
                      longitude: parseFloat(booking.h_lng),
                    }}
                    title={booking.h_name}
                  />
                </MapView>
              )}
              <Text
                style={{
                  padding: 5,
                  textAlign: "center",
                  flexShrink: 1,
                  marginTop: -10,
                }}
              >
                {booking.h_address}
              </Text>
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

          <View style={{ padding: 10 }}>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                openPaymentSheet();
              }}
            >
              <View
                style={{
                  borderRadius: 10,
                  backgroundColor: "#000",
                  padding: 10,
                  paddingVertical: 15,
                  width: Dimensions.get("screen").width * 0.8,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  Checkout RM {booking.total}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default CheckoutPage;
