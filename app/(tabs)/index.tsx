import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Animated,
  StatusBar,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Color from "@/constants/Colors";
import VideoCarousel from "@/components/VideoCarousel";
import CategoryButtons from "@/components/CategoryButton";
import Listings from "@/components/Listings";
import TextAnimator from "@/TypingAnimations/TextAnimator";
import PopularCarousel from "@/components/ParallaxCarousel";
import CitiesCarousel from "@/components/CitiesCarousel";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

const Colors = {
  white: "#ffffff",
  black: "#000000",
};

export default function HomePage() {
  const videos = [
    {
      $id: "1",
      video: require("@/assets/videos/video-1.mp4"),
      title: "Adventure awaits you",
      content: "Variaty of plans awaits you",
    },
    {
      $id: "2",
      video: require("@/assets/videos/video-2.mp4"),
      title: "Clear your mind",
      content: "Services available 24 hours",
    },
    {
      $id: "3",
      video: require("@/assets/videos/video-3.mp4"),
      title: "Continental Hotel",
      content: "Available everywhere around the globe",
    },
    {
      $id: "4",
      video: require("@/assets/videos/video-4.mp4"),
      title: "Your best partner",
      content: "No 1 Hotel chosen by businessman",
    },
  ];

  const [category, setCategory] = useState("All");

  const onCatChanged = (category: string) => {
    setCategory(category);
  };

  const scrollY = useRef(new Animated.Value(0)).current;

  // Define header height ranges
  const headerHeight = height * 0.8; // Maximum height of the header (80% of screen height)
  const minHeaderHeight = height * 0.25; // Minimum height of the header
  const fixedPosition = minHeaderHeight * 0.5; // Adjust based on where you want to fix the text and input

  // Interpolate the header height based on scroll position
  const translateHeader = scrollY.interpolate({
    inputRange: [0, 0.8 * (headerHeight - minHeaderHeight)],
    outputRange: [0, -0.98 * (headerHeight - minHeaderHeight)], // Reduce the translation amount
    extrapolate: "clamp",
  });

  // Interpolate the scale of the content based on scroll position
  const scaleContent = scrollY.interpolate({
    inputRange: [0, 0.8 * (headerHeight - minHeaderHeight)],
    outputRange: [1.0, 0.98], // Slightly reduce the scale down amount
    extrapolate: "clamp",
  });

  // Calculate translateY for the text and search bar to stop at fixedPosition
  const translateYTextInput = scrollY.interpolate({
    inputRange: [0, fixedPosition],
    outputRange: [0, 0.58 * (headerHeight - minHeaderHeight)], // Reduce the translation amount
    extrapolate: "clamp",
  });

  const translateYButton = scrollY.interpolate({
    inputRange: [0, fixedPosition],
    outputRange: [0, 0.95 * (headerHeight - minHeaderHeight)], // Reduce the translation amount
    extrapolate: "clamp",
  });

  const router = useRouter();

  return (
    <View style={{ backgroundColor: Color.bgColor, flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            transform: [{ translateY: translateHeader }],
          },
        ]}
      >
        <ImageBackground
          source={require("@/assets/images/Wallpaper.jpg")}
          style={[styles.headerBackground]}
          imageStyle={styles.headerImage}
        >
          <Animated.View style={styles.headerTopBar}>
            <TouchableOpacity
              onPress={() => {
                router.push("/booking/1");
              }}
              style={{
                position: "absolute",
                right: 5,
                top: 30,
                backgroundColor: "transparent",
                padding: 10,
                borderRadius: 20,
                shadowColor: "#171717",
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                transform: [
                  { scale: scaleContent },
                  { translateY: translateYButton },
                ],
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={30}
                color={Colors.white}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={[
              styles.headerContent,
              {
                transform: [
                  { scale: scaleContent },
                  { translateY: translateYTextInput },
                ],
              },
            ]}
          >
            <TextAnimator
              content="Hello, tell us where to go?"
              textStyle={styles.headerTitle}
            />

            <View style={styles.inputWrapper}>
              <TouchableOpacity
                style={styles.input}
                onPress={() => router.push("/search")}
              >
                <Text style={styles.input}>Where are you going?</Text>
                <View style={styles.inputIcon}>
                  <Feather color="#fff" name="search" size={20} />
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ImageBackground>
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={20}
        keyboardShouldPersistTaps="handled"
      >
        <VideoCarousel posts={videos} />
        <PopularCarousel />
        <CategoryButtons onCagtegoryChanged={onCatChanged} />
        <Listings category={category} />
        <CitiesCarousel />
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  /** Header */
  content: {
    padding: 24,
    paddingTop: height * 0.8, // Adjust padding to account for the initial header height
    backgroundColor: "#F6F8FD",
  },
  header: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
  },
  headerBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start", // Align items to the left
    paddingLeft: 8, // Add some padding to the left if needed
    paddingRight: 8, // Add some padding to the left if needed
  },
  headerImage: {
    resizeMode: "cover",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    paddingBottom: 6,
  },

  inputWrapper: {
    backgroundColor: "rgba(255,255,255,0.3)",
    height: 48,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
  },
  input: {
    color: "white",
    paddingHorizontal: 16,
    paddingTop: 2,
    fontSize: 18,
    flex: 1,
  },
  inputIcon: {
    position: "absolute",
    right: 16,
    bottom: 15,
  },
  headerContent: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 5,
    paddingVertical: 16,
  },
  headerTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 0,
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  bottomSpacer: {
    height: 80,
    backgroundColor: "#F6F8FD",
  },
});
