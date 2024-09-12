// Hotel List Page
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { searchHotels } from "@/api/Hotel";
import { MinorHotelDetails } from "@/types/data";
import { calculateInitialRegion } from "@/utils/helper";
import HotelItem from "@/components/Hotel/HotelItem";
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { SafeAreaView } from "react-native-safe-area-context";

// HOTEL LIST SCREEN

const snapPoints = ["15%", "50%", "85%"];
const sortOptions: RadioButtonProps[] = [
  {
    id: "0",
    label: "Low to High",
    value: "lowest_price",
  },
  {
    id: "1",
    label: "High to Low",
    value: "highest_price",
  },
  {
    id: "2",
    label: "Rating",
    value: "rating",
  },
];

const HotelListScreen = () => {
  const { height: screenHeight } = Dimensions.get("window");
  const params = useLocalSearchParams();

  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showSort, setShowSort] = useState<boolean>(false);

  const filterRef = useRef<BottomSheet>(null);
  const sortRef = useRef<BottomSheet>(null);
  const query = (params["q"] as string) ?? "London";
  const roomNum = Number(params["room_num"]) ?? 1;
  const noAdults = Number(params["no_adult"]) ?? 1;

  const noChildren = +params["no_child"] ?? 1;

  // Prices that are used in bottom sheet
  const [prices, setPrices] = useState([0, 10_000]);
  const [startPrice, setStartPrice] = useState<number>(0);
  const [endPrice, setEndPrice] = useState<number>(10_000);
  const [sort, setSort] = useState<string | undefined>();
  const [sortTmp, setSortTmp] = useState<string | undefined>();

  const [hotels, setHotels] = useState<MinorHotelDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headerHeight = screenHeight * 0.15;
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    searchHotels(
      query,
      roomNum,
      noAdults,
      noChildren,
      startPrice,
      endPrice,
      sort
    )
      .then((hotelList) => setHotels(hotelList))
      .catch((msg) => {
        setHotels([]);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [query, roomNum, noAdults, noChildren, startPrice, endPrice, sort]);

  // Calculate the date range
  const markers = useMemo(() => {
    const data = hotels
      .filter((item) => item.lat && item.long)
      .slice(0, Math.min(hotels.length, 20))
      .map((item) => ({
        id: item.id,
        title: item.name,
        coordinates: {
          latitude: parseFloat(item.lat!),
          longitude: parseFloat(item.long!),
        },
      }));
    return data;
  }, [hotels]);

  const initialRegion = useMemo(() => {
    if (markers.length == 0) {
      return {
        latitude: 63.333015,
        longitude: -67.839293,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    return calculateInitialRegion(markers.map((item) => item.coordinates));
  }, [markers]);

  if (error) {
    console.log(error);
    return <Text style={styles.error}>{""}</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={router.back}>
        <View
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 10,
          }}
        >
          <Ionicons name="arrow-back" size={30} color={"black"} />
        </View>
      </TouchableWithoutFeedback>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[Colors.primaryColor, "#5959e0"]} // Gradient from primaryColor to light blue
          start={{ x: 0, y: 0 }} // Start at the left
          end={{ x: 1, y: 0 }} // End at the right
          style={[styles.header, { height: headerHeight }]}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              router.push(`/search/browse?q=${query}`);
            }}
          >
            <View>
              <Text style={styles.title}>{query}</Text>
              <Text style={styles.dateText}>
                {roomNum} Rooms - {noAdults} Adults - {noChildren} Children
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
              padding: 1,
              gap: 50,
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                paddingHorizontal: 10,
                paddingVertical: 1,
                borderWidth: 2,
                borderColor: "#EBEBEB",
                borderRadius: 5,
                gap: 5,
              }}
              onPress={() => setShowFilter(true)}
            >
              <Text style={{ color: "white" }}>Filter</Text>
              <AntDesign name="down" size={10} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#EBEBEB",
                paddingHorizontal: 10,
                paddingVertical: 1,
                borderRadius: 5,
                gap: 5,
              }}
              onPress={() => setShowSort(true)}
            >
              <Text style={{ color: "white" }}>Sort</Text>
              <AntDesign name="down" size={10} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={initialRegion}
          showsUserLocation={true}
        >
          {markers.map((marker) => {
            return (
              <Marker
                key={marker.id}
                coordinate={marker.coordinates}
                title={marker.title}
              />
            );
          })}
        </MapView>

        <BottomSheet
          index={1}
          snapPoints={snapPoints}
          style={styles.bottomSheet}
        >
          {!loading && (
            <BottomSheetFlatList
              data={hotels}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <HotelItem item={item} />}
              contentContainerStyle={styles.contentContainer}
              ListHeaderComponent={() => (
                <Text style={styles.resultsCountText}>
                  {hotels.length} Results
                </Text>
              )}
            />
          )}
          {loading && (
            <View
              style={{
                height: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View>
          )}
        </BottomSheet>

        {showFilter && (
          <BottomSheet
            ref={filterRef}
            style={{ zIndex: 100 }}
            snapPoints={["50%"]}
            onClose={() => setShowFilter(false)}
            enablePanDownToClose={true}
          >
            <BottomSheetView
              style={{
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                  onPress={() => {
                    filterRef.current?.close();
                  }}
                >
                  <Entypo name="cross" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    setPrices([0, 5_000]);
                    setStartPrice(0);
                    setEndPrice(5_000);
                    filterRef.current?.close();
                  }}
                >
                  <Text style={{ fontSize: 16 }}>Clear Filters</Text>
                </TouchableOpacity>
              </View>

              <View style={{ gap: 40, padding: 20 }}>
                <Text
                  style={{
                    fontSize: 30,
                    color: Colors.primaryColor,
                  }}
                >
                  Filters
                </Text>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ alignSelf: "flex-start", marginLeft: 20 }}>
                    Starting Price
                  </Text>
                  <MultiSlider
                    customMarker={customMarker}
                    values={prices}
                    sliderLength={300}
                    onValuesChange={(nums) => {
                      setPrices(nums);
                    }}
                    selectedStyle={{}}
                    min={0}
                    step={Math.round(Math.abs(5000 - 0) / 100)}
                    max={5000}
                    snapped
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 250,
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>{prices[0]}</Text>
                    <Text>{prices[1]}</Text>
                  </View>
                </View>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setStartPrice(prices[0]);
                    setEndPrice(prices[1]);
                    filterRef.current?.close();
                  }}
                >
                  <View
                    style={{
                      borderRadius: 10,
                      backgroundColor: "#000",
                      padding: 10,
                      paddingVertical: 15,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      Show results
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </BottomSheetView>
          </BottomSheet>
        )}
        {showSort && (
          <BottomSheet
            ref={sortRef}
            style={{ zIndex: 100 }}
            snapPoints={["50%"]}
            onClose={() => setShowSort(false)}
            enablePanDownToClose={true}
          >
            <BottomSheetView
              style={{
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                  onPress={() => {
                    sortRef.current?.close();
                  }}
                >
                  <Entypo name="cross" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    setSort(undefined);
                    setSortTmp(undefined);
                    sortRef.current?.close();
                  }}
                >
                  <Text style={{ fontSize: 16 }}>Clear Filters</Text>
                </TouchableOpacity>
              </View>

              <View style={{ gap: 40, padding: 20 }}>
                <Text
                  style={{
                    fontSize: 30,
                    color: Colors.primaryColor,
                  }}
                >
                  Sort
                </Text>
                <View style={{ alignItems: "center" }}>
                  <RadioGroup
                    radioButtons={sortOptions}
                    containerStyle={{}}
                    labelStyle={{
                      width: "80%",
                      fontSize: 16,
                    }}
                    onPress={(e: any) => setSortTmp(e)}
                    selectedId={sortTmp}
                  />
                </View>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setSort(sortOptions[Number(sortTmp)].value);
                    sortRef.current?.close();
                  }}
                >
                  <View
                    style={{
                      borderRadius: 10,
                      backgroundColor: "#000",
                      padding: 10,
                      paddingVertical: 15,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      Show results
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </BottomSheetView>
          </BottomSheet>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const customMarker = () => {
  return (
    <View
      style={{
        backgroundColor: Colors.primaryColor,
        padding: 10,
        borderRadius: 20,
      }}
    ></View>
  );
};

export default HotelListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FD",
  },
  header: {
    justifyContent: "space-evenly",
    alignItems: "center",
    elevation: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  dateText: {
    fontSize: 16,
    color: "white",
  },
  map: {
    height: "100%",
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F6F8FD",
    paddingBottom: 30,
  },
  listItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#6699CC",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "90%",
    alignSelf: "center",
    paddingBottom: 10,
    margin: 15,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  itemText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
    paddingHorizontal: 15,
  },
  destinationImage: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primaryColor,
    paddingHorizontal: 15,
  },
  bottomSheet: {
    flex: 1,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  resultsCountText: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 10,
    textAlign: "center",
    color: Colors.primaryColor,
  },
});
