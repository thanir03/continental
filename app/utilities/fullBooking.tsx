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

const formatDateRange = (arrivalDate: string, departureDate: string) => {
  const options = { month: 'long', day: 'numeric', year: 'numeric' } as const;

  const arrival = new Date(arrivalDate);
  const departure = new Date(departureDate);

  const arrivalDay = arrival.getDate();
  const departureDay = departure.getDate();
  const month = arrival.toLocaleDateString('en-US', { month: 'long' });
  const year = arrival.getFullYear();

  if (arrival.getMonth() === departure.getMonth() && arrival.getFullYear() === departure.getFullYear()) {
    // Same month and year, return in format: October 23-25, 2019
    return `${month} ${arrivalDay} - ${departureDay}, ${year}`;
  } else {
    // Different month or year, return full date range: October 23, 2019 - November 5, 2019
    return `${arrival.toLocaleDateString('en-US', options)} - ${departure.toLocaleDateString('en-US', options)}`;
  }
};

const ListItem: React.FC<{ item: Booking; viewableItems: SharedValue<ViewToken[]> }> = React.memo(({ item, viewableItems }) => {
  const rStyle = useAnimatedStyle(() => {
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
        
        {/* Status with Icon */}
        <View style={styles.row}>
          <Ionicons name="checkmark-circle" size={16} color={Colors.primaryColor} style={styles.icon} />
          <Text style={styles.status}>{item.status}</Text>
        </View>

        {/* Dates with Icon */}
        <View style={styles.row}>
          <Feather name="calendar" size={16} color={Colors.primaryColor} style={styles.icon} />
          <Text style={styles.dates}>
             {formatDateRange(item.arrivalDate, item.departureDate)}
          </Text>
        </View>
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
        
     <View style={[styles.buttonContainer]}>
        <TouchableOpacity style={[styles.button]}>
           <Text style={styles.buttonText}>All</Text>
        </TouchableOpacity>
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
    backgroundColor: '#F6F8FD',
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
    paddingTop: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  button: {
    paddingVertical: 5,
    margin: 5, 
    paddingHorizontal: 15, 
    borderRadius: 10, 
    textAlign: 'center',
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  buttonText: {
    fontSize: 16, // Set font size
    color: '#fff', // Set text color
    fontWeight: "500",
  },
  contentContainer: {
    paddingTop: 10,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#333",
  },
  status: {
    fontSize: 14,
    marginVertical: 5,
    color: '#00AFF0',
  },
  dates: {
    fontSize: 14,
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
    fontSize: 16,
    color: 'red',
  },
});