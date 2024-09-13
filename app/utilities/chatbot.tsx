import React from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  GiftedChat,
  IMessage,
  Bubble,
} from 'react-native-gifted-chat';
import TextAnimator from '@/TypingAnimations/TextAnimator';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MiniListings from '@/chatbot_components/mini_listing';
import MiniBookingList from '@/chatbot_components/mini_booking';
import MiniBookmarkList from '@/chatbot_components/mini_bookmark';
import MiniRoomList from '@/chatbot_components/mini_roomList';

interface CustomMessage extends IMessage {
  componentType?: 'bookingListComponent' | 'hotelListComponent' | 'bookmarkComponent' | 'roomListComponent';
}

const { height } = Dimensions.get('window');

const ChatScreen = () => {
  const router = useRouter();
  const [messages, setMessages] = React.useState<CustomMessage[]>([]);

  React.useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Here is a custom component!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: require('@/assets/images/hu-tao-profile.png'),
        },
        componentType: 'bookingListComponent',
      },
      {
        _id: 2,
        text: 'Here is another custom component!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: require('@/assets/images/hu-tao-profile.png'),
        },
        componentType: 'hotelListComponent',
      },
      {
        _id: 3,
        text: 'No custom components!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: require('@/assets/images/hu-tao-profile.png'),
        },
        componentType: 'roomListComponent',
      },
      {
        _id: 4,
        text: 'Bookmark component!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: require('@/assets/images/hu-tao-profile.png'),
        },
        componentType: 'bookmarkComponent',
      },
    ]);
  }, []);

  const BookingListComponent = () => (
    <View style={styles.bookingListComponent}>
      <MiniBookingList />
    </View>
  );

  const HotelListComponent = () => (
    <View style={styles.hotelListComponent}>
      <MiniListings category="Mountains" />
    </View>
  );

  const BookmarkComponent = () => (
    <View style={styles.bookmarkComponent}>
      <MiniBookmarkList />
    </View>
  );

  const RoomListComponent = () => (
    <View style={styles.roomListComponent}>
      <MiniRoomList />
    </View>
  );

  const renderMessage = (props: any) => {
    const { currentMessage } = props;

    if (currentMessage.componentType) {
      switch (currentMessage.componentType) {
        case 'bookingListComponent':
          return <BookingListComponent />;
        case 'hotelListComponent':
          return <HotelListComponent />;
        case 'bookmarkComponent':
          return <BookmarkComponent />;
        case 'roomListComponent':
          return <RoomListComponent />;
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
            shadowColor: '#6699CC',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          left: {
            backgroundColor: 'white',
            padding: 5,
            margin: 5,
            shadowColor: '#6699CC',
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
        colors={[Colors.primaryColor, '#5959e0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerBackground}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TextAnimator content="Chatbot" textStyle={styles.headerTitle} />
      </LinearGradient>

      {/* Chat Section */}
      <View style={styles.chatContainer}>
        <ImageBackground
          source={require('@/assets/images/Chatbot-wallpaper.jpg')}
          style={styles.background}
        >
          <GiftedChat
            messages={messages}
            onSend={(newMessages) => setMessages(GiftedChat.append(messages, newMessages))}
            user={{ _id: 1 }}
            renderCustomView={renderMessage}
            renderBubble={renderBubble}
            scrollToBottom={true}
            inverted={false}
          />
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FD',
  },
  headerBackground: {
    flexDirection: 'row',
    height: height * 0.10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginTop: 50,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 60,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 30,
    zIndex: 100,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  chatContainer: {
    flex: 1,
  },
  bookingListComponent: {
    padding: 5,
    borderRadius: 10,
    width: 300,
    height: 130,
    backgroundColor: 'white',
    margin: 5,
    shadowColor: '#6699CC',
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
    backgroundColor: 'white',
    margin: 5,
    shadowColor: '#6699CC',
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
    backgroundColor: 'white',
    margin: 5,
    shadowColor: '#6699CC',
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
    backgroundColor: 'white',
    margin: 5,
    shadowColor: '#6699CC',
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
