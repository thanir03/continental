import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthProvider from "@/context/AuthProvider";
import { StripeProvider } from "@stripe/stripe-react-native";
import NetProvider from "@/context/NetProvider";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { migrateDB } from "@/db/db";

export default function _layout() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="client.db" onInit={migrateDB}>
        <NetProvider>
          <StripeProvider
            publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY!}
          >
            <AuthProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(tabs)" />
              </Stack>
            </AuthProvider>
          </StripeProvider>
        </NetProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
