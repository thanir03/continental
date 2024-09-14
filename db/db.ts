import { City } from "@/types/data";
import * as SQLite from "expo-sqlite";
import { Database } from "./connection";

export const bookingTable = `
CREATE TABLE IF NOT EXISTS booking (
    b_id INTEGER PRIMARY KEY,
    email TEXT,
    b_no_room INTEGER,
    b_start TEXT,
    b_end TEXT,
    status TEXT,
    total REAL,
    h_id INTEGER,
    h_name TEXT,
    h_address TEXT,
    h_lat REAL,
    h_lng REAL,
    h_img TEXT,
    h_rating REAL,
    r_id INTEGER,
    r_name TEXT,
    r_bed TEXT,
    r_no_adult INTEGER,
    r_no_child INTEGER,
    r_price REAL,
    r_size REAL, 
    r_img TEXT 
);
`;

export const likedTable = `
CREATE TABLE IF NOT EXISTS liked_hotels (
    id INTEGER PRIMARY KEY,
    name TEXT,
    city TEXT,
    category TEXT,
    desc TEXT,
    img TEXT,
    lat REAL,
    lng REAL,
    price REAL,
    rating REAL,
    address TEXT,
    agoda_url TEXT
);`;

export const hotelTable = `
  CREATE TABLE IF NOT EXISTS hotel (
    id INTEGER,
    name TEXT,
    city TEXT,
    category TEXT,
    desc TEXT,
    image_url TEXT,
    lat REAL,
    long REAL,
    price REAL,
    rating REAL
);
`;

export const city = `
    CREATE TABLE IF NOT EXISTS CITY (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT, 
     image TEXT  
);
`;

export const createBookingLocal = async (booking: any) => {
  const db = await Database.getInstance().getConnection();
  db.withTransactionAsync(async () => {
    try {
      const query = `
    INSERT INTO booking (
      b_id,
      email,
      b_no_room,
      b_start,
      b_end,
      status,
      total,
      h_id,
      h_name,
      h_address,
      h_lat,
      h_lng,
      h_img,
      h_rating,
      r_id,
      r_name,
      r_bed,
      r_no_adult,
      r_no_child,
      r_price,
      r_size,
      r_img
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?
    )
  `;

      await db.runAsync(query, [
        booking.b_id,
        booking.email,
        booking.b_no_room,
        booking.b_start,
        booking.b_end,
        booking.status,
        booking.total,
        booking.h_id,
        booking.h_name,
        booking.h_address,
        booking.h_lat,
        booking.h_lng,
        booking.h_img,
        booking.h_rating,
        booking.r_id,
        booking.r_name,
        booking.r_bed,
        booking.r_no_adult,
        booking.r_no_child,
        booking.r_price,
        booking.r_size,
        booking.r_img,
      ]);
    } catch (error) {}
  });
};

