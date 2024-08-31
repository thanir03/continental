import React, { useState } from "react";
import { TextField } from "react-native-ui-lib";
import { Entypo } from "@expo/vector-icons";

interface PasswordInputFieldProps {
  onChangeText: (e: string) => void;
  value: string;
}

const PasswordInputField = (props: PasswordInputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <TextField
      containerStyle={{
        marginVertical: 10,
        backgroundColor: "white",
        paddingHorizontal: 10,
        borderRadius: 10,
      }}
      label="Password"
      placeholder="Enter your password"
      onChangeText={props.onChangeText}
      value={props.value}
      floatingPlaceholder
      enableErrors
      trailingAccessory={
        showPassword ? (
          <Entypo
            onPress={() => setShowPassword(false)}
            name="eye-with-line"
            size={24}
            color="black"
          />
        ) : (
          <Entypo
            onPress={() => setShowPassword(true)}
            name="eye"
            size={24}
            color="black"
          />
        )
      }
      secureTextEntry={!showPassword}
    />
  );
};

export default PasswordInputField;
