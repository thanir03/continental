import React, { useState, useEffect, useRef } from "react";
import { Video, ResizeMode } from "expo-av";
import { ScrollView, TouchableOpacity, View, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Ionicons } from '@expo/vector-icons';
import GSAPToTextAnimator from '@/TypingAnimations/GsapToAnimation';


const { width } = Dimensions.get("window");

type VideoItem = {
  $id: string;
  video: any;
  title: string;
  content: string;
};

type VideoCarouselProps = {
  posts: VideoItem[];
};

const VIDEO_CARD_WIDTH = 300;
const VIDEO_CARD_HEIGHT = 200;

const VideoCarousel: React.FC<VideoCarouselProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0].$id);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Start with the video paused
  const [isLastVideoFinished, setIsLastVideoFinished] = useState(false);
  const progress = useSharedValue(0);
  const videoRefs = useRef<Video[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const updateProgress = () => {
      if (videoRefs.current[currentVideoIndex]) {
        videoRefs.current[currentVideoIndex].getStatusAsync().then(status => {
          if (status?.isLoaded) {
            progress.value = status.positionMillis / (status.durationMillis || 1);
          }
        });
      }
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [currentVideoIndex]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: withTiming(progress.value * 50, { duration: 500 }),
  }));

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRefs.current[currentVideoIndex]?.pauseAsync();
    } else {
      videoRefs.current[currentVideoIndex]?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const resetToFirstVideo = () => {
    setCurrentVideoIndex(0);
    setActiveItem(posts[0].$id);
    setIsPlaying(false); // Keep the video paused initially
    setIsLastVideoFinished(false);
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    videoRefs.current[0]?.playAsync();
  };

  const onVideoEnd = () => {
    const nextIndex = currentVideoIndex + 1;
    if (nextIndex < posts.length) {
      setCurrentVideoIndex(nextIndex);
      setActiveItem(posts[nextIndex].$id);
      setIsPlaying(true);
      scrollViewRef.current?.scrollTo({ x: nextIndex * VIDEO_CARD_WIDTH + 25, animated: true });
      videoRefs.current[nextIndex]?.playAsync();
    } else {
      setIsPlaying(false);
      setIsLastVideoFinished(true);
    }
  };

  const handleScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / VIDEO_CARD_WIDTH);
    if (index !== currentVideoIndex) {
      videoRefs.current[currentVideoIndex]?.pauseAsync();
      videoRefs.current[currentVideoIndex]?.setPositionAsync(0);

      setCurrentVideoIndex(index);
      setActiveItem(posts[index].$id);

      // Automatically start playing the video when switching
      setIsPlaying(true);
      setIsLastVideoFinished(false);

      videoRefs.current[index]?.playAsync();
    }
  };

  const handleDotPress = (index: number) => {
    if (index !== currentVideoIndex) {
      videoRefs.current[currentVideoIndex]?.pauseAsync();
      videoRefs.current[currentVideoIndex]?.setPositionAsync(0);

      scrollViewRef.current?.scrollTo({ x: index * VIDEO_CARD_WIDTH, animated: true });

      setCurrentVideoIndex(index);
      setActiveItem(posts[index].$id);

      // Automatically start playing the video when switching
      setIsPlaying(true);
      setIsLastVideoFinished(false);

      videoRefs.current[index]?.playAsync();
    }
  };

  return (
    <View style={styles.container}>
      <GSAPToTextAnimator
         content="Explore Continental"
         textStyle={styles.title}
      />
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollViewRef}
      >
        {posts.map((item, index) => (
          <TouchableOpacity
            key={item.$id}
            style={styles.touchable}
            activeOpacity={0.8}
            onPress={() => handleDotPress(index)}
          >
            <View style={styles.itemContainer}>
              <Video
                ref={(el) => { videoRefs.current[index] = el!; }}
                source={item.video}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                shouldPlay={index === currentVideoIndex && isPlaying} // Conditional play
                onPlaybackStatusUpdate={(status) => {
                  if (status.isLoaded && status.didJustFinish) {
                    onVideoEnd();
                  }
                }}
              />
              <View style={styles.overlayContainer}>
                <Text style={styles.overlayText}>{item.title}</Text>
                <Text style={styles.overlayChildText}>{item.content}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomBarContainer}>
        <View style={styles.dotsContainer}>
          {posts.map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleDotPress(index)}>
              <View
                style={[
                  styles.dot,
                  index === currentVideoIndex ? styles.activeDot : {},
                ]}
              >
                {index === currentVideoIndex && (
                  <Animated.View style={[styles.progressIndicator, animatedProgressStyle]} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={isLastVideoFinished ? resetToFirstVideo : togglePlayPause}>
          <Ionicons
            name={isLastVideoFinished ? "refresh-circle" : (isPlaying ? "pause-circle" : "play-circle")}
            size={50}
            color="grey"
            style={styles.controlIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VideoCarousel;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: 'black',
    textAlign: 'left',
    right: 70,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  touchable: {
    width: VIDEO_CARD_WIDTH + 20,
    height: VIDEO_CARD_HEIGHT + 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: VIDEO_CARD_WIDTH,
    height: VIDEO_CARD_HEIGHT,
    marginRight: 10,
    borderRadius: 20,
    overflow: 'hidden',
    gap: 15,
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: 'black',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  overlayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  overlayChildText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  bottomBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: 120,
    height: 30,
    backgroundColor: '#444',
    borderRadius: 50,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    overflow: 'hidden',
  },
  activeDot: {
    backgroundColor: 'transparent',
    width: 50,
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 50,
    position: 'absolute',
    left: 0,
  },
  controlIcon: {
    marginLeft: 20,
    marginBottom: 10,
  },
});