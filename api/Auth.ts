import axios, { AxiosError } from "axios";
import { url } from "@/api/config";

const registerUser = async (email: string, name: string, password: string) => {
  if (!email || !name || !password) {
    console.log("here");
    return {
      message: "Invalid fields",
      status: false,
    };
  }

  const data: { [key: string]: any } = { email, name, password };
  try {
    const response = await axios.post(`${url}/auth/register`, {
      ...data,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    return {
      message: axiosError.response?.data?.message ?? "",
      status: false,
    };
  }
};

type AuthObject = {
  email: string;
  password: string;
};

const loginUser = async (auth: AuthObject) => {
  try {
    const response = await axios.post(`${url}/auth/login`, {
      email: auth.email,
      password: auth.password,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    return {
      message: axiosError.response?.data?.message ?? "",
      status: false,
    };
  }
};

const googleOauthAuthentication = async (email: string, name: string) => {
  try {
    const response = await axios.post(`${url}/auth/google-auth`, {
      email,
      name,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    return {
      message: axiosError.response?.data?.message ?? "",
      status: false,
    };
  }
};
const validateAccessToken = async (accessToken: string) => {
  try {
    const response = await axios.post(`${url}/auth/validate-token`, {
      access_token: accessToken,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    return {
      message: axiosError.response?.data?.message ?? "",
      status: false,
    };
  }
};

export {
  registerUser,
  loginUser,
  googleOauthAuthentication,
  validateAccessToken,
};
