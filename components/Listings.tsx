import React, { useRef, useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { ListingType } from "@/types/listingType";
import Colors from "@/constants/Colors";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { getHotelByCategory } from "@/api/Hotel";

type Props = {
  category: string;
  listingData?: ListingType[];
  height?: number;
  width?: number;
};

const { width: screenWidth } = Dimensions.get("screen");

const Listings = ({
  category,
  height = 230,
  width = screenWidth / 2,
}: Props) => {
  const [destinations, setDestinations] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const flipAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  const initializeAnimation = (id: string) => {
    if (!flipAnimations[id]) {
      flipAnimations[id] = new Animated.Value(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getHotelByCategory(category);
        setDestinations(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const updateData = async () => {
      await fetchData(); // Fetch the data afterward
    };

    updateData();
  }, [category]);

  const handleLongPress = (id: string) => {
    initializeAnimation(id);
    const animationValue = flipAnimations[id];

    if (animationValue) {
      setExpandedItem(id);
      Animated.spring(animationValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = (id: string) => {
    const animationValue = flipAnimations[id];

    if (animationValue) {
      setExpandedItem(null);
      Animated.spring(animationValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const flipAnimation = flipAnimations[item.hotelId] || new Animated.Value(0);

    const frontInterpolate = flipAnimation.interpolate({
      inputRange: [0, 180],
      outputRange: ["0deg", "180deg"],
    });

    const backInterpolate = flipAnimation.interpolate({
      inputRange: [0, 180],
      outputRange: ["180deg", "360deg"],
    });

    const flipToFrontStyle = {
      transform: [{ rotateY: frontInterpolate }],
    };

    const flipToBackStyle = {
      transform: [{ rotateY: backInterpolate }],
    };

    return (
      <Link href={`/hotel/${item.id}`} asChild>
        <Pressable
          onLongPress={() => handleLongPress(item.hotelId)}
          onPressOut={() => handlePressOut(item.hotelId)}
        >
          <View style={[styles.cardContainer, { height, width }]}>
            <Animated.View style={[styles.card, flipToFrontStyle]}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image_url }} style={styles.image} />
                <View style={styles.titleBox}>
                  <Text style={styles.itemTxt} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.infoContainer}>
                    <View style={styles.locationContainer}>
                      <FontAwesome5
                        name="map-marker-alt"
                        size={18}
                        color={Colors.primaryColor}
                      />
                      <Text style={styles.itemLocationTxt}>{item.city}</Text>
                    </View>
                    <Text style={styles.itemPriceTxt}>RM {item.price}</Text>
                  </View>
                </View>
                <View style={styles.bookmark}>
                  <Ionicons
                    name="bookmark-outline"
                    size={20}
                    color={Colors.white}
                  />
                </View>
              </View>
            </Animated.View>

            {expandedItem === item.hotelId && (
              <Animated.View
                style={[styles.card, styles.cardBack, flipToBackStyle]}
              >
                <View style={styles.backContent}>
                  <Text style={styles.backTitle}>{item.name}</Text>
                  <Text style={styles.backDescription}>{item.description}</Text>
                </View>
              </Animated.View>
            )}
          </View>
        </Pressable>
      </Link>
    );
  };

  return (
    <View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={loading ? [] : destinations}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Listings;

const styles = StyleSheet.create({
  cardContainer: {
    //width: screenWidthwidth / 2,
    //height: 230,
    marginRight: 20,
    position: "relative",
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    position: "absolute",
    backfaceVisibility: "hidden", // Prevent flicker during rotation
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  titleBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 5,
    paddingLeft: 5,
    paddingRight: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  bookmark: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 30,
  },
  itemTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  itemLocationTxt: {
    fontSize: 12,
    marginLeft: 5,
    color: Colors.white,
  },
  itemPriceTxt: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.white,
  },
  cardBack: {
    backgroundColor: "#5C8374",
    justifyContent: "center",
    alignItems: "center",
  },
  backContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  backTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 10,
  },
  backDescription: {
    fontSize: 14,
    color: Colors.white,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
