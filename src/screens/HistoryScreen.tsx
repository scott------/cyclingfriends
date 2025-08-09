import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRide } from '../state/RideContext';

export default function HistoryScreen({ navigation }: any) {
  const { rides, reloadRides } = useRide();

  useEffect(() => {
    reloadRides();
  }, [reloadRides]);

  return (
    <View style={styles.container}>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('RideDetail', { id: item.id })}>
            <Text style={styles.title}>{new Date(item.startedAt).toLocaleString()}</Text>
            <Text style={styles.subtitle}>{item.distanceKm.toFixed(2)} km</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={<Text style={styles.empty}>No rides yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  row: { paddingVertical: 12 },
  sep: { height: 1, backgroundColor: '#eee' },
  title: { fontWeight: '600' },
  subtitle: { color: '#666' },
  empty: { textAlign: 'center', marginTop: 24, color: '#666' },
});
