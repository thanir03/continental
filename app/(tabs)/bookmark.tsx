import React, { useCallback, useState } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Pressable,
  Image,
  ImageBackground,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from "react-native-reanimated";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link, router } from "expo-router";
import TextAnimator from "@/TypingAnimations/TextAnimator";
import { getLikedHotels } from "@/api/Hotel";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/context/AuthProvider";

interface LikedHotels {
  address: string;
  agoda_url: string;
  category: string;
  city: string;
  desc: string;
  id: number;
  img: string;
  lat: string;
  lng: string;
  name: string;
  price: number;
  rating: string;
}

type ViewToken = { item: LikedHotels; isViewable: boolean };
const { height } = Dimensions.get("window");

// ListItem Component
const ListItem = ({
  item,
  viewableItems,
}: {
  item: LikedHotels;
  viewableItems: SharedValue<ViewToken[]>;
}) => {
  const rStyle = useAnimatedStyle(() => {
    const isVisible = viewableItems.value.some(
      (vItem) => vItem.isViewable && vItem.item.id === item.id
    );
    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [{ scale: withTiming(isVisible ? 1 : 0.5) }],
    };
  }, [viewableItems, item]);
  const nameList = item.name.split(" ");
  const name = nameList.slice(0, Math.min(nameList.length, 5)).join(" ");
  return (
    <Animated.View style={[styles.item, rStyle]}>
      <Link href={`/hotel/${item.id}`} asChild>
        <Pressable style={styles.pressable}>
          <Image source={{ uri: item.img }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.locationContainer}>
              <FontAwesome5
                name="map-marker-alt"
                size={14}
                color={Colors.primaryColor}
                style={{ paddingTop: 5 }}
              />
              <Text style={styles.locationText}>{item.city}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={Colors.primaryColor} />
              <Text style={styles.ratingText}> {item.rating}</Text>
              <Text style={styles.priceText}>RM {item.price}</Text>
            </View>
            <Ionicons
              name="bookmark"
              size={20}
              color={Colors.primaryColor}
              style={styles.bookmarkIcon}
            />
          </View>
        </Pressable>
      </Link>
    </Animated.View>
  );
};

// Main Bookmark Component
const BookmarkScreen = () => {
  const [bookmarks, setBookmarks] = useState<LikedHotels[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const { isLoggedIn } = useAuth();

  const fn = useCallback(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    getLikedHotels()
      .then((data) => {
        setBookmarks(data as any);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    return () => {};
  }, [isLoggedIn]);

  // To rerun the effect when the page is navigated
  useFocusEffect(fn);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching data: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/bookmark_wallpaper.jpg")}
        style={styles.headerBackground}
        imageStyle={styles.headerImage}
      >
        <TextAnimator content="Liked" textStyle={styles.headerTitle} />
        <Text style={styles.secondaryTitle}>Find your perfect stay</Text>
        <StatusBar hidden />
      </ImageBackground>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="grey" />
        </View>
      )}
      {!isLoggedIn && (
        <View
          style={{
            height: Dimensions.get("screen").height * 0.5,
            padding: 20,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            It looks like you are not logged in.
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            To view your liked items, please log in to your account.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "black",
              padding: 10,
              borderRadius: 10,
              marginTop: 10,
            }}
            onPress={() => router.push(`/auth?next=/liked`)}
          >
            <Text style={{ textAlign: "center", color: "white" }}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
      {isLoggedIn && bookmarks.length > 0 && (
        <FlatList
          data={bookmarks}
          renderItem={({ item }) => (
            <ListItem item={item} viewableItems={viewableItems} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.contentContainer}
          onViewableItemsChanged={({ viewableItems: vItems }) => {
            viewableItems.value = vItems.map((vItem) => ({
              item: vItem.item as LikedHotels,
              isViewable: vItem.isViewable,
            }));
          }}
        />
      )}
      {isLoggedIn && bookmarks.length == 0 && (
        <View
          style={{
            height: Dimensions.get("screen").height * 0.5,
            padding: 20,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            No Liked Hotels
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "black",
              padding: 10,
              borderRadius: 10,
              marginTop: 10,
            }}
            onPress={() => router.push(`/booking`)}
          >
            <Text style={{ textAlign: "center", color: "white" }}>
              View Hotels
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.bottomSpacer} />
    </View>
  );
};

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FD",
  },
  headerBackground: {
    width: "100%",
    height: height * 0.2,
    justifyContent: "center",
  },
  headerImage: {
    resizeMode: "cover",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    paddingLeft: 20,
    color: "#fff",
    marginTop: 50,
    textAlign: "center",
  },
  secondaryTitle: {
    fontSize: 20,
    fontWeight: "400",
    paddingLeft: 20,
    color: "#fff",
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressable: {
    flexDirection: "row",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  locationText: {
    fontSize: 14,
    paddingTop: 5,
    marginLeft: 5,
    color: "grey",
  },
  priceText: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginLeft: 145,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 5,
  },
  ratingText: {
    fontSize: 14,
    color: "grey",
  },
  bookmarkIcon: {
    position: "absolute",
    top: 2,
    right: 2,
    color: Colors.primaryColor,
  },
  loadingContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  bottomSpacer: {
    height: 20,
    backgroundColor: "#F6F8FD",
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 80,
  },
});

export default BookmarkScreen;
