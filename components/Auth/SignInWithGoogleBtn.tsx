import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

interface SignInWithGoogleBtnProps {
  onLogin: () => void;
}

const SignInWithGoogleBtn = (props: SignInWithGoogleBtnProps) => {
  return (
    <TouchableOpacity onPress={props.onLogin}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          borderColor: "black",
          backgroundColor: "white",
          padding: 10,
          paddingVertical: 15,
          borderRadius: 10,
          gap: 10,
          width: "90%",
          margin: 0,
          marginHorizontal: "auto",
        }}
      >
        <Image
          source={require("@/assets/images/google.png")}
          style={{
            height: 20,
            width: 20,
          }}
        />
        <Text style={{ fontSize: 15 }}>Continue with Google</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SignInWithGoogleBtn;
