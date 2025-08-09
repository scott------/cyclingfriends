import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { AppState } from 'react-native';
import { EventEmitter } from 'events';

export const LOCATION_TASK = 'background-location-task';
export const locationEmitter = new EventEmitter();

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.warn('Location task error', error);
    return;
  }
  const payload = data as { locations?: Location.LocationObject[] } | undefined;
  payload?.locations?.forEach((loc: Location.LocationObject) => {
    locationEmitter.emit('location', loc);
  });
});

export async function startBackgroundUpdates() {
  const hasPerm = await Location.requestBackgroundPermissionsAsync();
  if (hasPerm.status !== 'granted') return false;
  const started = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
  if (!started) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 10000,
      distanceInterval: 10,
      showsBackgroundLocationIndicator: true,
      pausesUpdatesAutomatically: true,
      foregroundService: {
        notificationTitle: 'CyclingFriends',
        notificationBody: 'Tracking your ride',
      },
    });
  }
  return true;
}

export async function stopBackgroundUpdates() {
  const started = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
  if (started) await Location.stopLocationUpdatesAsync(LOCATION_TASK);
}
