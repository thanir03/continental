import {
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthProvider";
import dayjs from "dayjs";
import DateTimePicker from "react-native-ui-datepicker";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { createBooking } from "@/api/Booking";

dayjs();

// roomId , hotelId, hotelName, room_count

const DatePickerScreen = () => {
  const params = useLocalSearchParams();
  const roomId = parseInt(params["roomId"] as string);
  const noRooms = parseInt(params["no_room"] as string);
  const [date, setDate] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().add(1, "day"),
    dayjs().add(2, "day"),
  ]);

  const [isLoading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.navigate("/auth");
    }
  }, [isLoggedIn]);

  const diff = dayjs(date[1]).diff(dayjs(date[0]), "days");

  const handleCreateBooking = async () => {
    if (diff <= 0) {
      Alert.alert("Invalid date is selected");
    }
    setLoading(true);
    const startDate = date[0].format("YYYY-MM-DD").toString();
    const endDate = date[1].format("YYYY-MM-DD").toString();
    const response = await createBooking({
      roomId,
      no_rooms: noRooms,
      start_date: startDate,
      end_date: endDate,
    });
    if (response.status) {
      const id: number = response["booking_id"];
      router.push(`/booking/checkout?id=${response["booking_id"]}`);
    } else {
      Alert.alert(response.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: 10,
          marginBottom: 20,
        }}
      >
        <TouchableWithoutFeedback onPress={router.back}>
          <View
            style={{
              zIndex: 10,
              width: 50,
              backgroundColor: "#333533",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Ionicons name="arrow-back" size={30} color={"white"} />
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 0,
            marginLeft: 25,
          }}
        >
          Select Your Booking Date
        </Text>
      </View>

      <DateTimePicker
        mode="range"
        startDate={date[0]}
        endDate={date[1]}
        onChange={({ startDate, endDate }: any) => {
          setDate([startDate, endDate]);
        }}
        selectedItemColor={Colors.primaryColor}
        minDate={dayjs().add(0, "day")}
      />
      <Pressable
        style={{
          borderRadius: 10,
          backgroundColor: "black",
          padding: 10,
          width: Dimensions.get("screen").width * 0.8,
          margin: 0,
          marginHorizontal: "auto",
          paddingVertical: 15,
        }}
        onPress={handleCreateBooking}
      >
        <>
          {!isLoading && (
            <Text style={{ color: "white", textAlign: "center" }}>
              Book {diff > 0 && `for ${diff} days`} {diff <= 0 && "Now"}
            </Text>
          )}
          {isLoading && <ActivityIndicator size="small" color="white" />}
        </>
      </Pressable>
    </SafeAreaView>
  );
};

export default DatePickerScreen;
