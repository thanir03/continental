import { Dimensions, StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams } from "expo-router";
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';

// Define the types for Destination and City
type Listings = {
    hotelId: string;  // Assuming each hotel has a unique ID
    hotelName: string;
    hotelImage: string;
    location: string;
    price: number;
};

type City = {
    cityId: string;
    cityName: string;
};

// ListItem Component without animation logic
const ListItem: React.FC<{ item: Listings }> = React.memo(({ item }) => {
    return (
        <View style={styles.listItem}>
            <Image source={{ uri: item.hotelImage }} style={styles.destinationImage} />
            <Text style={styles.itemText}>{item.hotelName}</Text>
            <View style={styles.textContainer}>
                <Text style={styles.itemText}>Location: {item.location}</Text>
                <Text style={styles.priceText}>Price: ${item.price}</Text>
            </View>
        </View>
    );
});

const CityDetails = () => {
    const { height: screenHeight } = Dimensions.get('window');
    const { id } = useLocalSearchParams();
    const bottomSheetRef = useRef<BottomSheet>(null);

    const [city, setCity] = useState<City | null>(null);
    const [destinations, setDestinations] = useState<Listings[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const headerHeight = screenHeight * 0.10;
    const snapPoints = useMemo(() => ['15%', '50%', '90%'], []);

    useEffect(() => {
        fetch(`http://10.0.2.2:5000/city/hotels/${id}`)
         .then(response => {
            if(!response.ok){
                throw new Error('Network response was not ok');
            }
            return response.json()
         })
         .then(data => {
            console.log('CityDetails fetched successfully', data);
            setCity(data.city); 
            setDestinations(data.destinations);
            setLoading(false);
         })
         .catch(err => {
            console.error("Error fetching data", err);
            setError(err);
            setLoading(false);
         })
    }, [id])

    // Calculate the date range
     const currentDate = new Date();
     const startDate = new Date(currentDate);
     const endDate = new Date(currentDate);

     startDate.setDate(currentDate.getDate() + 7);
     endDate.setDate(currentDate.getDate() + 8);

     const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

     const formattedStartDateString = formatDate(startDate); // e.g., "September 15, 2024"
     const [month, day, year] = formattedStartDateString.split(' ');
     const formattedStartDay = startDate.getDate(); // e.g., 15
     const formattedEndDay = endDate.getDate(); // e.g., 16

     const dateRange = `${formattedStartDay}, ${formattedEndDay} ${month} ${year}`;

    // Sample coordinates for map region and markers
     const initialRegion: Region = {
        latitude: 37.78825, // Sample latitude
        longitude: -122.4324, // Sample longitude
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
     };

    // Sample markers (replace with real data)
    const markers = [
        {
            id: '1',
            title: 'Hotel A',
            description: 'Description A',
            coordinate: { latitude: 37.78825, longitude: -122.4324 },
        },
        {
            id: '2',
            title: 'Hotel B',
            description: 'Description B',
            coordinate: { latitude: 37.78845, longitude: -122.4314 },
        },
    ];

    if (loading) {
        return <ActivityIndicator size="large" color={Colors.primaryColor} />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <LinearGradient
                    colors={[Colors.primaryColor, '#5959e0']} // Gradient from primaryColor to light blue
                    start={{ x: 0, y: 0 }} // Start at the left
                    end={{ x: 1, y: 0 }} // End at the right
                    style={[styles.header, { height: headerHeight }]}
                >
                    {city && (
                        <>
                            <Text style={styles.title}>{city.cityName}</Text>
                            <Text style={styles.dateText}>{dateRange} - 1 Room, 1 Guest</Text>
                        </>
                    )}
                </LinearGradient>

                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={initialRegion}
                >
                    {markers.map((marker) => (
                        <Marker
                            key={marker.id}
                            coordinate={marker.coordinate}
                            title={marker.title}
                            description={marker.description}
                        />
                    ))}
                </MapView>

                <BottomSheet
                    ref={bottomSheetRef}
                    index={1}
                    snapPoints={snapPoints}
                    style={styles.bottomSheet}
                >
                    <BottomSheetFlatList
                        data={destinations}
                        keyExtractor={(item) => item.hotelId}
                        renderItem={({ item }) => <ListItem item={item} />}
                        contentContainerStyle={styles.contentContainer}
                        ListHeaderComponent={() => (
                            <Text style={styles.resultsCountText}>Number of results: {destinations.length}</Text>
                        )}
                    />
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
};

export default CityDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F8FD",
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        zIndex: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    dateText: {
        fontSize: 16,
        color: 'white',
    },
    map: {
        height: '100%',
        width: '100%',
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
        backgroundColor: "#F6F8FD",
        paddingBottom: 30,
    },
    listItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#6699CC',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '90%',
        alignSelf: 'center',
        paddingBottom: 10,
        margin: 15,
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    itemText: {
        color: '#333',
        fontWeight: "600",
        fontSize: 16,
        paddingHorizontal: 15,
    },
    destinationImage: {
        width: '100%',
        height: 140,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 10,
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primaryColor,
        paddingHorizontal: 15,
    },
    bottomSheet: {
        flex: 1,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    resultsCountText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
        color: Colors.primaryColor,
    },
});
