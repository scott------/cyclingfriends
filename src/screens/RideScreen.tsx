import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import MapView, { Polyline, Marker, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRide } from '../state/RideContext';

export default function RideScreen() {
  const { isRecording, points, distanceKm, startRide, stopRide, addPoint } = useRide();
  const subRef = useRef<Location.LocationSubscription | null>(null);

  const requestPerms = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Location permission is needed to track your ride.');
      return false;
    }
    return true;
  }, []);

  const onStart = useCallback(async () => {
    if (!(await requestPerms())) return;
    await startRide();
    // start a foreground location watcher
    subRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 5 },
      (loc) => {
        addPoint({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp ?? Date.now(),
        });
      }
    );
  }, [addPoint, requestPerms, startRide]);

  const onStop = useCallback(async () => {
    await stopRide();
    if (subRef.current) {
      subRef.current.remove();
      subRef.current = null;
    }
  }, [stopRide]);

  useEffect(() => {
    return () => {
      if (subRef.current) {
        subRef.current.remove();
        subRef.current = null;
      }
    };
  }, []);

  const start = points[0];
  const region = start
    ? { latitude: start.latitude, longitude: start.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }
    : { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.1, longitudeDelta: 0.1 };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        {points.length > 0 && (
          <>
            <Polyline
              coordinates={points.map((p: { latitude: number; longitude: number }): LatLng => ({ latitude: p.latitude, longitude: p.longitude }))}
              strokeColor="#1e90ff"
              strokeWidth={4}
            />
            <Marker coordinate={{ latitude: points[0].latitude, longitude: points[0].longitude }} title="Start" />
            <Marker coordinate={{ latitude: points[points.length - 1].latitude, longitude: points[points.length - 1].longitude }} title="Now" />
          </>
        )}
      </MapView>
      <View style={styles.toolbar}>
        <Text style={styles.stat}>{distanceKm.toFixed(2)} km</Text>
        {isRecording ? (
          <Button title="Stop" onPress={onStop} />
        ) : (
          <Button title="Start Ride" onPress={onStart} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  toolbar: { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stat: { fontSize: 18, fontWeight: '600' },
});
