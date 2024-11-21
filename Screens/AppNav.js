import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import NewsScreen from './index1';
import BookmarkScreen from './Bookmark'; 
import HomeScreen from './Top'

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="News" 
          component={NewsScreen} 
          options={{  headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper" size={size} color={color} />
            ),
          }} 
        />
        <Tab.Screen name="Home" component={HomeScreen}
        options={{ headerShown: false, tabBarIcon:({ color, size}) => (
            <Ionicons name="home" size={size} color={color} />
        )}}/>
        <Tab.Screen 
          name="Bookmarks" 
          component={BookmarkScreen} 
          options={{ 
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bookmark" size={size} color={color} />
            ),
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
