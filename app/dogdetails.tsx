import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { useDogDetailsViewModel } from '../src/viewmodels/DogDetailsViewModel';

export default function DogDetailsScreen() {
  const router = useRouter();
  const { breed, subBreed } = useLocalSearchParams<{ breed: string; subBreed?: string }>();
  const { imageUrl, loading } = useDogDetailsViewModel(breed, subBreed);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Dog Details',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { color: '#222' },
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingLeft: 8, paddingRight: 8 }}>
              <Ionicons name="chevron-back" size={28} color="#222" />
            </Pressable>
          ),
        }}
      />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
          {breed} {subBreed ? `(${subBreed})` : ''}
        </Text>
        {loading ? (
          <ActivityIndicator style={{ flex: 1 }} />
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={{ width: 300, height: 300, borderRadius: 16 }} />
        ) : (
          <Text>No image found.</Text>
        )}
      </View>
    </>
  );
} 