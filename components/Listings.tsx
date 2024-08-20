import React, { useRef, useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Animated,
  Dimensions
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
  const flipAnimations = useRef(
    listings.reduce((acc, item) => {
      acc[item.id] = new Animated.Value(0);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [category]);

  const handleLongPress = (id: string) => {
    setExpandedItem(id);

    Animated.spring(flipAnimations[id], {
      toValue: 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (id: string) => {
    setExpandedItem(null);

    Animated.spring(flipAnimations[id], {
      toValue: 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const renderItem = ({ item }: { item: ListingType }) => {
    const flipAnimation = flipAnimations[item.id];

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
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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

            <Animated.View style={[styles.card, styles.cardBack, flipToBackStyle]}>
              <Image source={{ uri: item.image }} style={[styles.image, styles.flippedImage]} />
              <View style={styles.backContent}>
                <Text style={styles.backTitle}>{item.name}</Text>
                <Text style={styles.backDescription}>{item.description}</Text>
              </View>
            </Animated.View>
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
    backfaceVisibility: 'hidden',
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
  flippedImage: {
    opacity: 0.2,
  },
  backContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
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