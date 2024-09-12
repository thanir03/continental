import { useRef, useEffect } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LottieView from "lottie-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/Colors";

export default function SuccessfulPaymentScreen() {
  const animation = useRef<LottieView>(null);
  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    animation.current?.play();

    // Or set a specific startFrame and endFrame with:
  }, []);

  return (
    <View style={styles.animationContainer}>
      <View>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Unsuccessful Payment
        </Text>
      </View>
      <LottieView
        ref={animation}
        style={{
          width: 300,
          height: 300,
        }}
        source={require("../../assets/animation/error.json")}
      />
      <TouchableOpacity
        style={{
          backgroundColor: Colors.primaryColor,
          padding: 20,
          width: "60%",
          borderRadius: 10,
        }}
        onPress={() => {
          router.push(`/`);
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          View Booking Details
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 10,
    height: Dimensions.get("screen").height,
    gap: 40,
  },
  buttonContainer: {
    paddingTop: 20,
  },
});
