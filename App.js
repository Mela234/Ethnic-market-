if (typeof global.DOMRect === 'undefined') {
  global.DOMRect = function(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.top = this.y;
    this.left = this.x;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  };
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import Feather from '@expo/vector-icons/Feather';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import StoreScreen from './src/screens/StoreScreen';
import CartScreen from './src/screens/CartScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AuthScreen from './src/screens/AuthScreen';
import { COLORS } from './src/theme/colors';
import { CartProvider } from './src/context/CartContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Store" component={StoreScreen} />
    </HomeStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.mustard,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Explore: 'search',
            Cart: 'shopping-bag',
            Orders: 'file-text',
            Profile: 'user',
          };
          return <Feather name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/**
 * Landing gate, DoorDash-style.
 *
 *   booting            -> restoring the saved session
 *   !signedIn && !guest -> landing screen (sign up / sign in / browse as guest)
 *   otherwise           -> the app
 *
 * This is deliberately NOT a wall: "Browse as guest" gets you straight in.
 * The real auth requirement lives on checkout, in CartScreen.
 *
 * Lives in its own component because useAuth() must run inside AuthProvider.
 */
function RootNavigator() {
  const { signedIn, guest, booting, continueAsGuest } = useAuth();

  if (booting) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashLogo}>🧺</Text>
        <ActivityIndicator color={COLORS.mustard} />
      </View>
    );
  }

  if (!signedIn && !guest) {
    return <AuthScreen onGuest={continueAsGuest} />;
  }

  return <MainTabs />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}

function ExploreScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: COLORS.black, fontSize: 16 }}>Explore coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.black,
    borderTopColor: COLORS.mustard,
    borderTopWidth: 2,
    paddingTop: 6,
    paddingBottom: 10,
    height: 70,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  splash: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  splashLogo: { fontSize: 56 },
});
