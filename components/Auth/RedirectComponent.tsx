import { View, Text } from "react-native";
import React from "react";
import { Href, Link, LinkProps } from "expo-router";

interface RedirectComponentProps {
  mainText: string;
  href: Href<LinkProps<any>>;
  linkText: string;
}

const RedirectComponent = (props: RedirectComponentProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
      }}
    >
      <Text style={{ textAlign: "center", fontSize: 15 }}>
        {props.mainText}
      </Text>
      <Link
        style={{
          color: "blue",
          fontSize: 15,
        }}
        href={props.href}
      >
        {props.linkText}
      </Link>
    </View>
  );
};

export default RedirectComponent;
