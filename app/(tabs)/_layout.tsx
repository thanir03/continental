import { View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 60,
          bottom: 10,
          paddingHorizontal: 10,
          left: 20,
          right: 20,
          elevation: 10,
          backgroundColor: "#fff", // #2D3037
          borderRadius: 40,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#6699CC",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          zIndex: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={focused ? Colors.primaryColor : "gray"} // Active icon is white, inactive is gray
                size={24}
                style={
                  focused
                    ? {
                        textShadowColor: "white",
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 4,
                      }
                    : {}
                }
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                color={focused ? Colors.primaryColor : "gray"} // Active icon is white, inactive is gray
                size={24}
                style={
                  focused
                    ? {
                        textShadowColor: "white",
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 4,
                      }
                    : {}
                }
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "chatbubble" : "chatbubble-outline"}
                color={focused ? Colors.primaryColor : "gray"} // Active icon is white, inactive is gray
                size={24}
                style={
                  focused
                    ? {
                        textShadowColor: "white",
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 4,
                      }
                    : {}
                }
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "bookmark" : "bookmark-outline"}
                color={focused ? Colors.primaryColor : "gray"} // Active icon is white, inactive is gray
                size={24}
                style={
                  focused
                    ? {
                        textShadowColor: "white",
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 4,
                      }
                    : {}
                }
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={focused ? Colors.primaryColor : "gray"} // Active icon is white, inactive is gray
                size={24}
                style={
                  focused
                    ? {
                        textShadowColor: "white",
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 4,
                      }
                    : {}
                }
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
