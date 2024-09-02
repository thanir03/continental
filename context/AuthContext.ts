import { User } from "@react-native-google-signin/google-signin";
import React from "react";
import { PasswordUser } from "./AuthProvider";

interface AuthContextValues {
  user: User | PasswordUser | null;
  isLoggedIn: boolean;
  accessToken: string;
  authType: "" | "password" | "oauth_google";
  onLoginWithGoogle: () => any;
  onLoginWithPassword: (email: string, password: string) => any;
  onRegisterWithPassword: (
    email: string,
    password: string,
    name: string
  ) => any;
  onLogout: () => void;
}

export const AuthContext = React.createContext<AuthContextValues>({
  user: null,
  isLoggedIn: false,
  accessToken: "",
  authType: "",
  onLoginWithGoogle() {},
  onLoginWithPassword(email: string, password: string) {},
  onRegisterWithPassword(email: string, password: string, name: string) {},
  onLogout() {},
});
