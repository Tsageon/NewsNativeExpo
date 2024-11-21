import React from 'react';
import { StyleSheet, View  } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNav from './Screens/AppNav'

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
   <AppNav/>
  </View></SafeAreaProvider>
    
  )
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: 'whitesmoke'
}
});