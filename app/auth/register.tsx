import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ToastAndroid,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import EmailInputField from "@/components/Auth/EmailInputField";
import PasswordInputField from "@/components/Auth/PasswordInputField";
import SignInWithGoogleBtn from "@/components/Auth/SignInWithGoogleBtn";
import RedirectComponent from "@/components/Auth/RedirectComponent";
import BackButton from "@/components/UI/BackButton";
import { validatePassword } from "@/utils/helper";
import { useAuth } from "@/context/AuthProvider";
import { TextField } from "react-native-ui-lib";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");

  const [password, setPassword] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [nameErrorMsg, setNameErrorMsg] = useState("");

  const [responseErrorMsg, setResponseErrorMsg] = useState("");
  const { onLoginWithGoogle, onRegisterWithPassword } = useAuth();

  const handleRegisterAccount = async () => {
    Keyboard.dismiss();
    setResponseErrorMsg("");

    let isValid = true;
    if (!validatePassword(password)) {
      isValid = false;
      setPasswordErrorMsg(
        "Password must consist of at least one digit, one special, uppercase, lowercase character and minimum length of 5 characters"
      );
    } else {
      setPasswordErrorMsg("");
    }
    if (!email.includes("@")) {
      isValid = false;
      setEmailErrorMsg("Invalid email");
    } else {
      setEmailErrorMsg("");
    }
    if (name.length < 4) {
      console.log("Executed");
      isValid = false;
      setNameErrorMsg("Name length must be more than 4 characters");
    } else {
      setNameErrorMsg("");
    }
    if (!isValid) return;

    const response = await onRegisterWithPassword(email, password, name);
    if (response.status == true) {
      setTimeout(() => {
        router.navigate("/");
      }, 1000);
    } else {
      setResponseErrorMsg(response.message);
      ToastAndroid.show(response.message, ToastAndroid.LONG);
    }
  };

  const handleLoginWithGoogle = async () => {
    Keyboard.dismiss();
    try {
      const response = await onLoginWithGoogle();
      if (response.status == true) {
        setTimeout(() => {
          router.navigate("/");
        }, 1000);
      } else {
        setResponseErrorMsg(response.message);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <BackButton onBack={router.back} />
      <Text style={style.title}>Register with Continental</Text>
      <View style={style.loginForm}>
        <TextField
          containerStyle={style.container}
          placeholder={"Enter your name"}
          onChangeText={(e) => setName(e)}
          value={name}
          floatingPlaceholder
          showClearButton
          enableErrors
        />
        {nameErrorMsg && <Text style={{ color: "red" }}>{nameErrorMsg}</Text>}
        <EmailInputField value={email} onChangeText={(e) => setEmail(e)} />
        {emailErrorMsg && <Text style={{ color: "red" }}>{emailErrorMsg}</Text>}
        <PasswordInputField
          value={password}
          onChangeText={(e) => setPassword(e)}
        />
        {passwordErrorMsg && (
          <Text style={{ color: "red", maxHeight: 60 }}>
            {passwordErrorMsg}
          </Text>
        )}
        <TouchableWithoutFeedback
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleRegisterAccount}
        >
          <View
            style={{
              borderRadius: 10,
              backgroundColor: "#000",
              padding: 10,
              paddingVertical: 15,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
              }}
            >
              Sign up
            </Text>
          </View>
        </TouchableWithoutFeedback>
        {responseErrorMsg && (
          <Text style={{ color: "red", textAlign: "center" }}>
            {responseErrorMsg}
          </Text>
        )}
      </View>
      <Text style={{ textAlign: "center", margin: 20 }}>OR</Text>
      <SignInWithGoogleBtn onLogin={handleLoginWithGoogle} />
      <RedirectComponent
        mainText="Already have an account!"
        href={"/auth"}
        linkText="Sign in"
      />
    </SafeAreaView>
  );
};

export default RegisterScreen;

const style = StyleSheet.create({
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  container: {
    marginVertical: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 25,
    marginTop: 100,
    textAlign: "center",
    fontFamily: "Monserrat",
    fontWeight: "bold",
  },
  loginForm: {
    padding: 20,
    gap: 10,
  },
  textField: {
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
  },
});
