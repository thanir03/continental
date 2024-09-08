import {
  Dimensions,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Pressable,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, SharedValue } from 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
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
}

type ViewToken = { item: Bookmark; isViewable: boolean };
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('screen');
const ITEM_WIDTH = width * 0.85;
const ITEM_HEIGHT = 200;

// ListItem Component
const ListItem: React.FC<{ item: Bookmark; viewableItems: SharedValue<ViewToken[]> }> = React.memo(({ item, viewableItems }) => {
  const rStyle = useAnimatedStyle(() => {
    // Use bookmarkId for checking visibility
    const isVisible = viewableItems.value.some(vItem => vItem.isViewable && vItem.item.bookmarkId === item.bookmarkId);
    
    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.5),
        },
      ],
    };
  }, [viewableItems, item]);

  return (
    <Animated.View style={[rStyle, styles.itemContainer]}>
      <Link href={`/listing/${item.hotelId}`} asChild>
        <Pressable>
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
              <View style={styles.bookmark}>
                <Ionicons name="bookmark-outline" size={20} color={Colors.white} />
              </View>
            </View>
          </View>
        </Pressable>
      </Link>
    </Animated.View>
  );
});

// Main Bookmark component
export default function Bookmark() {
  const [bookmark, setBookmark] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const viewableItems = useSharedValue<ViewToken[]>([]);

  useEffect(() => {
    fetch('http://10.0.2.2:5000/bookmark')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network Response not OK');
        }
        return response.json();
      })
      .then((data: Bookmark[]) => {
        setBookmark(data);
        setLoading(false);
      })
      .catch((err) => {
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
        <Text style={styles.errorText}>Error fetching data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/bookmark_wallpaper.jpg')}
        style={styles.headerBackground}
        imageStyle={styles.headerImage}
      >
        <TextAnimator
             content = "Bookmark"
             textStyle={styles.headerTitle}
          />
        <StatusBar hidden />
      </ImageBackground>
         
         <FlatList
          data={bookmark}
          contentContainerStyle={styles.contentContainer}
          onViewableItemsChanged={({ viewableItems: vItems }) => {
            // Use bookmarkId here
            viewableItems.value = vItems.map(vItem => ({ item: vItem.item as Bookmark, isViewable: vItem.isViewable }));
          }}
          renderItem={({ item }) => (
          <ListItem item={item} viewableItems={viewableItems} />
          )}
          keyExtractor={(item) => item.bookmarkId}
        />
       <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: 'black',
    textAlign: 'left',
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F8FD',
    justifyContent: 'flex-start',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    paddingBottom: 5,
    marginRight: 200,
    marginTop: 50,
  },
  itemContainer: {
    width: width,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    overflow: 'hidden',
    borderRadius: 20,
    justifyContent: 'flex-end',
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
  headerBackground: {
    height: height * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  contentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  bottomSpacer: {
    height: 80,
    backgroundColor: "#rgb(0,0,0,0.1)",
  },
});
