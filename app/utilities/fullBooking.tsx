import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, StatusBar, Image, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, SharedValue } from 'react-native-reanimated';
import Colors from "@/constants/Colors";
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Booking {
  bookingId: string;
  userId: string;
  hotelId: string;
  arrivalDate: string;
  departureDate: string;
  status: string;
  name: string;
  image: string;
  description: string;
  location: string;
}

const { height } = Dimensions.get('window');
type ViewToken = { item: Booking; isViewable: boolean };

// ListItem Component
const ListItem: React.FC<{ item: Booking; viewableItems: SharedValue<ViewToken[]> }> = React.memo(({ item, viewableItems }) => {
  const rStyle = useAnimatedStyle(() => {
    // Check if the item is visible
    const isVisible = viewableItems.value.some(vItem => vItem.isViewable && vItem.item.bookingId === item.bookingId);

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
    <Animated.View style={[styles.item, rStyle]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.status}>{item.status}</Text>
        <Text style={styles.dates}>
          {new Date(item.arrivalDate).toLocaleDateString()} - {new Date(item.departureDate).toLocaleDateString()}
        </Text>
      </View>
    </Animated.View>
  );
});

// BookingList Component
export default function FullBookingList() {
  const [booking, setBooking] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const viewableItems = useSharedValue<ViewToken[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('http://10.0.2.2:5000/booking/join')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network Response not OK');
        }
        return response.json();
      })
      .then((data: Booking[]) => {
        console.log('Booking data successfully loaded');
        setBooking(data);
        setLoading(false);
      })
      .catch((err) => {
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
        <Text style={styles.errorText}>Error fetching data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/booking_wallpaper.jpg')}
        style={styles.headerBackground}
        imageStyle={styles.headerImage}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/booking')}>
          <Ionicons name="arrow-back" size={24} color="#fff"/>
        </TouchableOpacity>
        <Text style={styles.title}>Booking List</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Current</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Past</Text>
        </TouchableOpacity>
    </View>
      </ImageBackground>
      <StatusBar hidden />
      <FlatList
        data={booking}
        contentContainerStyle={styles.contentContainer}
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          viewableItems.value = vItems.map(vItem => ({ item: vItem.item as Booking, isViewable: vItem.isViewable }));
        }}
        renderItem={({ item }) => (
          <ListItem item={item} viewableItems={viewableItems} />
        )}
        keyExtractor={(item) => item.bookingId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    height: height * 0.20,
    justifyContent: 'center',
    alignItems: 'center',

  },
  headerImage: {
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    width: 300,
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    alignSelf:"flex-start",
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
  backButton:{
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    bottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    
  },
  button: {
    width: 100,
    paddingVertical: 2,
    margin: 5, 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    textAlign: 'center',
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  buttonText: {
    fontSize: 16, // Set font size
    color: '#fff', // Set text color
  },
  contentContainer: {
    paddingTop: 5,
    paddingBottom: 20,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  status: {
    fontSize: 14,
    marginVertical: 5,
    color: Colors.primaryColor,
  },
  dates: {
    fontSize: 14,
    color: Colors.primaryColor,
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
    fontSize: 16,
    color: 'red',
  },
});