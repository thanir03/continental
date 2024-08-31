import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthProvider";

export default function ProfileScreen() {
  const { onLogout } = useAuth();
  return (
    <SafeAreaView>
      <Link href={"/auth"}>Profile</Link>
      <Button title="Logout" onPress={onLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
