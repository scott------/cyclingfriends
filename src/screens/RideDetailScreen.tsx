import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as SQLite from 'expo-sqlite';

export default function RideDetailScreen({ route }: any) {
  const { id } = route.params as { id: string };
  const db = SQLite.openDatabaseSync('cyclingfriends.db');
  const points = useMemo(() => {
    const rows = db.getAllSync<{ ts: number; lat: number; lon: number }>(
      `SELECT ts, lat, lon FROM points WHERE rideId = ? ORDER BY ts ASC`,
      [id]
    );
    return rows.map((r) => ({ latitude: r.lat, longitude: r.lon }));
  }, [db, id]);

  const start = points[0] || { latitude: 37.78825, longitude: -122.4324 };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{ ...start, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
        {points.length > 1 && <Polyline coordinates={points} strokeColor="#1e90ff" strokeWidth={4} />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
