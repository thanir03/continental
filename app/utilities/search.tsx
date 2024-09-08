import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors'; // Assuming you have a Colors file with primaryColor
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface City {
  cityId: string;
  image: string;
  name: string;
}

const SearchPage = () => {
  const { height: screenHeight } = Dimensions.get('window');
  const searchBarHeight = screenHeight * 0.2; // Adjusted height to fit the UI
  const router = useRouter();

  const [query, setQuery] = useState<string>('');
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Helper to save recent searches in AsyncStorage
  const saveRecentSearch = async (searchQuery: string) => {
    try {
      const storedSearches = await AsyncStorage.getItem('recentSearches');
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
      await AsyncStorage.setItem('recentSearches', JSON.stringify(recent));
      setRecentSearches(recent);
    } catch (error) {
      console.error("Failed to save search", error);
    }
  };

  // Fetch recent searches from AsyncStorage on component mount
  const loadRecentSearches = async () => {
    try {
      const storedSearches = await AsyncStorage.getItem('recentSearches');
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (error) {
      console.error("Failed to load recent searches", error);
    }
  };

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const fetchCities = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await axios.get<City[]>('http://10.0.2.2:5000/city', {
        params: { query: searchQuery },
      });
      setCities(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResultPress = async (searchQuery: string) => {
    await saveRecentSearch(searchQuery); // Save the search to AsyncStorage
    // If needed, you can navigate to another screen or perform other actions here
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

  return (
    <View style={styles.container}>
      {/* Search Bar with Gradient Background */}
      <LinearGradient
        colors={[Colors.primaryColor, '#5959e0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.searchContainer, { height: searchBarHeight }]}
      >
        <TouchableOpacity onPress={router.back}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#fff" style={styles.icon} />
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: "400" }}>Location</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Where next?"
            placeholderTextColor="#fff" // Make placeholder white
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </LinearGradient>

      {/* Recent Searches */}
      <View style={styles.recentSearchesContainer}>
        <Text style={styles.recentTitle}>Recent Searches</Text>
        <FlatList
          data={recentSearches}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.recentItem} onPress={() => setQuery(item)}>
              <Text style={styles.recentText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Search Results */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      ) : (
        <FlatList
          data={cities}
          keyExtractor={(item) => item.cityId}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <TouchableOpacity onPress={() => handleSearchResultPress(item.name)}>
                <Text style={styles.title}>{item.name}</Text>
                <Image source={{ uri: item.image }} style={styles.image} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
  inputContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    marginTop: 25,
    left: 0,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 80,
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 30,
  },
  recentSearchesContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentItem: {
    paddingVertical: 10,
  },
  recentText: {
    fontSize: 16,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 16,
  },
});

export default SearchPage;
