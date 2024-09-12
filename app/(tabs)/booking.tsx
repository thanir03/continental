import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import React from "react";
import Color from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import TextAnimator from "@/TypingAnimations/TextAnimator";
import Listings from "@/components/Listings";
import CitiesCarousel from "@/components/CitiesCarousel";
import BookingList from "@/components/bookingList";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthProvider";

const { height } = Dimensions.get("window");

export default function Booking() {
  const router = useRouter();
  const { width: screenWidth } = Dimensions.get("screen");

  return (
    <SafeAreaView style={{ backgroundColor: Color.bgColor, flex: 1 }}>
      <View style={styles.header}>
        <ImageBackground
          source={require("@/assets/images/booking_wallpaper.jpg")}
          style={styles.headerBackground}
          imageStyle={styles.headerImage}
        >
          <TextAnimator content="Booking" textStyle={styles.headerTitle} />
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={styles.inputTouchable}
              onPress={() => router.push("/search")}
            >
              <Text style={styles.inputText}>Where are you going?</Text>
              <View style={styles.inputIcon}>
                <Feather color="#fff" name="search" size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
      <ScrollView style={styles.content}>
        <BookingList />
        <CitiesCarousel />
        <View style={{ paddingVertical: 10 }}>
          <Text style={styles.title}>Cozy</Text>
          <Listings category="Cozy" height={250} width={screenWidth / 1.8} />
        </View>
        <View>
          <Text style={styles.title}>Deluxe</Text>
          <Listings category="Deluxe" />
        </View>
        <View style={{ paddingVertical: 10 }}>
          <Text style={styles.title}>Luxury</Text>
          <Listings category="Luxury" />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingTop: height * 0.2, // Adjust padding to account for the initial header height
    backgroundColor: "#F6F8FD",
  },
  header: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    height: height * 0.2,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "black",
    textAlign: "left",
    margin: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    paddingBottom: 5,
    marginRight: 250,
    marginTop: 50,
  },
  headerBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Center the input in the middle of the background
    paddingHorizontal: 20,
  },
  headerImage: {
    resizeMode: "cover",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  inputWrapper: {
    width: "100%", // Make inputWrapper full width
    alignItems: "center", // Center the content horizontally
    paddingBottom: 25,
  },
  inputTouchable: {
    backgroundColor: "rgba(255,255,255,0.3)",
    height: 48,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Color.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    width: "100%", // Make TouchableOpacity full width
  },
  inputText: {
    color: "white",
    fontSize: 18,
    flex: 1,
  },
  inputIcon: {
    marginLeft: 10,
  },
  bottomSpacer: {
    height: 230,
    backgroundColor: "#F6F8FD",
  },
});
