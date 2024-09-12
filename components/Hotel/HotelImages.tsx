import { StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { View } from "react-native-ui-lib";
const IMG_HEIGHT = 350;

const HotelImageList = ({
  scrollOffset,
  images,
}: {
  scrollOffset: SharedValue<number>;
  images: string[];
}) => {
  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT * 2, 0, IMG_HEIGHT / 2]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });
  return (
    <PagerView style={styles.pagerView} initialPage={0}>
      {images.map((image, index) => {
        const url = new URL(image);
        if (url.searchParams.get("s") && index > 0) {
          url.searchParams.set("s", "512x384");
        }
        console.log(index, url.toString());
        return (
          <View key={index} style={styles.page}>
            <Animated.Image
              source={{
                uri: url.toString(),
              }}
              style={[styles.image, animatedImageStyle]}
            />
          </View>
        );
      })}
    </PagerView>
  );
};

export default HotelImageList;

const styles = StyleSheet.create({
  pagerView: {
    height: IMG_HEIGHT,
  },
  page: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