export const getAllCity = async (query?: string): Promise<City[]> => {
  const db = await Database.getInstance().getConnection();
  let cities = [];
  try {
    if (query) {
      cities = await db.getAllAsync(
        "SELECT * FROM CITY where LOWER(name) LIKE LOWER(?)",
        [`%${query}%`]
      );
    } else {
      cities = await db.getAllAsync("SELECT * FROM CITY;");
    }
    return cities as City[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getLikesLocal = async () => {
  const db = await Database.getInstance().getConnection();
  const query = "SELECT * FROM liked_hotels";
  const res = await db.getAllAsync(query);
  console.log("BOOKMARKS", res);
  return res;
};


export const likeHotelLocal = async (like: any) => {
  const db = await Database.getInstance().getConnection();
  db.withTransactionAsync(async () => {
    try {
      const query = `
    INSERT INTO liked_hotels (
      id,
      name,
      city,
      category,
      desc,
      img,
      lat,
      lng,
      price,
      rating,
      address,
      agoda_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

      await db.runAsync(query, [
        like.id,
        like.name,
        like.city,
        like.category,
        like.desc,
        like.img,
        like.lat,
        like.lng,
        like.price,
        like.rating,
        like.address,
        like.agoda_url,
      ]);
      console.log("Insert success");
    } catch (error) {
      console.log(error);
    }
  });
};

export const dislikeHotelLocal = async (id: number) => {
  const db = await Database.getInstance().getConnection();
  db.withTransactionAsync(async () => {
    try {
      const query = `
    DELETE FROM liked_hotels where id = ?`;

      await db.runAsync(query, [id]);
      console.log("DELETE success");
    } catch (error) {
      console.log(error);
    }
  });
};

export const updateBookingStatus = async (id: number, status: string) => {
  const db = await Database.getInstance().getConnection();
  try {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        "UPDATE BOOKING set status = ? where b_id = ?",
        status,
        id
      );
    });
  } catch (error) {}
};

export const getBookingByIdLocal = async (id: number) => {
  const db = await Database.getInstance().getConnection();
  let booking = [];
  try {
    booking = await db.getAllAsync("SELECT * FROM BOOKING where b_id = ?", [
      id,
    ]);
    return booking;
  } catch (error) {
    return [];
  }
};

export const getBookingByStatusLocal = async (status: string) => {
  const db = await Database.getInstance().getConnection();
  let data = [];
  try {
    if (status === "ALL") {
      data = await db.getAllAsync("SELECT * FROM BOOKING");
    } else {
      data = await db.getAllAsync("SELECT * FROM BOOKING where status = ?", [
        status,
      ]);
    }
    return data;
  } catch (error) {
    return [];
  }
};

export const migrateDB = async (db: SQLite.SQLiteDatabase) => {
  try {
    await db.execAsync(
      `${bookingTable}\n${likedTable}\n${hotelTable}\n${city}`
    );
    await db.execAsync("DELETE FROM CITY;");
    await db.runAsync(`INSERT INTO CITY (name, image)
      VALUES ('New York', 'https://plus.unsplash.com/premium_photo-1682657000431-84ea0dcf361c?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');`);
    await db.runAsync(`INSERT INTO CITY (name, image)
      VALUES ('Tokyo', 'https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?q=80&w=1784&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8fHx8fGVufDB8fHx8fA%3D%3D');`);
    await db.runAsync(`INSERT INTO CITY (name, image)
      VALUES ('London', 'https://plus.unsplash.com/premium_photo-1671809692422-4893b9e09119?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8fHx8fGVufDB8fHx8fA%3D%3D');`);
    await db.runAsync(`INSERT INTO CITY (name, image)
      VALUES ('Paris', 'https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8fHx8fGVufDB8fHx8fA%3D%3D');`);
    console.log(await db.getAllAsync("SELECT * FROM liked_hotels"));
  } catch (error) {
    console.log(error);
  }
};

export const transformBookingData = (local: any) => {
  const {
    h_address,
    b_id,
    b_end,
    b_start,
    b_no_room,
    h_id,
    h_img,
    h_lat,
    h_lng,
    h_name,
    r_id,
    r_name,
    r_no_adult,
    r_no_child,
    r_price,
    status,
    total,
  } = local;

  return {
    address: h_address,
    bookingId: b_id,
    end_date: b_end,
    hotel_id: h_id,
    hotel_image: h_img,
    hotel_name: h_name,
    lat: h_lat,
    lng: h_lng,
    no_room: b_no_room,
    room_id: r_id,
    room_name: r_name,
    room_no_adult: r_no_adult,
    room_no_child: r_no_child,
    room_price: r_price,
    start_date: b_start,
    status: status,
    total_price: total,
  };
};

export const clearDB = async () => {
  try {
    const db = await Database.getInstance().getConnection();

    db.withTransactionAsync(async () => {
      db.execAsync("DELETE FROM liked_hotels");
      db.execAsync("DELETE FROM booking");
    });
  } catch (error) {
    console.log(error);
  }
};
