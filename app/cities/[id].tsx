import { StyleSheet, Text, View } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from 'react'

const CitiesDetails = () => {
    const { id } = useLocalSearchParams();
    return(
        <View>
            <Text>City details {id}</Text>
        </View>
    ) 
}

export default CitiesDetails;

const styles = StyleSheet.create({})