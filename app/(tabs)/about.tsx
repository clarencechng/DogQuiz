import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>About Dog Quiz</Text>
        <Text style={styles.body}>
          Dog Quiz is a fun and educational app that tests your knowledge of dog breeds from around the world. Guess the breed from real dog photos, challenge yourself, and learn more about our canine friends! This is also my very first React Native project in history :) 
        </Text>
        <Text style={styles.credits}>Developed by Clarence Chng</Text>
        <Text style={styles.credits}>Powered by the Dog CEO API</Text>
        <Text
          style={styles.link}
          onPress={() => WebBrowser.openBrowserAsync('https://dog.ceo/dog-api/')}
        >
          https://dog.ceo/dog-api/
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acknowledgements</Text>
          <Text style={styles.sectionList}>• React Native & Expo{"\n"}• Open source community{"\n"}• Dog CEO API contributors</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this app</Text>
          <Text style={styles.sectionBody}>
            App developed and maintained by{"\n"}@clarence_chng
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 24,
    textAlign: 'left',
  },
  body: {
    fontSize: 18,
    color: '#222',
    marginBottom: 16,
    textAlign: 'left',
  },
  credits: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
    textAlign: 'left',
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  sectionList: {
    fontSize: 16,
    color: '#222',
    marginBottom: 8,
    lineHeight: 22,
  },
  sectionBody: {
    fontSize: 16,
    color: '#222',
    marginBottom: 8,
    lineHeight: 22,
  },
  link: {
    color: '#2563eb',
    textDecorationLine: 'underline',
    marginBottom: 4,
    fontSize: 16,
    textAlign: 'left',
  },
}); 