import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, Pressable, Dimensions } from 'react-native';
import Colors from "@/constants/Colors";

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

const bookmarks = [
  {
    bookmarkId: "1",
    userId: "1",
    hotelId: "1",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "USA",
    name: "Tropical Paradise Resort",
    price: "150",
    rating: 4.8,
    username: "Jingjia"
  },
  {
    bookmarkId: "2",
    hotelId: "5",
    image: "https://images.unsplash.com/photo-1535927583620-7940e95a5a05?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8bGFrZSx0cmFucXVpbHx8fHx8fDE3MTEwMzI1MjA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1600",
    location: "England",
    name: "Tranquil Lakeside Haven",
    price: "120",
    rating: 4.9,
    userId: "1",
    username: "Jingjia"
  },
  {
    bookmarkId: "3",
    hotelId: "3",
    image: "https://images.unsplash.com/photo-1546436836-07a91091f160?q=80&w=3548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "USA",
    name: "Urban Explorer's Dream",
    price: "140",
    rating: 4.7,
    userId: "1",
    username: "Jingjia"
  },
];

const ListItem = ({ item }: { item: Bookmark }) => {
  return (
    <Pressable style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const MiniBookmarkList = () => {
  return (
    <FlatList
      data={bookmarks}
      renderItem={({ item }) => <ListItem item={item} />}
      keyExtractor={(item) => item.bookmarkId}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#F6F8FD',
  },
  item: {
    width: Dimensions.get('window').width * 0.75, // Smaller width for each item
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: "#00AFF0",
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#00AFF0',
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginLeft: 10,
  },
});

export default MiniBookmarkList;