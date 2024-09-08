import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useLocalSearchParams } from 'expo-router';
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate } from 'react-native-reanimated';

const images = [
  'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=3452&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1673285286436-aaeab0b9aec8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8fHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1529154036614-a60975f5c760?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  // Add more image URLs as needed
];

const IMG_HEIGHT = 350; // Use your IMG_HEIGHT constant

const ListingDetails = () => {
    const { hotelId } = useLocalSearchParams();
    const scrollOffset = useSharedValue(0);

    // Handle scroll events with react-native-reanimated
    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollOffset.value = event.contentOffset.y;
    });

    // Animated styles for the PagerView images
    const animatedImageStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT],
                        [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
                    ),
                },
                {
                    scale: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT],
                        [2, 1, 1]
                    ),
                },
            ],
        };
    });

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
            >
                <PagerView style={styles.pagerView} initialPage={0}>
                    {images.map((image, index) => (
                        <View key={index} style={styles.page}>
                            <Animated.Image
                                source={{ uri: image }}
                                style={[styles.image, animatedImageStyle]}
                            />
                        </View>
                    ))}
                </PagerView>
                <View style={styles.details}>
                    <Text>Listing details {hotelId}</Text>
                    <View style={{ padding: 1000 }} />
                </View>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pagerView: {
        height: IMG_HEIGHT,
    },
    page: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    details: {
        padding: 16,
    },
});

export default ListingDetails;
