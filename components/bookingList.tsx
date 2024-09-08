import { StyleSheet, Text, View, FlatList, ActivityIndicator, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from "@/constants/Colors";
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons'; // Add Ionicons
import { FontAwesome5 } from '@expo/vector-icons'; // Add FontAwesome5

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

export default function BookingList() {
  const [booking, setBooking] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      return `${month} ${arrivalDay}-${departureDay}, ${year}`;
    } else {
      // Different month or year, return full date range: October 23, 2019 - November 5, 2019
      return `${arrival.toLocaleDateString('en-US', options)} - ${departure.toLocaleDateString('en-US', options)}`;
    }
  };

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

  const renderItem = ({ item }: { item: Booking }) => {
    return (
      <View style={styles.item}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.statusContainer}>
            <Ionicons name="checkmark-circle" size={14} color={"grey"} style={styles.icon} />
            <Text style={styles.status}>{item.status}</Text>
          </View>
          <View style={styles.datesContainer}>
            <Ionicons name="calendar-outline" size={14} color={"grey"} style={styles.icon} />
            <Text style={styles.dates}>
              {formatDateRange(item.arrivalDate, item.departureDate)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderHorizontalList = ({ item }: { item: Booking[] }) => {
    return (
      <FlatList
        data={item}
        renderItem={renderItem}
        keyExtractor={(item) => item.bookingId}
        scrollEnabled={false} // Disable vertical scroll
      />
    );
  };

  const groupedData = [];
  for (let i = 0; i < booking.length; i += 3) {
    groupedData.push(booking.slice(i, i + 3));
  }

  if (booking.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Bookings</Text>
        <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No bookings available</Text>
      </View>
     </View>

    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <Text style={styles.title}>Recent Booking</Text>
        <TouchableOpacity onPress={() => {
            router.push('/utilities/fullBooking');
          }}>
          <Text style={styles.viewMore}>View More</Text>
        </TouchableOpacity>
      </View>
      <StatusBar hidden />
      <FlatList
        data={groupedData}
        renderItem={renderHorizontalList}
        keyExtractor={(_, index) => index.toString()}
        horizontal={true}
        pagingEnabled={true} // Enable horizontal paging
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center" // Center the group of 3 items when scrolling
        decelerationRate="fast" // Faster snapping speed
        getItemLayout={(data, index) => (
          { length: Dimensions.get('window').width, offset: Dimensions.get('window').width * index, index }
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'black',
    textAlign: 'left',
    paddingLeft: 6,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  viewMore: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primaryColor,
    marginTop: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 5,
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
    width: Dimensions.get('window').width * 0.85, // Adjust width
  },
  image: {
    width: 70,
    height: 70,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    color: "grey",
  },
  datesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dates: {
    fontSize: 14,
    color: "grey",
  },
  icon: {
    marginRight: 6,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F6F8FD',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    padding: 20,
    height: 220,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: 'grey',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
  },
});
