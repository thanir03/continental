import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ToastAndroid,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import SignInWithGoogleBtn from "@/components/Auth/SignInWithGoogleBtn";
import EmailInputField from "@/components/Auth/EmailInputField";
import PasswordInputField from "@/components/Auth/PasswordInputField";
import RedirectComponent from "@/components/Auth/RedirectComponent";
import BackButton from "@/components/UI/BackButton";
import { useAuth } from "@/context/AuthProvider";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseErrorMsg, setResponseErrorMsg] = useState("");
  const { onLoginWithGoogle, onLoginWithPassword, isLoggedIn } = useAuth();
  const params = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.back();
    }
  }, []);

  const handlePasswordLogin = async () => {
    Keyboard.dismiss();
    setResponseErrorMsg("");
    if (!email.trim() || !password.trim()) {
      setResponseErrorMsg("Empty email or password");
      return;
    }
    const response = await onLoginWithPassword(email, password);
    if (response.status) {
      setTimeout(() => {
        router.navigate("/");
      }, 1000);
    } else {
      setResponseErrorMsg(response.message);
      ToastAndroid.show(response.message, ToastAndroid.SHORT);
    }
  };

  const handleLoginWithGoogle = async () => {
    Keyboard.dismiss();
    try {
      const response = await onLoginWithGoogle();
      if (response.status == true) {
        setTimeout(() => {
          if (params.next) {
            router.navigate(params.next as any);
          } else {
            router.navigate("/");
          }
        }, 1000);
      } else {
        setResponseErrorMsg(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <BackButton onBack={() => router.back()} />
      <Text style={style.title}>Login with Continental</Text>
      <View style={style.loginForm}>
        <EmailInputField onChangeText={(e) => setEmail(e)} value={email} />
        <PasswordInputField
          onChangeText={(e) => setPassword(e)}
          value={password}
        />
        <TouchableWithoutFeedback onPress={handlePasswordLogin}>
          <View style={style.signInButton}>
            <Text style={style.signInText}>Sign in</Text>
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
        mainText="Don't have an account yet?"
        href={"/auth/register"}
        linkText="Sign up"
      />
    </SafeAreaView>
  );
};

export default LoginScreen;

const style = StyleSheet.create({
  title: {
    fontSize: 25,
    marginTop: 150,
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
  signInButton: {
    borderRadius: 10,
    backgroundColor: "#000",
    padding: 10,
    paddingVertical: 15,
  },
  signInText: {
    textAlign: "center",
    color: "#fff",
  },
});
