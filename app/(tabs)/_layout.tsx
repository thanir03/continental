import { View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 50,
          bottom: 10,
          paddingHorizontal: 10,
          left: 16,
          right: 16,
          elevation: 0,
          backgroundColor: "#333333", // Set the background color of the tab bar
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
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
                color={focused ? "white" : "gray"} // Active icon is white, inactive is gray
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
                color={focused ? "white" : "gray"} // Active icon is white, inactive is gray
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
                color={focused ? "white" : "gray"} // Active icon is white, inactive is gray
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
        name="liked"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "bookmark" : "bookmark-outline"}
                color={focused ? "white" : "gray"} // Active icon is white, inactive is gray
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
                color={focused ? "white" : "gray"} // Active icon is white, inactive is gray
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
