import { StyleSheet, Text, View } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from 'react'

const ListingDetails = () => {
    const { id } = useLocalSearchParams();
    return(
        <View>
            <Text>Listing details {id}</Text>
        </View>
    ) 
}

export default ListingDetails;

const styles = StyleSheet.create({})