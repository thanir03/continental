import React, { useCallback, useState } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  ToastAndroid,
} from "react-native";
import { GiftedChat, IMessage, Bubble } from "react-native-gifted-chat";
import TextAnimator from "@/TypingAnimations/TextAnimator";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useFocusEffect, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import MiniListings from "@/components/Chatbot/MiniListing";
import MiniBookingList from "@/components/Chatbot/MiniBooking";
import MiniBookmarkList from "@/components/Chatbot/MiniBookmark";
import MiniRoomList from "@/components/Chatbot/MiniRoomList";
import io from "socket.io-client";
import { url } from "@/api/config";
import { getName, useAuth } from "@/context/AuthProvider";

interface CustomMessage extends IMessage {
  componentType?:
    | "bookingListComponent"
    | "hotelListComponent"
    | "bookmarkComponent"
    | "roomListComponent";
}

const { height } = Dimensions.get("window");

let id = 1;

const getComponent = (action: string, data: any) => {
  action = action.trim();
  if (data && data.length > 0 && action === "create_booking" && data)
    return "roomListComponent";
  if (data && data.length > 0 && action === "like_hotel")
    return "bookmarkComponent";
  if (data && data.length > 0 && action === "recommend_hotel")
    return "hotelListComponent";
  if (
    (data && data.length > 0 && action === "view_booking") ||
    action === "cancel_booking"
  )
    return "bookingListComponent";
  return "";
};

const structureData = (data: any, action: string, text: string, id: number) => {
  if (
    text
      .split("\n")
      .filter((i) => i.trim().length > 0)
      .join("").length === 0
  ) {
    text = "Something went wrong";
  }
  console.log(getComponent(action, data));
  return {
    _id: id,
    text: text.trim() ?? "Something went wrong",
    createdAt: new Date(),
    user: {
      _id: id,
      name: "Chatbot",
      avatar: require("@/assets/images/hu-tao-profile.png"),
    },
    data,
    componentType: getComponent(action, data),
  };
};

const ChatScreen = () => {
  const router = useRouter();
  const [messages, setMessages] = React.useState<CustomMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const { isLoggedIn, accessToken } = useAuth();

  const fn = useCallback(() => {
    if (!isLoggedIn) return;
    const socket = io(url + "/chat", {
      transports: ["websocket"],
    });

    setSocket(socket);

    socket.on("client_connect", () => {
      console.log("listening");
      setIsConnected(true);
    });

    socket.on("prompt_response", (res) => {
      const { data, action, text } = JSON.parse(res);
      console.log(action);
      id++;
      const messages: any[] = [];
      console.log(data);
      if (data && Array.isArray(data) && data.length > 0) {
        messages.push(structureData(data, action, text, id));
      }
      id++;
      const textMessage: any = structureData(null, "", text, id);
      messages.push(textMessage);
      setMessages((msg) => [msg.at(-1), ...messages]);
    });

    socket.on("error", (error: any) => {
      ToastAndroid.show("Failed to connect to server", ToastAndroid.LONG);
    });
    return () => {
      console.log("Socket is closed");
      socket.close();
      setIsConnected(false);
      setSocket(null);
    };
  }, [isLoggedIn]);

  useFocusEffect(fn);

  const BookingListComponent = (props: any) => (
    <View style={styles.bookingListComponent}>
      <MiniBookingList data={props.data} />
    </View>
  );

  const HotelListComponent = (props: any) => (
    <View style={styles.hotelListComponent}>
      <MiniListings data={props.data} />
    </View>
  );

  const BookmarkComponent = (props: any) => (
    <View style={styles.bookmarkComponent}>
      <MiniBookmarkList data={props.data} />
    </View>
  );

  const RoomListComponent = (props: any) => {
    console.log(props);
    return (
      <View style={styles.roomListComponent}>
        <MiniRoomList data={props.data} />
      </View>
    );
  };

  const renderMessage = (props: any) => {
    console.log("In render message", props);
    const {
      currentMessage: { componentType, data },
    } = props;
    console.log("In render messag", data);
    if (componentType) {
      switch (componentType) {
        case "bookingListComponent":
          return <BookingListComponent data={data} />;
        case "hotelListComponent":
          return <HotelListComponent data={data} />;
        case "bookmarkComponent":
          return <BookmarkComponent data={data} />;
        case "roomListComponent":
          return <RoomListComponent data={data} />;
        default:
          return null;
      }
    }

    return null;
  };

  const renderBubble = (props: any) => {
    const { currentMessage } = props;

    // If the message has a custom component, return only that, no bubble
    if (currentMessage.componentType) {
      return renderMessage(props);
    }

    // Style bubbles for regular messages
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: Colors.primaryColor,
            padding: 5,
            margin: 5,
            shadowColor: "#6699CC",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          left: {
            backgroundColor: "white",
            padding: 5,
            margin: 5,
            shadowColor: "#6699CC",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
        }}
        textStyle={{
          right: {
            color: Colors.white,
          },
          left: {
            color: Colors.black,
          },
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <LinearGradient
        colors={[Colors.primaryColor, "#5959e0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerBackground}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/")}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TextAnimator content="Chatbot" textStyle={styles.headerTitle} />
      </LinearGradient>

      {/* Chat Section */}
      <View style={styles.chatContainer}>
        <ImageBackground
          source={require("@/assets/images/Chatbot-wallpaper.jpg")}
          style={styles.background}
        >
          {!isLoggedIn && (
            <View
              style={{
                height: Dimensions.get("screen").height * 0.9,
                padding: 20,
                justifyContent: "center",
                backgroundColor: "white",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                It looks like you are not logged in.
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                To view your Bookmarked hotels, please log in to your account.
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "black",
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                }}
                onPress={() => router.push(`/auth?next=/chatbot`)}
              >
                <Text style={{ textAlign: "center", color: "white" }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {isLoggedIn && (
            <GiftedChat
              messages={messages}
              onSend={(newMessages) => {
                setMessages(newMessages);
                if (!isConnected) {
                  id++;
                  setMessages(
                    (m) =>
                      [
                        ...m,
                        structureData(null, "", "Disconnected from server", id),
                      ] as any[]
                  );
                  return;
                }
                socket?.emit("prompt", {
                  message: newMessages[0].text,
                  token: accessToken,
                });
              }}
              user={{ _id: 1 }}
              renderCustomView={renderMessage}
              renderBubble={renderBubble}
              scrollToBottom={true}
              inverted={false}
            />
          )}
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FD",
  },
  headerBackground: {
    flexDirection: "row",
    height: height * 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginTop: 50,
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 60,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 30,
    zIndex: 100,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  chatContainer: {
    flex: 1,
  },
  bookingListComponent: {
    padding: 5,
    borderRadius: 10,
    width: 300,
    height: 130,
    backgroundColor: "white",
    margin: 5,
    shadowColor: "#6699CC",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hotelListComponent: {
    padding: 5,
    borderRadius: 10,
    width: 240,
    backgroundColor: "white",
    margin: 5,
    shadowColor: "#6699CC",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookmarkComponent: {
    padding: 5,
    borderRadius: 10,
    width: 320,
    backgroundColor: "white",
    margin: 5,
    shadowColor: "#6699CC",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roomListComponent: {
    padding: 5,
    borderRadius: 10,
    width: 230,
    backgroundColor: "white",
    margin: 5,
    shadowColor: "#6699CC",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ChatScreen;
