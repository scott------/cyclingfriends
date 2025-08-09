import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { haversineKm } from '../utils/geo';

export type TrackPoint = { latitude: number; longitude: number; timestamp: number };
export type Ride = { id: string; startedAt: number; endedAt?: number; distanceKm: number };

export type RideContextValue = {
  isRecording: boolean;
  points: TrackPoint[];
  distanceKm: number;
  startRide: () => Promise<void>;
  stopRide: () => Promise<void>;
  addPoint: (p: TrackPoint) => void;
  rides: Ride[];
  reloadRides: () => Promise<void>;
};

const RideContext = createContext<RideContextValue | undefined>(undefined);

const db = SQLite.openDatabaseSync('cyclingfriends.db');

function ensureTables() {
  db.execSync(
    `CREATE TABLE IF NOT EXISTS rides (id TEXT PRIMARY KEY, startedAt INTEGER NOT NULL, endedAt INTEGER, distanceKm REAL NOT NULL);
     CREATE TABLE IF NOT EXISTS points (rideId TEXT NOT NULL, ts INTEGER NOT NULL, lat REAL NOT NULL, lon REAL NOT NULL, FOREIGN KEY(rideId) REFERENCES rides(id));`
  );
}

ensureTables();

export function RideProvider({ children }: { children: React.ReactNode }) {
  const [isRecording, setRecording] = useState(false);
  const [points, setPoints] = useState<TrackPoint[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [rides, setRides] = useState<Ride[]>([]);
  const currentRideId = useRef<string | null>(null);

  const reloadRides = useCallback(async () => {
    const rows = db.getAllSync<Ride>(`SELECT id, startedAt, endedAt, distanceKm FROM rides ORDER BY startedAt DESC`);
    setRides(rows);
  }, []);

  const startRide = useCallback(async () => {
    const id = `${Date.now()}`;
    currentRideId.current = id;
    setPoints([]);
    setDistanceKm(0);
    setRecording(true);
    db.runSync(`INSERT INTO rides (id, startedAt, distanceKm) VALUES (?, ?, ?)`, [id, Date.now(), 0]);
    await reloadRides();
  }, [reloadRides]);

  const stopRide = useCallback(async () => {
    setRecording(false);
    const id = currentRideId.current;
    if (!id) return;
    db.runSync(`UPDATE rides SET endedAt = ?, distanceKm = ? WHERE id = ?`, [Date.now(), distanceKm, id]);
    currentRideId.current = null;
    await reloadRides();
  }, [distanceKm, reloadRides]);

  const addPoint = useCallback(
    (p: TrackPoint) => {
      setPoints((prev) => {
        const next = [...prev, p];
        if (prev.length > 0) {
          const last = prev[prev.length - 1];
          const inc = haversineKm(last.latitude, last.longitude, p.latitude, p.longitude);
          setDistanceKm((d) => d + inc);
        }
        // persist
        if (currentRideId.current) {
          db.runSync(`INSERT INTO points (rideId, ts, lat, lon) VALUES (?, ?, ?, ?)`, [
            currentRideId.current,
            p.timestamp,
            p.latitude,
            p.longitude,
          ]);
        }
        return next;
      });
    },
    []
  );

  const value = useMemo<RideContextValue>(
    () => ({ isRecording, points, distanceKm, startRide, stopRide, addPoint, rides, reloadRides }),
    [addPoint, distanceKm, isRecording, points, reloadRides, rides, startRide, stopRide]
  );

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
}

export function useRide() {
  const ctx = useContext(RideContext);
  if (!ctx) throw new Error('useRide must be used within RideProvider');
  return ctx;
}
