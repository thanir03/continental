import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import {
  googleOauthAuthentication,
  loginUser,
  registerUser,
  validateAccessToken,
} from "@/api/Auth";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT,
  offlineAccess: true,
});

interface PasswordUser {
  email: string;
  password: string;
  auth_type: string;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<PasswordUser | User | null>(null);
  const [accessToken, setAccessToken] = useState<string>("");

  const checkIfUserIsLoggedIn = async () => {
    try {
      const user = await AsyncStorage.getItem("@user");
      if (!user) {
        handleLogout();
        return;
      }
      const authMethod = (await AsyncStorage.getItem("@auth_type"))!;
      const accessToken = (await AsyncStorage.getItem("@access_token"))!;
      let oauthUserInfo;
      if (authMethod === "oauth_google") {
        const hasLoggedInBefore = GoogleSignin.hasPreviousSignIn();
        if (!hasLoggedInBefore) {
          handleLogout();
          return;
        }
        oauthUserInfo = await GoogleSignin.signInSilently();
      }
      const response = await validateAccessToken(accessToken);
      if (!response.status) {
        handleLogout();
        return;
      }
      _onLogin(
        authMethod,
        accessToken,
        response.user.email,
        authMethod === "oauth_google"
          ? oauthUserInfo
          : response.user ?? JSON.parse(user)
      );
    } catch (error) {}
  };

  useEffect(() => {
    checkIfUserIsLoggedIn();
  }, []);

  useEffect(() => {
    const fn = async () => {
      console.log("----");
      console.log("Is Logged In", isLoggedIn);
      console.log("user state", user);
      console.log("accessToken", await AsyncStorage.getItem("@access_token"));
      console.log("user store", await AsyncStorage.getItem("@user"));
      console.log("auth_type store", await AsyncStorage.getItem("@auth_type"));
      console.log("----");
    };
    fn();
  }, [isLoggedIn, user]);

  const handleLoginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const response = await googleOauthAuthentication(
        userInfo.user.email,
        userInfo.user.name ?? ""
      );
      if (response.status == true) {
        _onLogin(
          "oauth_google",
          response.accessToken,
          userInfo.user.email,
          response.user
        );
        return response;
      }
    } catch (error) {
      return error;
    }
  };
  const handleLoginWithPassword = async (email: string, password: string) => {
    const response = await loginUser({ email, password });
    if (response.status) {
      _onLogin("password", response.accessToken, email, response.user);
    }
    return response;
  };
  const handleRegisterWithPassword = async (
    email: string,
    password: string,
    name: string
  ) => {
    const response = await registerUser(email, name, password);
    if (response.status) {
      _onLogin("password", response.accessToken, email, response.user);
    }
    return response;
  };

  const _onLogin = (
    auth_type: string,
    accessToken: string,
    email: string,
    user: any
  ) => {
    AsyncStorage.setItem("@auth_type", auth_type);
    AsyncStorage.setItem("@access_token", accessToken);
    AsyncStorage.setItem("@user", JSON.stringify(user));
    setUser(user);
    setIsLoggedIn(true);
    setAccessToken(accessToken);
    ToastAndroid.show(`Successfully logged in as ${email}`, ToastAndroid.SHORT);
  };

  const handleLogout = () => {
    AsyncStorage.multiRemove(["@auth_type", "@access_token", "@user"]);
    setIsLoggedIn(false);
    setUser(null);
    setAccessToken("");
    if (!isLoggedIn) {
      return;
    } else {
      ToastAndroid.show(`Successfully logout`, ToastAndroid.SHORT);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        accessToken,
        onLoginWithGoogle: handleLoginWithGoogle,
        onLoginWithPassword: handleLoginWithPassword,
        onRegisterWithPassword: handleRegisterWithPassword,
        onLogout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
