import React from 'react';
import { StyleSheet, Text , View  } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NewsScreen from './Screens/index1';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
    <NewsScreen />
  </View></SafeAreaProvider>
    
  )
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: 'whitesmoke'
}
});