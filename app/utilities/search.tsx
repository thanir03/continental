import Colors from '@/constants/Colors';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, SharedValue } from 'react-native-reanimated';

// Define the types for ViewToken and Item
type Item = { id: number };
type ViewToken = { item: Item; isViewable: boolean };

// ListItem Component
const ListItem: React.FC<{ itemId: number; viewableItems: SharedValue<ViewToken[]> }> = React.memo(({ itemId, viewableItems }) => {
  const rStyle = useAnimatedStyle(() => {
    // Check if the item is visible
    const isVisible = viewableItems.value.some(vItem => vItem.isViewable && vItem.item.id === itemId);

    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.5),
        },
      ],
    };
  }, [viewableItems, itemId]);

  return <Animated.View style={[styles.listItem, rStyle]} />;
});

// App Component
export default function App() {
  const viewableItems = useSharedValue<ViewToken[]>([]);

  const data: Item[] = new Array(50).fill(0).map((_, index) => ({ id: index }));

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        contentContainerStyle={{ paddingTop: 40 }}
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          viewableItems.value = vItems;
        }}
        renderItem={({ item }) => (
          <ListItem itemId={item.id} viewableItems={viewableItems} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listItem: {
    height: 200,
    width: '90%',
    backgroundColor: Colors.primaryColor, // Solid blue color
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 30,
  },
});
