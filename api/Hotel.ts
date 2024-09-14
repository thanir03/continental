import {
  City,
  HotelDetails,
  Landmark,
  MinorHotelDetails,
  Room,
} from "@/types/data";
import { AxiosError } from "axios";
import { api } from "./config";
import {
  dislikeHotelLocal,
  getAllCity,
  getLikesLocal,
  likeHotelLocal,
} from "@/db/db";

const isOnline = true;
const getCityList = async (query?: string): Promise<City[]> => {
  if (!isOnline) {
    return await getAllCity(query);
  }
  const params = query ? { q: query } : {};
  try {
    const response = await api.get<City[]>(`/hotel/cities/`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error((error as AxiosError).message);
    return [];
  }
};

const getHotelByCategory = async (category: string) => {
  try {
    const response = await api.get(`/hotel/category/${category}`);
    return response.data;
  } catch (error) {}
};

const getHotelById = async (id: number): Promise<HotelDetails | string> => {
  try {
    const response = await api.get<HotelDetails>(`/hotel/${id}`);
    return response.data;
  } catch (error) {
    return (error as AxiosError).message;
  }
};

const getLandmarkByHotelId = async (id: number): Promise<Landmark[]> => {
  try {
    const response = await api.get<Landmark[]>(`/hotel/${id}/landmarks/`);
    return response.data;
  } catch (error) {
    return [];
  }
};

const getRoomsByHotelId = async (id: number): Promise<Room[]> => {
  try {
    const response = await api.get<Room[]>(`/hotel/${id}/rooms/`);
    return response.data;
  } catch (error) {
    return [];
  }
};

const likeHotel = async (id: number): Promise<boolean> => {
  try {
    const response = await api.post(`/hotel/like/${id}/`);
    if (response.data["action"] == "like") {
      const liked_hotels = await api.get(`/hotel/likes/`);
      for (let hotel of liked_hotels.data) {
        if (hotel["id"] == id) {
          console.log("FOund hotel", hotel["id"]);
          likeHotelLocal(hotel);
          break;
        }
      }
    } else {
      await dislikeHotelLocal(id);
    }
    return response.data["action"] == "like";
  } catch (error) {
    return false;
  }
};

const getLikedHotels = async () => {
  try {
    if (!isOnline) {
      return await getLikesLocal();
    }
    const response = await api.get(`/hotel/likes/`);
    return response.data;
  } catch (error) {
    return false;
  }
};

const getPopularHotels = async () => {
  try {
    const response = await api.get(`/hotel/popular/`);
    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const searchHotels = async (
  query: string,
  room_num: number,
  no_adults: number,
  no_children: number,
  start_price?: number,
  end_price?: number,
  sort?: string
): Promise<MinorHotelDetails[]> => {
  const params: Record<string, any> = {
    q: query,
    room_num,
    no_adults,
    no_children,
  };
  if (start_price && end_price) {
    params["start_price"] = start_price;
    params["end_price"] = end_price;
  }
  if (sort) {
    params["sort"] = sort;
  }
  try {
    const response = await api.get<MinorHotelDetails[]>(`/hotel/search`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};

export {
  getCityList,
  searchHotels,
  getHotelByCategory,
  getHotelById,
  getLandmarkByHotelId,
  getRoomsByHotelId,
  likeHotel,
  getLikedHotels,
  getPopularHotels,
};
