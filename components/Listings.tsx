import React, { useRef, useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { ListingType } from '@/types/listingType';
import Colors from '@/constants/Colors';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

type Props = {
  listings: ListingType[];
  category: string;
};

const { width } = Dimensions.get('screen');

const Listings = ({ listings, category }: Props) => {
  const [loading, setLoading] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Using a ref to store Animated.Values for each listing
  const flipAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  // Initialize the animation for a given id if it doesn't exist
  const initializeAnimation = (id: string) => {
    if (!flipAnimations[id]) {
      flipAnimations[id] = new Animated.Value(0);
    }
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
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

  const renderItem = ({ item }: { item: ListingType }) => {
    const flipAnimation = flipAnimations[item.id] || new Animated.Value(0);

    const frontInterpolate = flipAnimation.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnimation.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });

    const flipToFrontStyle = {
      transform: [{ rotateY: frontInterpolate }],
    };

    const flipToBackStyle = {
      transform: [{ rotateY: backInterpolate }],
    };

    return (
      <Link href={`/listing/${item.id}`} asChild>
        <Pressable
          onLongPress={() => handleLongPress(item.id)}
          onPressOut={() => handlePressOut(item.id)}
        >
          <View style={styles.cardContainer}>
            <Animated.View style={[styles.card, flipToFrontStyle]}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.titleBox}>
                  <Text style={styles.itemTxt} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.infoContainer}>
                    <View style={styles.locationContainer}>
                      <FontAwesome5 name="map-marker-alt" size={18} color={Colors.primaryColor} />
                      <Text style={styles.itemLocationTxt}>{item.location}</Text>
                    </View>
                    <Text style={styles.itemPriceTxt}>${item.price}</Text>
                  </View>
                </View>
                <View style={styles.bookmark}>
                  <Ionicons name="bookmark-outline" size={20} color={Colors.white} />
                </View>
              </View>
            </Animated.View>

            {expandedItem === item.id && (
              <Animated.View style={[styles.card, styles.cardBack, flipToBackStyle]}>
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
      <FlatList
        data={loading ? [] : listings}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Listings;

const styles = StyleSheet.create({
  cardContainer: {
    width: width / 2,
    height: 230,
    marginRight: 20,
    position: 'relative',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    position: 'absolute',
    backfaceVisibility: 'hidden', // Prevent flicker during rotation
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  titleBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 5,
    paddingLeft: 5,
    paddingRight: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  bookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 30,
  },
  itemTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  itemLocationTxt: {
    fontSize: 12,
    marginLeft: 5,
    color: Colors.white,
  },
  itemPriceTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  cardBack: {
    backgroundColor: '#5C8374',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#5C8374',
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  backTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 10,
  },
  backDescription: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});