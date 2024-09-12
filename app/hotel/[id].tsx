import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Linking,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import {
  getHotelById,
  getLandmarkByHotelId,
  getRoomsByHotelId,
  likeHotel,
} from "@/api/Hotel";
import { HotelDetails, Landmark, Room } from "@/types/data";
import Colors from "@/constants/Colors";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RoomItem from "@/components/Hotel/RoomItem";
import { useAuth } from "@/context/AuthProvider";
import HotelImageList from "@/components/Hotel/HotelImages";

const HotelDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
  });
  const hotelId = parseInt(id as string);
  const { isLoggedIn } = useAuth();

  const [hotelDetails, setHotelDetails] = useState<HotelDetails | null>(null);
  const [landmark, setLandmark] = useState<Landmark[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showDesc, setShowDesc] = useState(false);
  const [showLandmark, setShowLandmark] = useState(false);
  const [showSelectRoom, setShowSelectRoom] = useState(false);
  const descRef = useRef<BottomSheet | null>(null);
  const landmarkRef = useRef<BottomSheet | null>(null);
  const selectRoomRef = useRef<BottomSheet | null>(null);
  const router = useRouter();
  const [selectedRoomNo, setSelectedNoRooms] = useState<number[]>([]);

  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  useEffect(() => {
    Promise.all([
      getHotelById(hotelId),
      getLandmarkByHotelId(hotelId),
      getRoomsByHotelId(hotelId),
    ]).then(([bdetails, lDetails, rDetails]) => {
      if (typeof bdetails == "object") {
        setHotelDetails(bdetails);
      }
      setLandmark(lDetails);
      setRooms(rDetails);
      setSelectedNoRooms(Array.from({ length: rDetails.length }).map(() => 1));
    });
  }, [id]);

  const openGoogleMaps = () => {
    const url = `geo:0,0?q=${hotelDetails?.name + " " + hotelDetails?.address}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error opening Google Maps", err)
    );
  };

  const handleLikeHotel = async () => {
    if (isLoggedIn) {
      // like hotel
      const res = await likeHotel(hotelId);
      setHotelDetails({ ...hotelDetails, isLiked: res } as any);
    } else {
      router.push(`/auth?next=/hotel/${hotelId}`);
    }
  };

  return (
    <GestureHandlerRootView>
      <TouchableWithoutFeedback onPress={router.back}>
        <View
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 10,
            backgroundColor: "#333533",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Ionicons name="arrow-back" size={30} color={"white"} />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
          {!hotelDetails && (
            <View
              style={{
                height: 800,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View>
          )}
          {hotelDetails && (
            <>
              <HotelImageList
                scrollOffset={scrollOffset}
                images={hotelDetails.hotel_images}
              />
              <View
                style={{ ...styles.details, height: rooms.length * 125 + 1000 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", padding: 2 }}
                  >
                    {hotelDetails.name}
                  </Text>
                  {hotelDetails?.isLiked ? (
                    <TouchableOpacity onPress={handleLikeHotel}>
                      <AntDesign name="heart" size={24} color="red" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={handleLikeHotel}>
                      <AntDesign name="hearto" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <AntDesign name="star" size={20} color="black" />
                    <Text style={{ fontSize: 20 }}>{hotelDetails.rating} </Text>
                  </View>
                  <Text style={{ fontSize: 20, color: "black" }}>
                    {hotelDetails.city}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    shadowColor: "#6699CC",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    marginLeft: -10,
                    width: Dimensions.get("screen").width,
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    padding: 20,
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>Hotel Description</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setShowDesc(true);
                      }}
                    >
                      <Text style={{ color: Colors.primaryColor }}>
                        Learn More
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text>
                    {hotelDetails.desc
                      .split(" ")
                      .slice(0, Math.min(20, hotelDetails.desc.length))
                      .join(" ") + " ..."}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    shadowColor: "#6699CC",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    marginLeft: -10,
                    width: Dimensions.get("screen").width,
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    padding: 20,
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 20, marginBottom: 10 }}>
                      Location
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        openGoogleMaps();
                      }}
                    >
                      <Text style={{ color: Colors.primaryColor }}>
                        See Map
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {hotelDetails.lat && hotelDetails.lng && (
                      <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{
                          height: 100,
                          width: 100,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        region={{
                          latitude: parseFloat(hotelDetails.lat),
                          longitude: parseFloat(hotelDetails.lng),
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}
                      >
                        <Marker
                          key={"1"}
                          coordinate={{
                            latitude: parseFloat(hotelDetails.lat),
                            longitude: parseFloat(hotelDetails.lng),
                          }}
                          title={hotelDetails.name}
                        />
                      </MapView>
                    )}
                    <Text
                      style={{
                        padding: 5,
                        textAlign: "center",
                        flexShrink: 1,
                        marginTop: -10,
                      }}
                    >
                      {hotelDetails.address}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    shadowColor: "#6699CC",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    marginLeft: -10,
                    width: Dimensions.get("screen").width,
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    padding: 20,
                    marginTop: 15,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>Nearby Landmarks</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setShowLandmark(true);
                      }}
                    >
                      <Text style={{ color: Colors.primaryColor }}>
                        See All
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      padding: 10,
                    }}
                  >
                    {landmark
                      .slice(0, Math.min(5, landmark.length))
                      .map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                gap: 10,
                              }}
                            >
                              <Ionicons
                                name="location"
                                size={15}
                                color="black"
                              />
                              <Text>{item.name}</Text>
                            </View>
                            <Text>{item.distance}</Text>
                          </View>
                        );
                      })}
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    shadowColor: "#6699CC",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    marginLeft: -10,
                    width: Dimensions.get("screen").width,
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    padding: 20,
                    marginTop: 20,
                  }}
                >
                  <Text style={{ fontSize: 20, padding: 5 }}>Rooms </Text>
                  <View style={{ gap: 20 }}>
                    {rooms.map((item, index) => (
                      <RoomItem
                        hotelId={hotelId}
                        key={item.id}
                        item={item}
                        selectedRoomNo={selectedRoomNo[index]}
                        showSelectRoom={() => {
                          setSelectedRoomIdx(index);
                          setShowSelectRoom(true);
                        }}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </>
          )}
        </Animated.ScrollView>

        {hotelDetails && (
          <View
            style={{
              height: 80,
              position: "absolute",
              bottom: 0,
              backgroundColor: "#03045e",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              width: "100%",
              padding: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ color: "white" }}>Starts from </Text>
              <Text style={{ fontSize: 20, color: "red", fontWeight: "bold" }}>
                RM {hotelDetails.starting_price}{" "}
              </Text>
            </View>

            <TouchableWithoutFeedback
              onPress={() => {
                Linking.openURL(hotelDetails.agoda_url);
              }}
            >
              <View
                style={{
                  borderRadius: 10,
                  backgroundColor: "white",
                  width: 200,
                  height: 50,
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  padding: 0,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "black",
                    marginTop: 12,
                    marginLeft: 15,
                  }}
                >
                  View In
                </Text>
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Agoda_transparent_logo.png",
                  }}
                  style={{
                    width: 100,
                    padding: 10,
                    resizeMode: "cover",
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
        {showDesc && hotelDetails && (
          <BottomSheet
            ref={descRef}
            style={{ borderRadius: 5, zIndex: 100 }}
            snapPoints={["50%"]}
            onClose={() => setShowDesc(false)}
            enablePanDownToClose={true}
            backgroundComponent={({ style }) => (
              <View
                style={[
                  {
                    backgroundColor: "white",
                    borderRadius: 20,
                  },
                  style,
                ]}
              />
            )}
          >
            <BottomSheetScrollView
              style={{
                flexDirection: "column",
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderBottomColor: "#adb5bd",
                  borderBottomWidth: 1,
                  gap: 70,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    descRef.current?.close();
                  }}
                >
                  <Entypo name="cross" size={30} color="black" />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 20,
                    padding: 5,
                    paddingBottom: 15,
                    textAlign: "center",
                    fontWeight: "bold",

                    color: Colors.primaryColor,
                  }}
                >
                  Hotel Description
                </Text>
              </View>

              <Text style={{ padding: 10, fontSize: 18 }}>
                {hotelDetails.desc}
              </Text>
            </BottomSheetScrollView>
          </BottomSheet>
        )}
        {showLandmark && hotelDetails && (
          <BottomSheet
            ref={landmarkRef}
            style={{ borderRadius: 5, zIndex: 100 }}
            snapPoints={["50%"]}
            onClose={() => setShowLandmark(false)}
            enablePanDownToClose={true}
            backgroundComponent={({ style }) => (
              <View
                style={[
                  {
                    backgroundColor: "white",
                    borderRadius: 20,
                  },
                  style,
                ]}
              />
            )}
          >
            <BottomSheetScrollView
              style={{
                flexDirection: "column",
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderBottomColor: "#adb5bd",
                  borderBottomWidth: 1,
                  gap: 70,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    landmarkRef.current?.close();
                  }}
                >
                  <Entypo name="cross" size={30} color="black" />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 20,
                    padding: 5,
                    paddingBottom: 15,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: Colors.primaryColor,
                    marginLeft: 35,
                  }}
                >
                  Landmark
                </Text>
              </View>
              <View style={{ padding: 10 }}>
                {landmark.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 2,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                        }}
                      >
                        <Ionicons name="location" size={15} color="black" />
                        <Text style={{ fontSize: 15 }}>{item.name}</Text>
                      </View>
                      <Text>{item.distance}</Text>
                    </View>
                  );
                })}
              </View>
            </BottomSheetScrollView>
          </BottomSheet>
        )}
        {showSelectRoom && rooms && (
          <BottomSheet
            ref={selectRoomRef}
            style={{ borderRadius: 5, zIndex: 100 }}
            snapPoints={[rooms[selectedRoomIdx].num_rooms * 10 + 10 + "%"]}
            onClose={() => setShowSelectRoom(false)}
            enablePanDownToClose={true}
            backgroundComponent={({ style }) => (
              <View
                style={[
                  {
                    backgroundColor: "white",
                    borderRadius: 20,
                  },
                  style,
                ]}
              />
            )}
          >
            <BottomSheetScrollView
              style={{
                flexDirection: "column",
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderBottomColor: "#adb5bd",
                  borderBottomWidth: 1,
                  gap: 70,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    selectRoomRef.current?.close();
                  }}
                >
                  <Entypo name="cross" size={30} color="black" />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 20,
                    padding: 5,
                    paddingBottom: 15,
                    textAlign: "center",
                    fontWeight: "bold",
                    marginLeft: 15,
                    color: Colors.primaryColor,
                  }}
                >
                  Select Rooms
                </Text>
              </View>
              <View style={{ flexDirection: "column" }}>
                {Array.from({ length: rooms[selectedRoomIdx].num_rooms }).map(
                  (_, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={{
                          alignItems: "center",
                          gap: 20,
                          padding: 10,
                          flexDirection: "row",
                        }}
                        onPress={() => {
                          setSelectedNoRooms((item) => {
                            const arr = [...item];
                            arr[selectedRoomIdx] = index + 1;
                            return arr;
                          });
                          selectRoomRef.current?.close();
                        }}
                      >
                        {selectedRoomNo[selectedRoomIdx] == index + 1 && (
                          <AntDesign name="check" size={24} color="black" />
                        )}
                        <Text
                          style={{
                            fontSize: 20,
                            marginLeft:
                              selectedRoomNo[selectedRoomIdx] != index + 1
                                ? 43
                                : 0,
                          }}
                        >
                          {index + 1} room{index + 1 > 1 && "s"}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>
            </BottomSheetScrollView>
          </BottomSheet>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  details: {
    padding: 16,
  },
});

export default HotelDetailsScreen;
