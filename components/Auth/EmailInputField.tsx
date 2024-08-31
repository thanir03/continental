import { StyleSheet } from "react-native";
import React from "react";
import { TextField } from "react-native-ui-lib";

interface EmailInputFieldProps {
  onChangeText: (e: string) => void;
  value: string;
}

const EmailInputField = (props: EmailInputFieldProps) => {
  return (
    <TextField
      containerStyle={styles.container}
      placeholder={"Enter your email..."}
      onChangeText={props.onChangeText}
      value={props.value}
      floatingPlaceholder
      showClearButton
      enableErrors
    />
  );
};

export default EmailInputField;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
