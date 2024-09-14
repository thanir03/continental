import { AxiosError } from "axios";
import { api } from "./config";
import { BookingDetails } from "@/types/data";
import {
  createBookingLocal,
  getBookingByIdLocal,
  getBookingByStatusLocal,
  transformBookingData,
} from "@/db/db";

const isOnline = true;
const createBooking = async (data: {
  roomId: number;
  no_rooms: number;
  start_date: string;
  end_date: string;
}) => {
  try {
    const response = await api.post("/book/", data);
    const bookingId = response.data["booking_id"];
    if (isOnline) {
      const bookingDetails = await api.get<BookingResponse>(`/book/${bookingId}`);
      await createBookingLocal(bookingDetails["data"]);
    }
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
    if (!isOnline) {
      return { status: true, data: (await getBookingByIdLocal(id))[0] };
    }
    const response = await api.get<BookingResponse>(`/book/${id}`);
    return response.data;
  } catch (error) {
    console.log((error as AxiosError).message);
    return (error as AxiosError).response?.data as ServerResponseType;
  }
};

const getBookingByStatus = async (status: string): Promise<any> => {
  try {
    if (!isOnline) {
      const localData = await getBookingByStatusLocal(status);
      let arr = [];
      for (let item of localData) {
        arr.push(transformBookingData(item));
      }
      return arr;
    }
    const response = await api.get<BookingResponse>(
      `/book/details?status=${status}`
    );
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
