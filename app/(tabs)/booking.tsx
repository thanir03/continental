import { Dimensions, ImageBackground, StyleSheet, View, TouchableOpacity, Text, ScrollView, PanResponder, Animated } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';import Color from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import TextAnimator from "@/TypingAnimations/TextAnimator";
import Listings from "@/components/Listings";
import CitiesCarousel from '@/components/CitiesCarousel';
import BookingList from '@/components/bookingList';

const { height } = Dimensions.get('window');

export default function Booking() {
  const router = useRouter();
  const headerHeight = height * 0.2;
  const [forest, setForest] = useState<any[]>([]);
  const [beaches, setBeaches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://10.0.2.2:5000/hotels/Beaches')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Beaches Data fetched successfully:', data);
        setBeaches(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('http://10.0.2.2:5000/hotels/Forests')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Cities Data fetched successfully:', data);
        setForest(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <View style={{ backgroundColor: Color.bgColor, flex: 1 }}>
      <View style={styles.header}>
        <ImageBackground
          source={require('@/assets/images/booking_wallpaper.jpg')}
          style={styles.headerBackground}
          imageStyle={styles.headerImage}
        >
          <TextAnimator
             content = "Booking"
             textStyle={styles.headerTitle}
          />
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={styles.inputTouchable}
              onPress={() => router.push('/utilities/search')}
            >
              <Text style={styles.inputText}>Where are you going?</Text>
              <View style={styles.inputIcon}>
                <Feather color="#fff" name="search" size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
      <ScrollView style={styles.content}>
          <BookingList/>
          <CitiesCarousel/>
          <View style={{paddingVertical:20}}>
            <Text style={styles.title}>Mountains</Text>
            <Listings category="Mountains" />
          </View>
          <View>
            <Text style={styles.title}>Beaches</Text>
            <Listings category="Beaches" listingData={beaches}/>
          </View>
          <View>
            <Text style={styles.title}>Forest</Text>
            <Listings category="Forests" listingData={forest}/>
          </View>
          
          <View style={styles.bottomSpacer} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingTop: height * 0.2, // Adjust padding to account for the initial header height
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    height: height * 0.2,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: 'black',
    textAlign: 'left',
    margin: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    paddingBottom: 5,
    marginRight: 250,
    marginTop: 30,
  },
  headerBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center the input in the middle of the background
    paddingHorizontal: 20,
  },
  headerImage: {
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  inputWrapper: {
    width: '100%', // Make inputWrapper full width
    alignItems: 'center', // Center the content horizontally
  },
  inputTouchable: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    height: 48,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Color.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%', // Make TouchableOpacity full width
  },
  inputText: {
    color: 'white',
    fontSize: 18,
    flex: 1,
  },
  inputIcon: {
    marginLeft: 10,
  },
  bottomSpacer: {
    height: 230,
    backgroundColor: "#fff",
  },
});