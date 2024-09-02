import { StyleSheet, Text, View } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from 'react'

const ListingDetails = () => {
    const { hotelId } = useLocalSearchParams();
    return(
        <View>
            <Text>Listing details {hotelId}</Text>
        </View>
    ) 
}

export default ListingDetails;

const styles = StyleSheet.create({})