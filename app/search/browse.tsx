import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import BackButton from "@/components/UI/BackButton";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

// Full Search Page
const BrowseScreen = () => {
  const router = useRouter();
  const { q: query } = useLocalSearchParams();

  const [roomCount, setRoomCount] = useState(1);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  return (
    <SafeAreaView style={{ gap: 200 }}>
      <View
        style={{
          gap: 50,
        }}
      >
        <StatusBar backgroundColor="white" />
        <BackButton onBack={() => router.back()} />
        <View style={{ gap: 10 }}>
          <View
            style={{
              flexDirection: "row",
              width: "80%",
              margin: "auto",
              marginVertical: 0,
              alignItems: "center",
            }}
          >
            <Ionicons
              name="location"
              size={20}
              color={Colors.primaryColor}
              style={styles.icon}
            />
            <Text style={{ color: "#black", fontSize: 18, fontWeight: "400" }}>
              LOCATION
            </Text>
          </View>
          <Link
            href={"/search"}
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1,
              width: "80%",
              margin: "auto",
              color: Colors.primaryColor,
              padding: 10,
              fontSize: 25,
              marginVertical: 0,
            }}
          >
            {query ?? "Where Next ?"}
          </Link>
        </View>
        <View
          style={{
            width: "80%",
            margin: 0,
            marginHorizontal: "auto",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <FontAwesome name="hotel" size={24} color={Colors.primaryColor} />
            <Text style={{ color: "#black", fontSize: 18, fontWeight: "400" }}>
              Number of Rooms
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity>
              <AntDesign
                name="minuscircleo"
                size={30}
                onPress={() => {
                  setRoomCount((rc) => rc - 1);
                }}
                color={roomCount == 1 ? "#8d99ae" : "black"}
                disabled={roomCount == 1}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 30, textAlign: "center" }}>
              {roomCount}
            </Text>
            <TouchableOpacity
              disabled={roomCount == 3}
              onPress={() => {
                setRoomCount((rc) => rc + 1);
              }}
            >
              <AntDesign
                color={roomCount == 3 ? "#8d99ae" : "black"}
                name="pluscircleo"
                size={30}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: "80%",
            margin: 0,
            marginHorizontal: "auto",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <MaterialIcons
              name="people"
              size={24}
              color={Colors.primaryColor}
            />
            <Text style={{ color: "#black", fontSize: 18, fontWeight: "400" }}>
              Adults Per Room
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity>
              <AntDesign
                name="minuscircleo"
                size={30}
                onPress={() => {
                  setAdultCount((ac) => ac - 1);
                }}
                color={adultCount == 1 ? "#8d99ae" : "black"}
                disabled={adultCount == 1}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 30, textAlign: "center" }}>
              {adultCount}
            </Text>
            <TouchableOpacity
              disabled={adultCount == 3}
              onPress={() => {
                setAdultCount((ac) => ac + 1);
              }}
            >
              <AntDesign
                color={adultCount == 3 ? "#8d99ae" : "black"}
                name="pluscircleo"
                size={30}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            width: "80%",
            margin: 0,
            marginHorizontal: "auto",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <FontAwesome5 name="child" size={24} color={Colors.primaryColor} />
            <Text style={{ color: "#black", fontSize: 18, fontWeight: "400" }}>
              Child Per Room
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity>
              <AntDesign
                name="minuscircleo"
                size={30}
                onPress={() => {
                  setChildCount((c) => c - 1);
                }}
                color={childCount == 0 ? "#8d99ae" : "black"}
                disabled={childCount == 0}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 30, textAlign: "center" }}>
              {childCount}
            </Text>
            <TouchableOpacity
              disabled={childCount == 3}
              onPress={() => {
                setChildCount((c) => c + 1);
              }}
            >
              <AntDesign
                color={childCount == 3 ? "#8d99ae" : "black"}
                name="pluscircleo"
                size={30}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={{
          width: "80%",
          borderRadius: 40,
          backgroundColor: Colors.primaryColor,
          padding: 10,
          paddingVertical: 15,
          margin: 0,
          marginHorizontal: "auto",
        }}
        onPress={() => {
          if (!query) {
            Alert.alert("Location is empty");
          } else {
            router.push(
              `/hotel?q=${query}&room_num=${roomCount}&no_adult=${adultCount}&no_child=${childCount}`
            );
          }
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Find Hotels</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BrowseScreen;

const styles = StyleSheet.create({
  icon: {
    marginRight: 10,
  },
});
