import { AxiosError } from "axios";
import { api } from "./config";
import { BookingDetails } from "@/types/data";

const createBooking = async (data: {
  roomId: number;
  no_rooms: number;
  start_date: string;
  end_date: string;
}) => {
  try {
    const response = await api.post("/book/", data);
    return response.data;
  } catch (error) {
    console.log((error as AxiosError).message);
    return (error as AxiosError).response?.data;
  }
};

interface ServerResponseType {
  status: boolean;
  message: string;
}

interface BookingResponse {
  status: boolean;
  data: BookingDetails;
}

const getBookingById = async (id: number): Promise<any> => {
  try {
    const response = await api.get<BookingResponse>(`/book/${id}`);
    return response.data;
  } catch (error) {
    console.log((error as AxiosError).message);
    return (error as AxiosError).response?.data as ServerResponseType;
  }
};

const getBookingByStatus = async (status: string): Promise<any> => {
  try {
    const response = await api.get<BookingResponse>(
      `/book/details?status=${status}`
    );
    console.log(response.data);
    console.log("No error");
    return response.data;
  } catch (error) {
    console.log((error as AxiosError).response?.data);
    console.log((error as AxiosError).message);
    return (error as AxiosError).response?.data as ServerResponseType;
  }
};

const checkout = async (id: number): Promise<any> => {
  try {
    const response = await api.post<any>(`/book/checkout`, { bookingId: id });
    return response.data;
  } catch (error) {
    console.log((error as AxiosError).message);
    return (error as AxiosError).response?.data as ServerResponseType;
  }
};

const cancelBooking = async (id: number): Promise<any> => {
  try {
    const response = await api.put<any>(`/book/cancel`, { bookingId: id });
    return response.data;
  } catch (error) {
    console.log((error as AxiosError).message);
    return (error as AxiosError).response?.data as ServerResponseType;
  }
};

export {
  createBooking,
  getBookingById,
  checkout,
  getBookingByStatus,
  cancelBooking,
};
