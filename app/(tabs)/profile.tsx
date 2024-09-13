import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import BenefitFlatList from '@/components/benefitFlatList';
import { useRouter } from 'expo-router';

const { height: upperContainerHeight } = Dimensions.get('window');

export default function Profile() {
  const router = useRouter();

  return (
    <ScrollView>
      <View style={styles.content}>
        <LinearGradient
          colors={[Colors.primaryColor, '#5959e0']} // Softer gradient for light mode
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.upperContainer, { height: upperContainerHeight * 0.85 }]}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Sim Jingjia</Text>
            <Text style={styles.memberText}>Member</Text>
          </View>

          <View style={styles.personContainer}>
            <TouchableOpacity>
              <Ionicons name="person-circle-outline" color={'white'} size={40}/>
            </TouchableOpacity>
          </View>

          <View style={styles.centerContent}>
            <Ionicons name="bed" size={60} color={'#fff'} />
            <Text style={styles.subText}>Book a night to earn free points</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/utilities/search')}>
              <Text style={styles.buttonText}>Explore Hotels</Text>
            </TouchableOpacity>
          </View>

          <View style={{ position: 'absolute', bottom: 80 }}>
            <BenefitFlatList />
          </View>

          <View style={styles.lowerUpperContent}>
            <Text style={styles.lowerContentText}>Points Earned: 0</Text>

            <TouchableOpacity style={styles.bookingButton}>
              <Text style={styles.lowerContentTextBooking}>View Booking</Text>
              <Ionicons name="arrow-forward" size={20} color={'white'} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Additional Buttons for Account Management */}
      <View style={styles.accountActions}>
        <Text style={{color:"#777", fontSize: 15, fontWeight: 'bold', marginTop: 10, marginLeft: 10}}>Additional Actions</Text>
        <TouchableOpacity style={styles.accountButton}>
          <Text style={styles.buttonText}>Edit Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountButton}>
          <Text style={styles.buttonText}>Login / Register</Text>
        </TouchableOpacity>
        <View style={{backgroundColor: '#F9FCFF', padding: 15}}/>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewStyle: {
    flex: 1, // Ensures that the ScrollView takes up the entire screen
    backgroundColor: '#F9FCFF', // Matches the content background
  },
  content: {
    flex: 1,
    backgroundColor: '#F9FCFF', // Slightly lighter background for contrast
  },
  upperContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,    
  },
  infoContainer: {
    position: 'absolute',
    left: 30,
    top: 30,
  },
  personContainer:{
    position: 'absolute',
    right: 30,
    top: 30,
  },
  infoText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
  memberText: {
    color: "white",
    fontWeight: "600",
    fontSize: 25,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  subText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.primaryColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
  lowerUpperContent: {
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    paddingVertical: 10,
    width: '100%',
    borderTopWidth: 1,
    borderColor: "#fff",
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  lowerContentText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  lowerContentTextBooking: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginRight: 5,
  },
  bookingButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountActions: {
    backgroundColor: "#F6F8FD",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  accountButton: {
    backgroundColor: "transparent",
    padding: 15,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: 'light-grey',
  },
  bottomSpacer: {
    height: 80,
    backgroundColor: "#F6F8FD",
  },
  logoutButton:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: "100%",
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    shadowColor: '#6699CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});
