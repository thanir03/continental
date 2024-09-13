import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

const ChatButton: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meet your personal assistant</Text>
      <TouchableOpacity onPress={() => router.push('/utilities/chatbot')}>   
        <View style={styles.cardContainer}>
          <Image
            source={require('@/assets/images/hu-tao.jpg')}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Chat with Hu Tao</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FD',
    justifyContent: 'flex-start',
    paddingTop: 20,  // Added padding for separation from previous components
  },
  cardContainer: {
    width: '100%',  // Made the card full-width
    height: 220,
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    elevation: 5,
    marginTop: 10,  // Added margin to separate it from the title
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',
    position: 'absolute',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    height: 60,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,  // Added margin to create separation between title and card
  },
});

export default ChatButton;
