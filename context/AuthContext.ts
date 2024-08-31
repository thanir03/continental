import React from "react";

interface AuthContextValues {
  user: any;
  isLoggedIn: boolean;
  accessToken: string;
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
  user: {},
  isLoggedIn: false,
  accessToken: "",
  onLoginWithGoogle() {},
  onLoginWithPassword(email: string, password: string) {},
  onRegisterWithPassword(email: string, password: string, name: string) {},
  onLogout() {},
});
