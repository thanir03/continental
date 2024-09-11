import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, SharedValue } from 'react-native-reanimated';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Colors from "@/constants/Colors";
import { Link } from 'expo-router';
import TextAnimator from "@/TypingAnimations/TextAnimator";

interface Bookmark {
  bookmarkId: string;
  userId: string;
  hotelId: string;
  username: string;
  name: string;
  image: string;
  location: string;
  price: string;
  rating: number;
}

type ViewToken = { item: Bookmark; isViewable: boolean };
const { width, height } = Dimensions.get('window');

// ListItem Component
const ListItem = ({ item, viewableItems }: { item: Bookmark; viewableItems: SharedValue<ViewToken[]> }) => {
  const rStyle = useAnimatedStyle(() => {
    const isVisible = viewableItems.value.some(vItem => vItem.isViewable && vItem.item.bookmarkId === item.bookmarkId);
    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [{ scale: withTiming(isVisible ? 1 : 0.5) }],
    };
  }, [viewableItems, item]);

  return (
    <Animated.View style={[styles.item, rStyle]}>
      <Link href={`/listing/${item.hotelId}`} asChild>
        <Pressable style={styles.pressable}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.locationContainer}>
              <FontAwesome5 name="map-marker-alt" size={14} color={Colors.primaryColor} style={{paddingTop:5}} />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={Colors.primaryColor} />
              <Text style={styles.ratingText}> {item.rating}</Text>
              <Text style={styles.priceText}>${item.price}</Text>
            </View>
            </View>
        </Pressable>
      </Link>
    </Animated.View>
  );
};

// Main Bookmark Component
const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewableItems = useSharedValue<ViewToken[]>([]);

  useEffect(() => {
    fetch('http://10.0.2.2:5000/bookmark')
      .then(response => {
        if (!response.ok) throw new Error('Network Response not OK');
        return response.json();
      })
      .then(data => {
        setBookmarks(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="grey" /></View>;
  }
  if (error) {
    return <View style={styles.errorContainer}><Text style={styles.errorText}>Error fetching data: {error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('@/assets/images/bookmark_wallpaper.jpg')} style={styles.headerBackground} imageStyle={styles.headerImage}>
        <TextAnimator content="Bookmarks" textStyle={styles.headerTitle} />
        <Text style = {styles.secondaryTitle}>Find your perfect stay</Text>
        <StatusBar hidden />
      </ImageBackground>
      <FlatList
        data={bookmarks}
        renderItem={({ item }) => <ListItem item={item} viewableItems={viewableItems} />}
        keyExtractor={(item) => item.bookmarkId}
        contentContainerStyle={styles.contentContainer}
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          viewableItems.value = vItems.map(vItem => ({ item: vItem.item as Bookmark, isViewable: vItem.isViewable }));
        }}
      />
      <View style={styles.bottomSpacer} />
    </View>
  );
};

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FD',
  },
  headerBackground: {
    width: '100%',
    height: height * 0.2,
    justifyContent: 'center',
    
  },
  headerImage: {
    resizeMode: 'cover',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    paddingLeft: 20,
    color: '#fff',
    marginTop: 50,
    textAlign: 'center',
  },
  secondaryTitle: {
    fontSize: 20,
    fontWeight: "400",
    paddingLeft: 20,
    color: '#fff',
  },
  item: {
    height: 100,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: "flex-start",
    shadowColor: '#6699CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressable: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color : '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  locationText: {
    fontSize: 14,
    paddingTop:5,
    marginLeft: 5,
    fontWeight: '500',
    color: "#00AFF0",
  },
  priceText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginLeft: 165,
    marginBottom:20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#00AFF0',
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
  bottomSpacer: {
    height: 20,
    backgroundColor: '#F6F8FD',
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 80,
  },
});

export default Bookmark;
