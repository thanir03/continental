import { StyleSheet, Text, View } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from 'react'

const BookingDetails = () => {
    const { id } = useLocalSearchParams();
    return(
        <View>
            <Text>Booking details {id}</Text>
        </View>
    ) 
}

export default BookingDetails;

const styles = StyleSheet.create({})