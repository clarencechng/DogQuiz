import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDogListViewModel } from '../../src/viewmodels/DogListViewModel';

export default function DogListScreen() {
  const { dogList, loading } = useDogListViewModel();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Text style={styles.header}>Dog Breeds Dictionary</Text>
        <FlatList
          data={dogList}
          keyExtractor={item => item.breed + (item.subBreed ?? '')}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}
              onPress={() =>
                router.push({
                  pathname: '/dogdetails',
                  params: { breed: item.breed, subBreed: item.subBreed ?? '' },
                })
              }
            >
              <Text style={{ color: '#222' }}>
                {item.breed}
                {item.subBreed ? ` (${item.subBreed})` : ''}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    color: '#222',
  },
}); 