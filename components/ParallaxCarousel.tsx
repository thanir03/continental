import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';


const { width } = Dimensions.get('screen');
const ITEM_WIDTH = width * 0.85;
const ITEM_HEIGHT = 200;

const PopularCarousel = () => {
  const [popular, setPopular] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const scrollX = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetch('http://10.0.2.2:5000/popular')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('City Data fetched successfully:', data);
        setPopular(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.title}>Most Popular</Text>
      <Animated.FlatList
        data={popular}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        decelerationRate={0.4}
        snapToInterval={ITEM_WIDTH * 1.178}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-width, 0, width],
          });

          return (
            <Link href={`/listing/${item.hotelId}`} asChild>
              <Pressable>
              <View style={styles.itemContainer}>
                <View style={styles.imageContainer}>
                  <Animated.Image
                    source={{ uri: item.image }}
                    style={[
                      styles.image,
                      {
                        transform: [{ translateX }],
                      },
                    ]}
                  />
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
                    <View style={styles.bookmark}>
                      <Ionicons name="bookmark-outline" size={20} color={Colors.white} />
                    </View>
                  </View>
                </View>
              </View>
              </Pressable>
            </Link>
          );
        }}
      />
    </View>
  );
}

export default PopularCarousel;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: 'black',
    textAlign: 'left',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
  },
  itemContainer: {
    width: width,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    overflow: 'hidden',
    borderRadius: 20,
    justifyContent: 'flex-end', // Aligns text to the bottom
  },
  image: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  titleBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
  bookmark: {
    position: 'absolute',
    bottom: 150,
    right: 10,
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
