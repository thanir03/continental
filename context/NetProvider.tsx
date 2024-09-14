import React, { useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { ToastAndroid } from "react-native";

const NetContext = React.createContext({
  isOnline: true,
});

export let isConnected = true;

const NetProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubsribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
      isConnected = state.isConnected ?? false;
    });
    return unsubsribe();
  }, []);

  useEffect(() => {
    if (!isOnline) {
      ToastAndroid.show("You are disconnected", ToastAndroid.SHORT);
    }
  }, [isOnline]);

  return (
    <NetContext.Provider value={{ isOnline }}>{children}</NetContext.Provider>
  );
};

export const useNetwork = () => useContext(NetContext);

export default NetProvider;
