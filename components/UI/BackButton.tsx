import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface BackButtonProps {
  onBack: () => void;
}

const BackButton = (props: BackButtonProps) => {
  return (
    <TouchableWithoutFeedback onPress={props.onBack}>
      <View style={style.backBtn}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default BackButton;

const style = StyleSheet.create({
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
  },
});
