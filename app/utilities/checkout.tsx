import { View, Text, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useStripe } from "@stripe/stripe-react-native";
import axios, { AxiosError } from "axios";
import { url } from "@/api/config";

export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await axios.post(`${url}/book/checkout`, {
        data: { bookingId: 1 },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5pcm0xMEBnbWFpbC5jb20iLCJhdXRoX3R5cGUiOiJwYXNzd29yZCIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJleHAiOjE3Mjg1NTM0MDF9.7ANrcIZYd3H3IjzW4JotMlYiOM4HdH9cXjbxCUBBNS4",
        },
      });
      return response.data;
    } catch (error) {
      console.log((error as AxiosError)?.response?.data);
    }
  };

  const initializePaymentSheet = async () => {
    const { client_secret } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Continental Inc.",
      paymentIntentClientSecret: client_secret,
      defaultBillingDetails: {
        name: "Thanirmalai",
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View>
      <Text>This is the checkout page</Text>
      <Button disabled={!loading} title="Checkout" onPress={openPaymentSheet} />
    </View>
  );
}
