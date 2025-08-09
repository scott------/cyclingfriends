import React from 'react';
import { View, Text, StyleSheet, Linking, Button } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button title="Project README" onPress={() => Linking.openURL('https://github.com/scott------/cyclingfriends')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
});
