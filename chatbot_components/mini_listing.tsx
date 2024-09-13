import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, Pressable, Image, Dimensions } from 'react-native';
import { ListingType } from '@/types/listingType';
import Colors from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { Link } from 'expo-router';

type Props = {
  category: string;
  listingData?: ListingType[];
  height?: number;
  width?: number;
};

const { width: screenWidth } = Dimensions.get('screen');

// Static Data
const defaultListings: ListingType[] = [
  {
    hotelId: "18",
    name: "Urban Oasis",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=3452&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Discover a peaceful oasis amidst the bustling cityscape, where lush gardens and tranquil ponds provide respite.",
    rating: 4.8,
    price: "90",
    duration: "3",
    location: "Germany",
    category: "Cities",
    cityId: "8",
  },
  {
    hotelId: "19",
    name: "Whispering Woods Retreat",
    image: "https://images.unsplash.com/photo-1574288339398-531d55fd84f3?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Find solace in the tranquil embrace of whispering woods, where ancient trees and hidden streams beckon the soul.",
    rating: 4.9,
    price: "140",
    duration: "3",
    location: "Kyoto",
    category: "Forests",
    cityId: "5",
  },
  {
    hotelId: "20",
    name: "Sapphire Shores Beach Resort",
    image: "https://plus.unsplash.com/premium_photo-1681223447383-402912b83029?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Experience the epitome of luxury beachfront living with sapphire waters, pristine sands, and world-class amenities.",
    rating: 4.7,
    price: "150",
    duration: "3",
    location: "USA",
    category: "Beaches",
    cityId: "11",
  },
];

const MiniListings = ({ category, listingData = defaultListings, height = 120, width = screenWidth / 2}: Props) => {
  const [destinations, setDestinations] = useState<ListingType[]>(listingData);

  const renderItem = ({ item }: { item: ListingType }) => (
    <Link href={`/listing/${item.hotelId}`} asChild>
      <Pressable>
        <View style={[styles.cardContainer, { height, width }]}>
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.titleBox}>
                <Text style={styles.itemTxt} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.infoContainer}>
                  <View style={styles.locationContainer}>
                    <FontAwesome5 name="map-marker-alt" size={12} color={Colors.white} />
                    <Text style={styles.itemLocationTxt}>{item.location}</Text>
                  </View>
                  <Text style={styles.itemPriceTxt}>${item.price}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <View>
      <FlatList
        data={destinations}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default MiniListings;

const styles = StyleSheet.create({
  cardContainer: {
    padding:10,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'light-grey',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 5,
    paddingVertical:3,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  itemTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLocationTxt: {
    fontSize: 10,
    marginLeft: 5,
    color: Colors.white,
  },
  itemPriceTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
});
