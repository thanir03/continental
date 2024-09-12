import { StyleSheet, Text, Button, Image, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PasswordUser, useAuth } from "@/context/AuthProvider";
import { User } from "@react-native-google-signin/google-signin";

export default function ProfileScreen() {
  const { onLogout, user, isLoggedIn, authType } = useAuth();

  return (
    <SafeAreaView>
      <Link href={"/auth"}>Profile</Link>
      <Link href={"/utilities/checkout"}>Checkout</Link>
      <Button title="Logout" onPress={onLogout} />
      {isLoggedIn && authType === "oauth_google" && user && (
        <Image
          source={{ uri: (user as User).user!.photo! }}
          style={{ height: 50, width: 50, borderRadius: 100 }}
        />
      )}
      <Text>{isLoggedIn ? "Logged In" : "Not Logged In"}</Text>
      {isLoggedIn && authType === "password" && user && (
        <View
          style={{
            backgroundColor: "red",
            width: 50,
            height: 50,
            justifyContent: "center",
            borderRadius: 100,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 20 }}>
            {(user as PasswordUser).name[0]}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
