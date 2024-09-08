import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('screen');
const ITEM_WIDTH = width * 0.65;
const ITEM_HEIGHT = 350;

interface City {
  cityId: string;
  name: string;
  image: string;
}

const CityCarousel = () => {
  const [cities, setCities] = React.useState<City[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const scrollX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    fetch('http://10.0.2.2:5000/city')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: City[]) => {
        console.log('City Data fetched successfully:', data);
        setCities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cities</Text>
      <StatusBar hidden />
      <Animated.FlatList
        data={cities}
        keyExtractor={(item) => item.cityId}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="center"
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];

          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-20, 0, 20],
            extrapolate: 'clamp',
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
          });

          return (
            <Link href={`/cities/${item.cityId}`} asChild>
              <Pressable>
                <View style={{ width: ITEM_WIDTH, marginTop: 10 }}>
                  <Animated.View
                    style={[
                      styles.imageContainer,
                      {
                        transform: [{ translateX }, { scale }],
                        opacity,
                      },
                    ]}
                  >
                    <Image source={{ uri: item.image }} style={styles.image} />
                    
                    {/* Gradient and Blur View */}
                    <View style={styles.textOverlay}>
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.gradientOverlay}
                      >
                        <BlurView intensity={300} style={styles.blurView}>
                          <Text style={styles.cityName}>{item.name}</Text>
                          <Text style={styles.ExploreText}>Explore</Text>
                        </BlurView>
                     </LinearGradient>
                    </View>
                  </Animated.View>
                </View>
              </Pressable>
            </Link>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'black',
    textAlign: 'left',
    marginTop: 20,
    paddingLeft: 10, // Adjusted to move the title to the left
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F6F8FD',
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 10, // Directly controls the gap between items
    backgroundColor: '#333',
    right: 8,
  },
  image: {
    width: '100%',
    height: ITEM_HEIGHT,
    resizeMode: 'cover',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%', // Adjust height as needed
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  blurView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cityName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '800',
    paddingBottom: 6,
  },
  ExploreText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '400',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default CityCarousel;