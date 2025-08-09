import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import RideScreen from './src/screens/RideScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { RideProvider } from './src/state/RideContext';
import RideDetailScreen from './src/screens/RideDetailScreen';

export default function App() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  function HistoryStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="HistoryList" component={HistoryScreen} options={{ title: 'History' }} />
        <Stack.Screen name="RideDetail" component={RideDetailScreen} options={{ title: 'Ride' }} />
      </Stack.Navigator>
    );
  }
  return (
    <RideProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Ride" component={RideScreen} />
          <Tab.Screen name="History" component={HistoryStack} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </RideProvider>
  );
}

const styles = StyleSheet.create({
  // global styles placeholder
});
