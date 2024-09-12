import Colors from "@/constants/Colors";
import { useAuth } from "@/context/AuthProvider";
import { Room } from "@/types/data";
import {
  AntDesign,
  FontAwesome5,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { Dimensions, Image, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native-ui-lib";

const RoomItem = ({
  item,
  showSelectRoom,
  selectedRoomNo,
  hotelId,
}: {
  item: Room;
  showSelectRoom: () => void;
  selectedRoomNo: number;
  hotelId: number;
}) => {
  const { isLoggedIn } = useAuth();
  return (
    <View
      style={{
        backgroundColor: "#f8f9fa",
        borderRadius: 10,
        shadowColor: "#6699CC",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        marginLeft: -10,
        width: Dimensions.get("screen").width * 0.95,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 15,
        gap: 10,
      }}
    >
      <View
        style={{
          gap: 20,
          flexDirection: "row",
        }}
      >
        <Image
          source={{ uri: item.room_images[0] }}
          style={{
            height: 100,
            width: 100,
            resizeMode: "cover",
            borderRadius: 5,
          }}
        />
        <View>
          <Text
            style={{
              color: Colors.primaryColor,
              fontSize: 15,
              width: Dimensions.get("screen").width * 0.55,
            }}
          >
            {item.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <FontAwesome6 name="bed" size={20} color="black" />
            <Text>{item.bed}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <MaterialIcons name="people" size={20} color={"black"} />
            <Text>{item.no_adult} Adult(s)</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <FontAwesome5 name="child" size={20} color={"black"} />
            <Text>{item.no_child} Children</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "red",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          RM {item.price}
        </Text>
        {item.num_rooms > 0 && (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: "#dee2e6",
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                width: 120,
              }}
              onPress={showSelectRoom}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "black", textAlign: "center" }}>
                  Rooms
                </Text>
                <Text>{selectedRoomNo}</Text>
                <AntDesign name="down" size={15} color="black" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: Colors.primaryColor,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                width: 120,
              }}
              onPress={() => {
                if (!isLoggedIn) {
                  router.push(`/auth?next=/hotel/${hotelId}`);
                } else {
                  router.push(
                    `/booking/date?no_room=${selectedRoomNo}&roomId=${item.id}` as any
                  );
                }
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {item.num_rooms == 0 && (
          <Text style={{ color: "red", fontSize: 20, fontWeight: "bold" }}>
            Sold Out
          </Text>
        )}
      </View>
    </View>
  );
};

export default RoomItem;
