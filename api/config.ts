import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const url = "http://192.168.0.4:7000";

const api = axios.create({
  baseURL: url,
});

api.interceptors.request.use(async (config) => {
  const authToken = await AsyncStorage.getItem("@access_token");
  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`;
  }
  return config;
});

export { api };
