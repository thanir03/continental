export interface City {
  id: string;
  image: string;
  name: string;
}
export type HotelCategory = "Cozy" | "Longer Stays" | "Luxury" | "Deluxe";

export interface MinorHotelDetails {
  category: HotelCategory;
  city: string;
  desc: string;
  id: number;
  image_url: string;
  lat?: string;
  long?: string;
  name: string;
  price: number;
  rating: string;
}

export interface HotelDetails {
  id: number;
  name: string;
  address: string;
  desc: string;
  rating: number;
  city: string;
  starting_price: string;
  agoda_url: string;
  lat: string | null;
  lng: string | null;
  category: HotelCategory;
  hotel_images: string[];
  isLiked?: boolean;
}

export interface Landmark {
  distance: string;
  name: string;
}

export interface Room {
  bed: string;
  hotel_id: number;
  id: number;
  name: string;
  no_adult: number;
  no_child: number;
  num_rooms: number;
  price: number;
  room_images: string[];
  size: number;
}

export interface BookingDetails {
  b_end: string;
  b_id: number;
  b_no_room: number;
  b_start: string;
  email: string;
  h_address: string;
  h_id: number;
  h_img: string;
  h_lat: string;
  h_lng: string;
  h_name: string;
  r_bed: string;
  r_id: number;
  r_img: string;
  r_name: string;
  r_no_adult: number;
  r_no_child: number;
  r_price: number;
  r_size: number;
  status: string;
  total: string;
  h_rating: string;
}
