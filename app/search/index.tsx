import React, { useState, useEffect, useRef, RefObject } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { getCityList } from "@/api/Hotel";
import { City } from "@/types/data";

const SearchScreen = () => {
  const { height: screenHeight } = Dimensions.get("window");
  const searchBarHeight = screenHeight * 0.23; // Adjusted height to fit the UI
  const router = useRouter();
  const textInputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Helper to save recent searches in AsyncStorage
  const saveRecentSearch = async (searchQuery: string) => {
    try {
      const storedSearches = await AsyncStorage.getItem("recentSearches");
      let recent = storedSearches ? JSON.parse(storedSearches) : [];

      // Add new search to the front if it doesn't already exist
      if (!recent.includes(searchQuery)) {
        recent = [searchQuery, ...recent];
      }

      // Limit recent searches to 4
      if (recent.length > 4) {
        recent = recent.slice(0, 4);
      }

      // Save back to AsyncStorage
      await AsyncStorage.setItem("recentSearches", JSON.stringify(recent));
      setRecentSearches(recent);
    } catch (error) {
      console.error("Failed to save search", error);
    }
  };

  // Fetch recent searches from AsyncStorage on component mount
  const loadRecentSearches = async () => {
    try {
      const storedSearches = await AsyncStorage.getItem("recentSearches");
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (error) {
      console.error("Failed to load recent searches", error);
    }
  };

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
    loadRecentSearches();
  }, []);

  const fetchCities = async (searchQuery: string) => {
    setLoading(true);
    try {
      const res = await getCityList(searchQuery);
      setCities(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResultPress = (q: string) => {
    saveRecentSearch(q);
    router.push(`/hotel?q=${q}&no_adult=1&no_child=1&room_num=1`);
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedFetchCities = debounce(fetchCities, 300);

  useEffect(() => {
    if (query) {
      debouncedFetchCities(query);
    } else {
      setCities([]); // Clear results if query is empty
    }
  }, [query]);

  const handleClearRecentSearch = () => {
    AsyncStorage.removeItem("recentSearches");
    setRecentSearches([]);
  };
  return (
    <View style={styles.container}>
      <View>
        <LinearGradient
          colors={[Colors.primaryColor, "#5959e0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.searchContainer, { height: searchBarHeight }]}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Entypo name="cross" size={30} color="white" />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <View style={styles.locationContainer}>
              <Ionicons
                name="location"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "400" }}>
                Location
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInput
                ref={textInputRef}
                style={styles.input}
                placeholder="Where next?"
                placeholderTextColor="#fff" // Make placeholder white
                value={query}
                onChangeText={setQuery}
                selectionColor={"white"}
              />
              <TouchableOpacity
                onPress={() => {
                  if (!query) {
                    Alert.alert("Location is empty");
                  } else {
                    handleSearchResultPress(query);
                  }
                }}
              >
                <AntDesign name="search1" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.recentSearchesContainer}>
            <View style={styles.recentSearchContainer}>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              <Fontisto
                onPress={() => handleClearRecentSearch()}
                name="close"
                size={20}
                color="black"
              />
            </View>
            <FlatList
              data={recentSearches}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recentItem}
                  onPress={() => handleSearchResultPress(item)}
                >
                  <Text style={styles.recentText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Search Results */}
        {loading && (
          <View
            style={{
              height: 1000,
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          </View>
        )}

        {cities.length > 0 && (
          <View>
            <Text style={{ fontSize: 20, padding: 20, fontWeight: "bold" }}>
              Cities
            </Text>
            <FlatList
              data={cities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity
                    style={styles.cityItem}
                    onPress={() => handleSearchResultPress(item.name)}
                  >
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <Text style={styles.title}>{item.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FD",
  },
  searchContainer: {
    padding: 16,
  },
  recentSearchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  locationContainer: {
    flexDirection: "row",
    marginTop: 25,
    left: 0,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 80,
    backgroundColor: "transparent",
    color: "#fff",
    fontSize: 30,
  },
  recentSearchesContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recentItem: {
    paddingVertical: 10,
  },
  recentText: {
    fontSize: 16,
    color: "#333",
  },
  cityItem: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    gap: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 16,
  },
});

export default SearchScreen;
