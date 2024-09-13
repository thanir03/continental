import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AuthProvider from "@/context/AuthProvider";
import { StripeProvider } from "@stripe/stripe-react-native";
import NetProvider from "@/context/NetProvider";

// SplashScreen.preventAutoHideAsync();

export default function _layout() {
  // const [loaded, error] = useFonts({
  //   Monserrat: require("@/assets/fonts/Montserrat.ttf"),
  // });

  // useEffect(() => {
  //   if (loaded || error) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded, error]);

  useEffect(() => {}, []);

  // if (!loaded && !error) {
  //   return null;
  // }

  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}
